-- 1) Notifications
CREATE TABLE IF NOT EXISTS public.adp_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  title text NOT NULL,
  body text,
  level text NOT NULL DEFAULT 'info',
  category text NOT NULL DEFAULT 'general',
  link text,
  channels text[] NOT NULL DEFAULT ARRAY['toast']::text[],
  email_status text,
  email_error text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.adp_notifications TO authenticated;
GRANT ALL ON public.adp_notifications TO service_role;
ALTER TABLE public.adp_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own notifications read" ON public.adp_notifications;
CREATE POLICY "own notifications read" ON public.adp_notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "own notifications update" ON public.adp_notifications;
CREATE POLICY "own notifications update" ON public.adp_notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS adp_notifications_user_idx ON public.adp_notifications (user_id, created_at DESC);

-- 2) Portal (Outpost) tokens
CREATE TABLE IF NOT EXISTS public.adp_portal_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jti uuid NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_slug text NOT NULL,
  roles text[] NOT NULL DEFAULT '{}',
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  refreshed_from uuid,
  revoked_at timestamptz,
  ip_address text,
  user_agent text
);

GRANT SELECT ON public.adp_portal_tokens TO authenticated;
GRANT ALL ON public.adp_portal_tokens TO service_role;
ALTER TABLE public.adp_portal_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own portal tokens read" ON public.adp_portal_tokens;
CREATE POLICY "own portal tokens read" ON public.adp_portal_tokens
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

CREATE INDEX IF NOT EXISTS adp_portal_tokens_user_idx ON public.adp_portal_tokens (user_id, issued_at DESC);

-- 3) Admin: users & permissions management
CREATE OR REPLACE FUNCTION public.admin_list_users(_search text DEFAULT NULL, _limit int DEFAULT 200)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz,
  banned_until timestamptz,
  providers text[],
  roles text[],
  mfa_enabled boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  RETURN QUERY
  SELECT u.id,
         u.email::text,
         u.created_at,
         u.last_sign_in_at,
         u.email_confirmed_at,
         u.banned_until,
         COALESCE((SELECT array_agg(DISTINCT i.provider) FROM auth.identities i WHERE i.user_id = u.id), ARRAY['email']::text[]),
         COALESCE((SELECT array_agg(r.role::text ORDER BY r.role::text) FROM public.adp_user_roles r WHERE r.user_id = u.id), '{}'::text[]),
         COALESCE((SELECT m.email_otp_required FROM public.adp_user_mfa m WHERE m.user_id = u.id), false)
  FROM auth.users u
  WHERE _search IS NULL OR _search = '' OR u.email ILIKE '%' || _search || '%'
  ORDER BY u.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(_limit, 200), 1000));
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_users(text, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_users(text, int) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id uuid, _role app_role, _grant boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _actor uuid := auth.uid();
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not_authorized';
  END IF;

  IF _grant THEN
    INSERT INTO public.adp_user_roles (user_id, role)
    VALUES (_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    IF _role = 'platform_owner'
       AND (SELECT count(*) FROM public.adp_user_roles WHERE role = 'platform_owner') <= 1 THEN
      RAISE EXCEPTION 'last_owner_protected';
    END IF;
    DELETE FROM public.adp_user_roles WHERE user_id = _user_id AND role = _role;
  END IF;

  PERFORM public.log_security_event(
    'auth',
    CASE WHEN _grant THEN 'role_granted' ELSE 'role_revoked' END,
    'success',
    (SELECT email::text FROM auth.users WHERE id = _actor),
    format('%s role %s for user %s', CASE WHEN _grant THEN 'Granted' ELSE 'Revoked' END, _role::text, _user_id),
    jsonb_build_object('target_user', _user_id, 'role', _role::text, 'channel', 'admin-ui'),
    NULL,
    NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, app_role, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, app_role, boolean) TO authenticated, service_role;