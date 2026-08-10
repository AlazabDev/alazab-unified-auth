CREATE TABLE IF NOT EXISTS public.adp_user_mfa (
  user_id uuid PRIMARY KEY,
  email_otp_required boolean NOT NULL DEFAULT true,
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.adp_user_mfa TO authenticated;
GRANT ALL ON public.adp_user_mfa TO service_role;

ALTER TABLE public.adp_user_mfa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own mfa prefs"
  ON public.adp_user_mfa FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own mfa prefs"
  ON public.adp_user_mfa FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own mfa prefs"
  ON public.adp_user_mfa FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER adp_user_mfa_updated_at
  BEFORE UPDATE ON public.adp_user_mfa
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, text, text, text, jsonb, text, text) TO authenticated, anon;