import { supabase } from "@/integrations/supabase/client";

export type AuthEventType =
  | "login"
  | "logout"
  | "failed_login"
  | "otp_requested"
  | "otp_verified"
  | "password_reset"
  | "provider_used"
  | "mfa_enabled"
  | "mfa_disabled"
  | "session_revoked";

type LogInput = {
  event: AuthEventType;
  status?: "success" | "failure";
  email?: string | null;
  description?: string;
  detail?: Record<string, unknown>;
};

function deviceInfo() {
  const ua = navigator.userAgent;
  const platform =
    /Android/i.test(ua) ? "Android" :
    /iPhone|iPad|iPod/i.test(ua) ? "iOS" :
    /Windows/i.test(ua) ? "Windows" :
    /Mac OS/i.test(ua) ? "macOS" :
    /Linux/i.test(ua) ? "Linux" : "Unknown";
  const browser =
    /Edg\//i.test(ua) ? "Edge" :
    /OPR\//i.test(ua) ? "Opera" :
    /Chrome\//i.test(ua) ? "Chrome" :
    /Safari\//i.test(ua) ? "Safari" :
    /Firefox\//i.test(ua) ? "Firefox" : "Unknown";
  return { platform, browser, ua };
}

/**
 * Writes an authentication event into the central security audit log
 * (public.adp_security_events, category = 'auth'). Never throws.
 */
export async function logAuthEvent({ event, status = "success", email, description, detail }: LogInput) {
  const { platform, browser, ua } = deviceInfo();
  try {
    await supabase.rpc("log_security_event", {
      _category: "auth",
      _event_type: event,
      _status: status,
      _actor_email: email ?? null,
      _description: description ?? null,
      _detail: {
        ...(detail ?? {}),
        platform,
        browser,
        origin: window.location.origin,
        language: navigator.language,
      },
      _ip_address: null,
      _user_agent: ua.slice(0, 400),
    });
  } catch {
    /* auditing must never break the auth flow */
  }
}

export type AuthAuditRow = {
  id: string;
  event_type: string;
  status: string;
  actor_id: string | null;
  actor_email: string | null;
  description: string | null;
  detail: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export async function fetchAuthAudit(limit = 100): Promise<AuthAuditRow[]> {
  const { data, error } = await supabase
    .from("adp_security_events")
    .select("*")
    .eq("category", "auth")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuthAuditRow[];
}

/** Events for the currently signed-in user only (used by the Security page). */
export async function fetchMyAuthAudit(userId: string, limit = 50): Promise<AuthAuditRow[]> {
  const { data, error } = await supabase
    .from("adp_security_events")
    .select("*")
    .eq("category", "auth")
    .eq("actor_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as AuthAuditRow[];
}
