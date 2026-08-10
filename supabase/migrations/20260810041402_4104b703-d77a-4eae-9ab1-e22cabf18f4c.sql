
-- 1. pn_* tables: remove public read
DROP POLICY IF EXISTS pn_projects_read ON public.pn_projects;
CREATE POLICY pn_projects_read ON public.pn_projects FOR SELECT TO authenticated
USING (created_by = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS pn_sections_read ON public.pn_sections;
CREATE POLICY pn_sections_read ON public.pn_sections FOR SELECT TO authenticated
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.pn_projects p WHERE p.id = pn_sections.project_id AND p.created_by = auth.uid()));

DROP POLICY IF EXISTS pn_notes_read ON public.pn_notes;
CREATE POLICY pn_notes_read ON public.pn_notes FOR SELECT TO authenticated
USING (created_by = auth.uid() OR public.is_admin() OR EXISTS (SELECT 1 FROM public.pn_projects p WHERE p.id = pn_notes.project_id AND p.created_by = auth.uid()));

DROP POLICY IF EXISTS pn_comments_read ON public.pn_comments;
CREATE POLICY pn_comments_read ON public.pn_comments FOR SELECT TO authenticated
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.pn_projects p WHERE p.id = pn_comments.project_id AND p.created_by = auth.uid()));

DROP POLICY IF EXISTS pn_attachments_read ON public.pn_attachments;
CREATE POLICY pn_attachments_read ON public.pn_attachments FOR SELECT TO authenticated
USING (public.is_admin() OR EXISTS (SELECT 1 FROM public.pn_projects p WHERE p.id = pn_attachments.project_id AND p.created_by = auth.uid()));

-- restrict inserts to authenticated as well (were anon-capable)
DROP POLICY IF EXISTS pn_comments_create ON public.pn_comments;
CREATE POLICY pn_comments_create ON public.pn_comments FOR INSERT TO authenticated
WITH CHECK (actor_id = auth.uid() AND EXISTS (SELECT 1 FROM public.pn_notes n WHERE n.id = pn_comments.note_id AND n.project_id = pn_comments.project_id));

DROP POLICY IF EXISTS pn_attachments_create ON public.pn_attachments;
CREATE POLICY pn_attachments_create ON public.pn_attachments FOR INSERT TO authenticated
WITH CHECK (uploaded_by = auth.uid() AND EXISTS (SELECT 1 FROM public.pn_notes n WHERE n.id = pn_attachments.note_id AND n.project_id = pn_attachments.project_id));

REVOKE ALL ON public.pn_projects, public.pn_sections, public.pn_notes, public.pn_comments, public.pn_attachments FROM anon;

-- 2. delete policies: owner or admin only
DROP POLICY IF EXISTS pn_projects_delete ON public.pn_projects;
CREATE POLICY pn_projects_delete ON public.pn_projects FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS pn_notes_delete ON public.pn_notes;
CREATE POLICY pn_notes_delete ON public.pn_notes FOR DELETE TO authenticated
USING (created_by = auth.uid() OR public.is_admin() OR EXISTS (SELECT 1 FROM public.pn_projects p WHERE p.id = pn_notes.project_id AND p.created_by = auth.uid()));

-- 3. pn-files bucket
DROP POLICY IF EXISTS pn_files_read ON storage.objects;
CREATE POLICY pn_files_read ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'pn-files' AND (public.is_admin() OR EXISTS (
  SELECT 1 FROM public.pn_projects p WHERE p.id::text = (storage.foldername(name))[1] AND p.created_by = auth.uid()
)));

DROP POLICY IF EXISTS pn_files_create ON storage.objects;
CREATE POLICY pn_files_create ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pn-files' AND EXISTS (
  SELECT 1 FROM public.pn_notes n JOIN public.pn_projects p ON p.id = n.project_id
  WHERE p.id::text = (storage.foldername(name))[1] AND n.id::text = (storage.foldername(name))[2]
    AND (p.created_by = auth.uid() OR public.is_admin())
));

DROP POLICY IF EXISTS pn_files_delete ON storage.objects;
CREATE POLICY pn_files_delete ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'pn-files' AND (public.is_admin() OR EXISTS (
  SELECT 1 FROM public.pn_projects p WHERE p.id::text = (storage.foldername(name))[1] AND p.created_by = auth.uid()
)));

-- 4. audit logs: admins only
DROP POLICY IF EXISTS "Authenticated users can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can read audit logs" ON public.audit_logs FOR SELECT TO authenticated
USING (public.is_admin());

-- 5. storage metadata + promotions: storage managers only
DROP POLICY IF EXISTS storage_requests_read ON public.storage_requests;
CREATE POLICY storage_requests_read ON public.storage_requests FOR SELECT TO authenticated USING (public.can_manage_storage());

DROP POLICY IF EXISTS storage_projects_read ON public.storage_projects;
CREATE POLICY storage_projects_read ON public.storage_projects FOR SELECT TO authenticated USING (public.can_manage_storage());

DROP POLICY IF EXISTS storage_objects_read ON public.storage_objects;
CREATE POLICY storage_objects_read ON public.storage_objects FOR SELECT TO authenticated USING (public.can_manage_storage());

DROP POLICY IF EXISTS storage_locations_read ON public.storage_object_locations;
CREATE POLICY storage_locations_read ON public.storage_object_locations FOR SELECT TO authenticated USING (public.can_manage_storage());

DROP POLICY IF EXISTS storage_promotions_read ON public.storage_promotions;
CREATE POLICY storage_promotions_read ON public.storage_promotions FOR SELECT TO authenticated USING (public.is_admin());

-- 6. revoke direct execute on SECURITY DEFINER functions from api roles
REVOKE ALL ON FUNCTION public.generate_quotation_number() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.log_security_event(text, text, text, text, text, jsonb, text, text) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.promote_storage_request(uuid, text, timestamptz, numeric, text, text) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.register_storage_server_object(text, text, uuid, text, text, text, text, text, bigint, text) FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.reserve_storage_object_code() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.generate_quotation_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, text, text, text, jsonb, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.promote_storage_request(uuid, text, timestamptz, numeric, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.register_storage_server_object(text, text, uuid, text, text, text, text, text, bigint, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.reserve_storage_object_code() TO service_role;
