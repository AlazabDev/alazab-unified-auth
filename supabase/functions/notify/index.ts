// Alazab Central Auth — notification dispatcher
// Stores every notification centrally and optionally delivers it by email (Resend).
// Manual CORS headers (project constraint: no external CORS libraries).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = "Alazab Auth <onboarding@resend.dev>";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LEVELS = ["info", "success", "warning", "error"];

function emailHtml(title: string, body: string, link: string | null) {
  const cta = link
    ? `<p style="margin:28px 0"><a href="${link}" style="background:#030957;color:#FFB900;padding:12px 26px;border-radius:10px;text-decoration:none;font-weight:700">فتح البوابة</a></p>`
    : "";
  return `<!doctype html><html dir="rtl" lang="ar"><body style="margin:0;background:#f4f5f9;padding:32px;font-family:Tahoma,Arial,sans-serif">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e8f0">
    <div style="background:#030957;padding:20px 28px"><span style="color:#FFB900;font-size:18px;font-weight:700">Alazab Central Auth</span></div>
    <div style="padding:28px;color:#1b1d2a">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      <p style="font-size:15px;line-height:1.8;color:#4a4d60;margin:0">${body}</p>
      ${cta}
    </div>
    <div style="padding:16px 28px;background:#fafbfe;color:#8a8ea3;font-size:12px">رسالة آلية من بوابة المصادقة المركزية لشركة العزب.</div>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
    if (!token) return json({ ok: false, error: "unauthorized" }, 401);

    const { data: auth, error: authError } = await admin.auth.getUser(token);
    if (authError || !auth.user) return json({ ok: false, error: "unauthorized" }, 401);
    const actor = auth.user;

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: "invalid_json" }, 400);
    }

    const title = String(body.title ?? "").trim();
    const message = String(body.body ?? "").trim();
    const level = LEVELS.includes(String(body.level)) ? String(body.level) : "info";
    const category = String(body.category ?? "general").slice(0, 64);
    const link = typeof body.link === "string" && body.link.startsWith("http") ? body.link : null;
    const sendEmail = body.email === true;
    if (!title || title.length > 160) return json({ ok: false, error: "invalid_title" }, 400);
    if (message.length > 4000) return json({ ok: false, error: "invalid_body" }, 400);

    // Only admins may notify somebody else.
    let targetId = actor.id;
    let targetEmail = actor.email ?? null;
    if (typeof body.user_id === "string" && body.user_id !== actor.id) {
      const { data: roles } = await admin.from("adp_user_roles").select("role").eq("user_id", actor.id);
      const isAdmin = (roles ?? []).some((r: { role: string }) =>
        r.role === "platform_owner" || r.role === "platform_admin"
      );
      if (!isAdmin) return json({ ok: false, error: "forbidden" }, 403);
      const { data: target } = await admin.auth.admin.getUserById(body.user_id);
      if (!target.user) return json({ ok: false, error: "user_not_found" }, 404);
      targetId = target.user.id;
      targetEmail = target.user.email ?? null;
    }

    const channels = ["toast", ...(sendEmail ? ["email"] : [])];
    const { data: row, error: insertError } = await admin
      .from("adp_notifications")
      .insert({
        user_id: targetId,
        email: targetEmail,
        title,
        body: message,
        level,
        category,
        link,
        channels,
        email_status: sendEmail ? "pending" : null,
      })
      .select("id")
      .single();
    if (insertError) return json({ ok: false, error: insertError.message }, 400);

    let emailStatus: string | null = null;
    if (sendEmail && targetEmail && EMAIL_RE.test(targetEmail)) {
      if (!RESEND_API_KEY) {
        emailStatus = "failed";
        await admin.from("adp_notifications")
          .update({ email_status: "failed", email_error: "RESEND_API_KEY missing" })
          .eq("id", row.id);
      } else {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: FROM,
            to: [targetEmail],
            subject: title,
            html: emailHtml(title, message, link),
          }),
        });
        const text = await res.text();
        emailStatus = res.ok ? "sent" : "failed";
        if (!res.ok) console.error(`resend_failed [${res.status}]: ${text}`);
        await admin.from("adp_notifications")
          .update({ email_status: emailStatus, email_error: res.ok ? null : text.slice(0, 500) })
          .eq("id", row.id);
      }
    }

    await admin.rpc("log_security_event", {
      _category: "auth",
      _event_type: "notification_sent",
      _status: "success",
      _actor_email: actor.email ?? null,
      _description: `Notification "${title}" delivered`,
      _detail: { target_user: targetId, category, level, channels, email_status: emailStatus, channel: "notify" },
      _ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      _user_agent: (req.headers.get("user-agent") ?? "").slice(0, 400),
    }).catch?.(() => {});

    return json({ ok: true, data: { id: row.id, email_status: emailStatus } });
  } catch (e) {
    console.error("notify_error", e);
    return json({ ok: false, error: "internal_error" }, 500);
  }
});
