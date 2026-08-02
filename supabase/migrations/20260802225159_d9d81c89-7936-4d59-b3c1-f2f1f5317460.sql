DROP POLICY IF EXISTS "Allow public read branches" ON public.branches;
REVOKE SELECT ON public.branches FROM anon;
CREATE POLICY "Authenticated can read branches" ON public.branches FOR SELECT TO authenticated USING (true);