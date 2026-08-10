import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SsoApp } from "@/lib/sso";

export type AppRole =
  | "platform_owner"
  | "platform_admin"
  | "database_administrator"
  | "data_engineer"
  | "data_analyst"
  | "read_only";

export async function fetchMyRoles(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("adp_user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) return [];
  return (data ?? []).map((r) => r.role as string);
}

/**
 * RBAC gate for the SSO app registry.
 * An app with an empty `allowed_roles` list is open to any authenticated user.
 * Otherwise the user must hold at least one of the listed roles.
 * Platform owners/admins always pass.
 */
export function canAccessApp(app: SsoApp, roles: string[]): boolean {
  if (!app.is_active) return false;
  const allowed = app.allowed_roles ?? [];
  if (allowed.length === 0) return true;
  if (roles.includes("platform_owner") || roles.includes("platform_admin")) return true;
  return allowed.some((r) => roles.includes(r));
}

export function filterAppsByRole(apps: SsoApp[], roles: string[]): SsoApp[] {
  return apps.filter((a) => canAccessApp(a, roles));
}

/** Loads the current user's roles once the session is known. */
export function useMyRoles(userId: string | null | undefined) {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setRoles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMyRoles(userId).then((r) => {
      if (!cancelled) {
        setRoles(r);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { roles, loading, isAdmin: roles.includes("platform_owner") || roles.includes("platform_admin") };
}
