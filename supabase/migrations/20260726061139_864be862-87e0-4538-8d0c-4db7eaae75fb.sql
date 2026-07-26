ALTER TABLE public.auth_providers
  ADD COLUMN IF NOT EXISTS pre_auth_redirect_url text,
  ADD COLUMN IF NOT EXISTS post_auth_redirect_url text,
  ADD COLUMN IF NOT EXISTS scopes text;