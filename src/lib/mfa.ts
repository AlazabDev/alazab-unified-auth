import { supabase } from "@/integrations/supabase/client";
import { logAuthEvent } from "@/lib/audit";

export type MfaPrefs = {
  user_id: string;
  email_otp_required: boolean;
  last_verified_at: string | null;
};

export async function getMfaPrefs(userId: string): Promise<MfaPrefs> {
  const { data } = await supabase
    .from("adp_user_mfa")
    .select("user_id, email_otp_required, last_verified_at")
    .eq("user_id", userId)
    .maybeSingle();
  return (data as MfaPrefs) ?? { user_id: userId, email_otp_required: true, last_verified_at: null };
}

export async function setMfaEnabled(userId: string, enabled: boolean) {
  const { error } = await supabase
    .from("adp_user_mfa")
    .upsert({ user_id: userId, email_otp_required: enabled }, { onConflict: "user_id" });
  if (error) throw error;
  await logAuthEvent({ event: enabled ? "mfa_enabled" : "mfa_disabled", description: "Email OTP 2FA preference changed" });
}

export async function markMfaVerified(userId: string) {
  await supabase
    .from("adp_user_mfa")
    .upsert({ user_id: userId, last_verified_at: new Date().toISOString() }, { onConflict: "user_id" });
}

const STEP_UP_KEY = "alazab.mfa.pending";

export function setPendingStepUp(email: string) {
  sessionStorage.setItem(STEP_UP_KEY, email);
}
export function getPendingStepUp() {
  return sessionStorage.getItem(STEP_UP_KEY);
}
export function clearPendingStepUp() {
  sessionStorage.removeItem(STEP_UP_KEY);
}
