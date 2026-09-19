// Alazab Central Auth — Portal JWT service for Outpost (analytics portal)
// Routes (all prefixed by /functions/v1/portal-jwt):
//   GET  /health              → service probe
//   POST /issue               → { slug } + Bearer session  → signed Portal JWT + launch URL
//   GET|POST /refresh         → re-validates the Supabase session and mints a fresh Portal JWT.
//                               With ?redirect=1 it 302-redirects straight back into Outpost —
//                               this is the "Refresh URL" Outpost calls when its session expires.
//   GET  /verify?token=...    → Outpost-side verification of a Portal JWT
//
// Manual CORS headers (project constraint: no external CORS libraries).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { signPortalJwt, verifyPortalJwt } from "../_shared/portal-jwt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-request-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PORTAL_JWT_SECRET = Deno.env.get("PORTAL_JWT_SECRET") ?? "";
const ISSUER = "https://auth.alazab.com";
const TTL_SECONDS = 15 * 60; // short-lived: Outpost refreshes through /refresh

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Json = Record<string, unknown>;

const json = (body: Json, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
const ok = (data: unknown) => json({ ok: true, data });
const fail = (code: string, message: string, status = 400) =>
  json({ ok: false, error: { code, message } }, status);

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
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
      _detail: { ...detail, channel: "portal-jwt" },
      _ip_address: clientIp(req),
      _user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400),
    });
  } catch {
    /* auditing must never break the request */
  }
}

async function sessionUser(req: Request, url: URL) {
  const header = req.headers.get("Authorization") ?? "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  const token = bearer || url.searchParams.get("access_token") || "";
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
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

/** Mints a Portal JWT for a user + registered app and records it centrally. */
async function mint(
  req: Request,
  user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> },
  slug: string,
  refreshedFrom: string | null,
) {
  const { data: app } = await admin.from("sso_apps").select("*").eq("slug", slug).maybeSingle();
  if (!app) return { error: fail("app_not_found", "Unknown application", 404) };

  const roles = await rolesOf(user.id);
  if (!canAccess(app, roles)) {
    await audit("portal_token_denied", "failure", user.email ?? null, `Denied Portal JWT for ${slug}`, req, { slug });
    return { error: fail("forbidden", "You are not authorised to access this portal", 403) };
  }

  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  const token = await signPortalJwt(
    {
      iss: ISSUER,
      aud: app.slug,
      sub: user.id,
      jti,
      email: user.email ?? null,
      name: (user.user_metadata?.full_name as string) ?? null,
      roles,
      app: app.slug,
      iat: now,
      nbf: now,
      exp: now + TTL_SECONDS,
    },
    PORTAL_JWT_SECRET,
  );

  await admin.from("adp_portal_tokens").insert({
    jti,
    user_id: user.id,
    app_slug: app.slug,
    roles,
    expires_at: new Date((now + TTL_SECONDS) * 1000).toISOString(),
    refreshed_from: refreshedFrom,
    ip_address: clientIp(req),
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400),
  });

  const base = app.redirect_url || app.base_url;
  const sep = base.includes("?") ? "&" : "?";
  const launchUrl = `${base}${sep}portal_token=${encodeURIComponent(token)}`;
  const refreshUrl =
    `${SUPABASE_URL}/functions/v1/portal-jwt/refresh?slug=${encodeURIComponent(app.slug)}&redirect=1`;

  await audit(
    refreshedFrom ? "portal_token_refreshed" : "portal_token_issued",
    "success",
    user.email ?? null,
    `Portal JWT ${refreshedFrom ? "refreshed" : "issued"} for ${app.slug}`,
    req,
    { slug: app.slug, jti },
  );

  return {
    data: {
      token,
      token_type: "bearer",
      expires_in: TTL_SECONDS,
      expires_at: new Date((now + TTL_SECONDS) * 1000).toISOString(),
      jti,
      roles,
      app: { slug: app.slug, name_ar: app.name_ar, name_en: app.name_en, base_url: app.base_url },
      launch_url: launchUrl,
      refresh_url: refreshUrl,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const path =
    url.pathname.replace(/^\/functions\/v1/, "").replace(/^\/portal-jwt/, "").replace(/\/+$/, "") ||
    "/health";

  try {
    if (!PORTAL_JWT_SECRET) return fail("not_configured", "PORTAL_JWT_SECRET is missing", 500);

    if (path === "/health") {
      return ok({ status: "healthy", service: "alazab-portal-jwt", issuer: ISSUER, ttl: TTL_SECONDS });
    }

    if (path === "/verify") {
      const token = url.searchParams.get("token") ?? "";
      if (!token) return fail("missing_token", "A token query parameter is required", 400);
      const result = await verifyPortalJwt(token, PORTAL_JWT_SECRET);
      if (!result.valid || !result.claims) {
        return json({ ok: true, data: { valid: false, reason: result.reason } });
      }
      const { data: row } = await admin
        .from("adp_portal_tokens")
        .select("revoked_at")
        .eq("jti", result.claims.jti)
        .maybeSingle();
      if (row?.revoked_at) return json({ ok: true, data: { valid: false, reason: "revoked" } });
      return ok({ valid: true, claims: result.claims });
    }

    if (path === "/issue" || path === "/refresh") {
      let body: Json = {};
      if (req.method === "POST") {
        try {
          body = (await req.json()) as Json;
        } catch {
          body = {};
        }
      }
      const slug = String(body.slug ?? url.searchParams.get("slug") ?? "outpost").trim().toLowerCase();
      if (!SLUG_RE.test(slug)) return fail("invalid_slug", "A valid application slug is required", 400);

      const wantsRedirect = url.searchParams.get("redirect") === "1";
      const user = await sessionUser(req, url);

      if (!user) {
        // Session expired → bounce the browser back to the central portal to re-authenticate.
        if (wantsRedirect) {
          const back = `${ISSUER}/portal/refresh?slug=${encodeURIComponent(slug)}`;
          return new Response(null, { status: 302, headers: { ...corsHeaders, Location: back } });
        }
        return fail("unauthorized", "A valid Alazab session is required", 401);
      }

      const previous =
        typeof body.previous_jti === "string" && /^[0-9a-f-]{36}$/i.test(body.previous_jti)
          ? body.previous_jti
          : null;

      const result = await mint(req, user, slug, path === "/refresh" ? previous : null);
      if (result.error) return result.error;

      if (wantsRedirect) {
        return new Response(null, {
          status: 302,
          headers: { ...corsHeaders, Location: result.data!.launch_url, "Cache-Control": "no-store" },
        });
      }
      return ok(result.data);
    }

    return fail("not_found", `No route for ${req.method} ${path}`, 404);
  } catch (e) {
    console.error("portal_jwt_error", e);
    return fail("internal_error", "An unexpected error occurred", 500);
  }
});
