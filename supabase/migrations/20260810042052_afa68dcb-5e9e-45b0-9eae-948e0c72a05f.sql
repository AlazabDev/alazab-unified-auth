CREATE POLICY "Users can read own auth events"
  ON public.adp_security_events FOR SELECT TO authenticated
  USING (category = 'auth' AND actor_id = auth.uid());