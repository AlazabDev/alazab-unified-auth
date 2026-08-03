CREATE TABLE public.sso_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text,
  description_en text,
  base_url text NOT NULL,
  redirect_url text,
  logo_url text,
  color text,
  allowed_roles text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.sso_apps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sso_apps TO authenticated;
GRANT ALL ON public.sso_apps TO service_role;

ALTER TABLE public.sso_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active apps"
  ON public.sso_apps FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert apps"
  ON public.sso_apps FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update apps"
  ON public.sso_apps FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete apps"
  ON public.sso_apps FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TRIGGER set_sso_apps_updated_at
  BEFORE UPDATE ON public.sso_apps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.sso_apps (slug, name_ar, name_en, base_url, redirect_url, sort_order, is_default) VALUES
  ('alazab', 'الموقع الرئيسي', 'Alazab Main', 'https://alazab.com', 'https://alazab.com', 1, true),
  ('erp', 'نظام ERP', 'Alazab ERP', 'https://erp.alazab.com', 'https://erp.alazab.com', 2, false),
  ('uberfix', 'أوبرفكس', 'UberFix', 'https://uberfix.alazab.com', 'https://uberfix.alazab.com', 3, false),
  ('uberfix-landing', 'أوبرفكس لاندنج', 'UberFix Landing', 'https://uberfix-landing.alazab.com', 'https://uberfix-landing.alazab.com', 4, false),
  ('brand-identity', 'الهوية البصرية', 'Brand Identity', 'https://brand-identity.alazab.com', 'https://brand-identity.alazab.com', 5, false),
  ('laban-alasfour', 'لبن العصفور', 'Laban Alasfour', 'https://laban-alasfour.alazab.com', 'https://laban-alasfour.alazab.com', 6, false),
  ('luxury-finishing', 'التشطيبات الفاخرة', 'Luxury Finishing', 'https://luxury-finishing.alazab.com', 'https://luxury-finishing.alazab.com', 7, false);