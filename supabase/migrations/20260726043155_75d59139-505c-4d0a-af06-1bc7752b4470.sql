CREATE TABLE public.auth_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'oauth',
  enabled BOOLEAN NOT NULL DEFAULT false,
  client_id TEXT,
  client_secret TEXT,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'unknown',
  last_checked_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.auth_providers TO authenticated;
GRANT ALL ON public.auth_providers TO service_role;

ALTER TABLE public.auth_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view auth providers" ON public.auth_providers
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert auth providers" ON public.auth_providers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update auth providers" ON public.auth_providers
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete auth providers" ON public.auth_providers
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_auth_providers_updated_at
  BEFORE UPDATE ON public.auth_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.auth_providers (key, label, type, enabled, status) VALUES
  ('email', 'البريد الإلكتروني (OTP)', 'otp', true, 'active'),
  ('phone', 'رقم الهاتف (SMS)', 'otp', false, 'inactive'),
  ('google', 'Google', 'oauth', true, 'active'),
  ('azure', 'Microsoft Azure', 'oauth', false, 'inactive'),
  ('apple', 'Apple', 'oauth', false, 'inactive'),
  ('facebook', 'Facebook', 'oauth', false, 'inactive')
ON CONFLICT (key) DO NOTHING;