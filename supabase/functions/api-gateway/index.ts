// Alazab Central Auth — API Gateway
// Single public entrypoint for every Alazab system to talk to auth.alazab.com
// Routes are versioned under /v1 and always return { ok, data|error, request_id }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-request-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/* ------------------------------------------------------------------ utils */

type Json = Record<string, unknown>;

function json(body: Json, status = 200, requestId = "") {
  return new Response(JSON.stringify({ ...body, request_id: requestId }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
const ok = (data: unknown, id: string, status = 200) =>
  json({ ok: true, data }, status, id);
const fail = (code: string, message: string, id: string, status = 400) =>
  json({ ok: false, error: { code, message } }, status, id);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_RE = /^\d{6}$/;

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/** Sliding-window in-memory rate limiter (per isolate). */
const buckets = new Map<string, number[]>();
function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) buckets.clear();
  return { allowed: hits.length <= limit, remaining: Math.max(0, limit - hits.length) };
}

async function requireUser(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) return { user: null, token: "" };
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return { user: null, token };
  return { user: data.user, token };
}

async function rolesOf(userId: string): Promise<string[]> {
  const { data } = await admin.from("adp_user_roles").select("role").eq("user_id", userId);
  return (data ?? []).map((r: { role: string }) => r.role);
}

function canAccess(app: { is_active: boolean; allowed_roles: string[] | null }, roles: string[]) {
  if (!app.is_active) return false;
  const allowed = app.allowed_roles ?? [];
  if (allowed.length === 0) return true;
  if (roles.includes("platform_owner") || roles.includes("platform_admin")) return true;
  return allowed.some((r) => roles.includes(r));
}

async function audit(
  event: string,
  status: "success" | "failure",
  email: string | null,
  description: string,
  req: Request,
  detail: Json = {},
) {
  try {
    await admin.rpc("log_security_event", {
      _category: "auth",
      _event_type: event,
      _status: status,
      _actor_email: email,
      _description: description,
      _detail: { ...detail, channel: "api-gateway" },
      _ip_address: clientIp(req),
      _user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400),
    });
  } catch {
    /* auditing must never break the request */
  }
}

/* ----------------------------------------------------------------- routes */

