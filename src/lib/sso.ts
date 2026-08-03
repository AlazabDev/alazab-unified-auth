import { supabase } from "@/integrations/supabase/client";

export type SsoApp = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  base_url: string;
  redirect_url: string | null;
  logo_url: string | null;
  color: string | null;
  allowed_roles: string[];
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
};

const STORAGE_KEY = "alazab.sso.target";

/** Reads ?app= / ?redirect_uri= / ?next= from the URL and remembers it for after auth. */
export function captureSsoTarget(search: string) {
  const params = new URLSearchParams(search);
  const value =
    params.get("app") ||
    params.get("redirect_uri") ||
    params.get("redirect") ||
    params.get("next");
  if (value) sessionStorage.setItem(STORAGE_KEY, value);
}

export function getSsoTarget(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearSsoTarget() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export async function fetchSsoApps(): Promise<SsoApp[]> {
  const { data, error } = await supabase
    .from("sso_apps")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SsoApp[];
}

function sameOrigin(a: string, b: string) {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/**
 * Resolves the stored target (slug or absolute URL) against the registered apps.
 * Only registered + active apps are allowed — this prevents open-redirect abuse.
 */
export function resolveSsoApp(target: string | null, apps: SsoApp[]): SsoApp | null {
  const active = apps.filter((a) => a.is_active);
  if (target) {
    const bySlug = active.find((a) => a.slug === target);
    if (bySlug) return bySlug;
    const byUrl = active.find(
      (a) => sameOrigin(a.base_url, target) || (a.redirect_url && sameOrigin(a.redirect_url, target)),
    );
    if (byUrl) return byUrl;
  }
  return active.find((a) => a.is_default) ?? null;
}

/**
 * Builds the hand-off URL for an app, carrying the Supabase session in the URL
 * fragment so the target subdomain can restore it with `setSession`.
 */
export async function buildHandoffUrl(app: SsoApp): Promise<string> {
  const base = app.redirect_url || app.base_url;
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return base;
  const hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: String(session.expires_in ?? 3600),
    token_type: "bearer",
    type: "sso",
  });
  return `${base}${base.includes("#") ? "&" : "#"}${hash.toString()}`;
}
