DROP POLICY IF EXISTS "Authenticated can read branches" ON public.branches;

CREATE POLICY "Admins can read branches"
ON public.branches
FOR SELECT
TO authenticated
USING (public.is_admin());