async function handle(req: Request, path: string, requestId: string): Promise<Response> {
  const url = new URL(req.url);
  const ip = clientIp(req);
  let body: Json = {};
  if (req.method === "POST") {
    try {
      body = (await req.json()) as Json;
    } catch {
      return fail("invalid_json", "Request body must be valid JSON", requestId, 400);
    }
  }

  switch (`${req.method} ${path}`) {
    /* ------------------------------------------------------------ health */
    case "GET /health":
    case "GET /v1/health":
      return ok({ status: "healthy", service: "alazab-auth-gateway", version: "1.0.0", time: new Date().toISOString() }, requestId);

    case "GET /v1/openapi":
      return ok(OPENAPI, requestId);

    /* --------------------------------------------------------- otp login */
    case "POST /v1/auth/otp/request": {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(email) || email.length > 254)
        return fail("invalid_email", "A valid email address is required", requestId, 400);
      if (!rateLimit(`otp:${ip}`, 5, 60_000).allowed || !rateLimit(`otp:${email}`, 3, 60_000).allowed)
        return fail("rate_limited", "Too many code requests. Try again in a minute.", requestId, 429);

      const redirectTo = typeof body.redirect_to === "string" ? body.redirect_to : undefined;
      const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
      const { error } = await anon.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) {
        await audit("otp_requested", "failure", email, error.message, req);
        return fail("otp_send_failed", error.message, requestId, 400);
      }
      await audit("otp_requested", "success", email, "OTP requested via API gateway", req);
      return ok({ sent: true, email, expires_in: 3600 }, requestId);
    }

    case "POST /v1/auth/otp/verify": {
      const email = String(body.email ?? "").trim().toLowerCase();
      const token = String(body.token ?? "").trim();
      if (!EMAIL_RE.test(email)) return fail("invalid_email", "A valid email address is required", requestId, 400);
      if (!OTP_RE.test(token)) return fail("invalid_token", "The code must be 6 digits", requestId, 400);
      if (!rateLimit(`verify:${ip}`, 10, 60_000).allowed)
        return fail("rate_limited", "Too many attempts", requestId, 429);

      const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
      const { data, error } = await anon.auth.verifyOtp({ email, token, type: "email" });
      if (error || !data.session) {
        await audit("otp_verified", "failure", email, "Invalid one-time code", req);
        return fail("otp_invalid", error?.message ?? "Invalid or expired code", requestId, 401);
      }
      await audit("otp_verified", "success", email, "OTP verified via API gateway", req);
      await audit("login", "success", email, "Signed in with one-time code", req);
      return ok(
        {
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            token_type: "bearer",
          },
          user: { id: data.user?.id, email: data.user?.email },
        },
        requestId,
      );
    }

    /* ---------------------------------------------------- password login */
    case "POST /v1/auth/password/login": {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      if (!EMAIL_RE.test(email) || password.length < 6 || password.length > 200)
        return fail("invalid_credentials_format", "Email and password are required", requestId, 400);
      if (!rateLimit(`pw:${ip}`, 10, 60_000).allowed || !rateLimit(`pw:${email}`, 5, 300_000).allowed)
        return fail("rate_limited", "Too many login attempts", requestId, 429);

      const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
      const { data, error } = await anon.auth.signInWithPassword({ email, password });
      if (error || !data.session) {
        await audit("failed_login", "failure", email, "Invalid credentials", req);
        return fail("invalid_credentials", "Invalid email or password", requestId, 401);
      }

      const { data: mfa } = await admin
        .from("adp_user_mfa")
        .select("email_otp_required")
        .eq("user_id", data.user.id)
        .maybeSingle();
      const mfaRequired = mfa?.email_otp_required ?? false;

      if (mfaRequired) {
        await anon.auth.signOut();
        await anon.auth.signInWithOtp({ email });
        await audit("otp_requested", "success", email, "2FA step-up code sent", req);
        return ok({ mfa_required: true, next: "/v1/auth/otp/verify", email }, requestId);
      }

      await audit("login", "success", email, "Signed in with password", req);
      return ok(
        {
          mfa_required: false,
          session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
            token_type: "bearer",
          },
          user: { id: data.user.id, email: data.user.email },
        },
        requestId,
      );
    }

    /* -------------------------------------------------- password recovery */
    case "POST /v1/auth/password/reset": {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return fail("invalid_email", "A valid email address is required", requestId, 400);
      if (!rateLimit(`reset:${ip}`, 5, 300_000).allowed)
        return fail("rate_limited", "Too many reset requests", requestId, 429);

      const redirectTo =
        typeof body.redirect_to === "string" ? body.redirect_to : `${url.origin}/reset-password`;
      const anon = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });
      await anon.auth.resetPasswordForEmail(email, { redirectTo });
      await audit("password_reset", "success", email, "Password reset link requested", req);
      // Always success — never reveal whether the account exists.
      return ok({ sent: true }, requestId);
    }

    /* ----------------------------------------------------------- session */
    case "GET /v1/me": {
      const { user } = await requireUser(req);
      if (!user) return fail("unauthorized", "A valid bearer token is required", requestId, 401);
      const [roles, mfa, profile] = await Promise.all([
        rolesOf(user.id),
        admin.from("adp_user_mfa").select("email_otp_required, last_verified_at").eq("user_id", user.id).maybeSingle(),
        admin.from("adp_profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);
      return ok(
        {
          user: { id: user.id, email: user.email, created_at: user.created_at },
          roles,
          is_admin: roles.includes("platform_owner") || roles.includes("platform_admin"),
          mfa: { email_otp_required: mfa.data?.email_otp_required ?? false, last_verified_at: mfa.data?.last_verified_at ?? null },
          profile: profile.data ?? null,
        },
        requestId,
      );
    }

    case "POST /v1/auth/logout": {
      const { user, token } = await requireUser(req);
      if (!user) return fail("unauthorized", "A valid bearer token is required", requestId, 401);
      const scoped = createClient(SUPABASE_URL, ANON_KEY, {
        auth: { persistSession: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const scope = body.scope === "global" ? "global" : "local";
      await scoped.auth.signOut({ scope });
      await audit("logout", "success", user.email ?? null, `Signed out (${scope})`, req);
      return ok({ signed_out: true, scope }, requestId);
    }

    /* -------------------------------------------------------- app registry */
    case "GET /v1/apps": {
      const { user } = await requireUser(req);
      if (!user) return fail("unauthorized", "A valid bearer token is required", requestId, 401);
      const roles = await rolesOf(user.id);
      const { data } = await admin.from("sso_apps").select("*").order("sort_order", { ascending: true });
      const apps = (data ?? []).filter((a) => canAccess(a, roles)).map((a) => ({
        slug: a.slug,
        name_ar: a.name_ar,
        name_en: a.name_en,
        description_ar: a.description_ar,
        description_en: a.description_en,
        base_url: a.base_url,
        logo_url: a.logo_url,
        color: a.color,
        is_default: a.is_default,
      }));
      return ok({ apps, roles }, requestId);
    }

    /* ------------------------------------------------------- sso handoff */
    case "POST /v1/sso/authorize": {
      const { user, token } = await requireUser(req);
      if (!user) return fail("unauthorized", "A valid bearer token is required", requestId, 401);
      const slug = String(body.slug ?? "").trim();
      if (!slug || slug.length > 64) return fail("invalid_slug", "An app slug is required", requestId, 400);

      const { data: app } = await admin.from("sso_apps").select("*").eq("slug", slug).maybeSingle();
      if (!app || !app.is_active) return fail("app_not_found", "Unknown or inactive application", requestId, 404);

      const roles = await rolesOf(user.id);
      if (!canAccess(app, roles)) {
        await audit("provider_used", "failure", user.email ?? null, `Denied SSO handoff to ${slug}`, req, { slug });
        return fail("forbidden", "You are not authorised to access this application", requestId, 403);
      }

      const refresh = typeof body.refresh_token === "string" ? body.refresh_token : "";
      const base = app.redirect_url || app.base_url;
      const hash = new URLSearchParams({
        access_token: token,
        refresh_token: refresh,
        expires_in: "3600",
        token_type: "bearer",
        type: "sso",
      });
      await audit("provider_used", "success", user.email ?? null, `SSO handoff to ${slug}`, req, { slug });
      return ok({ slug, redirect_url: `${base}${base.includes("#") ? "&" : "#"}${hash.toString()}` }, requestId);
    }

    /* -------------------------------------------------------- audit trail */
    case "GET /v1/audit": {
      const { user } = await requireUser(req);
      if (!user) return fail("unauthorized", "A valid bearer token is required", requestId, 401);
      const roles = await rolesOf(user.id);
      const isAdmin = roles.includes("platform_owner") || roles.includes("platform_admin");
      const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
      let q = admin.from("adp_security_events").select("*").eq("category", "auth");
      if (!isAdmin) q = q.eq("actor_id", user.id);
      const { data } = await q.order("created_at", { ascending: false }).limit(limit);
      return ok({ events: data ?? [], scope: isAdmin ? "all" : "self" }, requestId);
    }

    default:
      return fail("not_found", `No route for ${req.method} ${path}`, requestId, 404);
  }
}

/* ------------------------------------------------------------- openapi doc */

const OPENAPI = {
  service: "Alazab Central Authentication Gateway",
  base_path: "/functions/v1/api-gateway",
  auth: "Bearer <supabase_access_token> for protected routes",
  endpoints: [
    { method: "GET", path: "/v1/health", auth: false, description: "Service health probe" },
    { method: "GET", path: "/v1/openapi", auth: false, description: "This document" },
    { method: "POST", path: "/v1/auth/otp/request", auth: false, body: { email: "string", redirect_to: "string?" } },
    { method: "POST", path: "/v1/auth/otp/verify", auth: false, body: { email: "string", token: "6 digits" } },
    { method: "POST", path: "/v1/auth/password/login", auth: false, body: { email: "string", password: "string" } },
    { method: "POST", path: "/v1/auth/password/reset", auth: false, body: { email: "string", redirect_to: "string?" } },
    { method: "POST", path: "/v1/auth/logout", auth: true, body: { scope: "local | global" } },
    { method: "GET", path: "/v1/me", auth: true, description: "User, roles, MFA state and profile" },
    { method: "GET", path: "/v1/apps", auth: true, description: "RBAC-filtered app registry" },
    { method: "POST", path: "/v1/sso/authorize", auth: true, body: { slug: "string", refresh_token: "string?" } },
    { method: "GET", path: "/v1/audit", auth: true, description: "Auth audit events (self, or all for admins)" },
  ],
  rate_limits: {
    "otp/request": "5 per minute per IP, 3 per minute per email",
    "password/login": "10 per minute per IP, 5 per 5 minutes per account",
    "password/reset": "5 per 5 minutes per IP",
  },
};

/* -------------------------------------------------------------- entrypoint */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/functions\/v1/, "").replace(/^\/api-gateway/, "").replace(/\/+$/, "") || "/health";

  try {
    return await handle(req, path.startsWith("/") ? path : `/${path}`, requestId);
  } catch (e) {
    console.error("gateway_error", requestId, e);
    return fail("internal_error", "An unexpected error occurred", requestId, 500);
  }
});
