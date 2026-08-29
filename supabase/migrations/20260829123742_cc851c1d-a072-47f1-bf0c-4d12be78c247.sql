
CREATE OR REPLACE FUNCTION public.admin_list_tables()
RETURNS TABLE(
  table_name text,
  columns_count integer,
  rls_enabled boolean,
  policies_count integer,
  row_estimate bigint,
  total_size text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    c.relname::text,
    (SELECT count(*)::int FROM pg_attribute a
       WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped),
    c.relrowsecurity,
    (SELECT count(*)::int FROM pg_policy p WHERE p.polrelid = c.oid),
    GREATEST(c.reltuples, 0)::bigint,
    pg_size_pretty(pg_total_relation_size(c.oid))::text
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'public' AND c.relkind = 'r'
  ORDER BY c.relname;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_tables() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_tables() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.admin_table_columns(_table text)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable boolean,
  column_default text,
  is_primary_key boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  RETURN QUERY
  SELECT
    a.attname::text,
    format_type(a.atttypid, a.atttypmod)::text,
    NOT a.attnotnull,
    pg_get_expr(d.adbin, d.adrelid)::text,
    COALESCE(pk.is_pk, false)
  FROM pg_attribute a
  JOIN pg_class c ON c.oid = a.attrelid
  JOIN pg_namespace n ON n.oid = c.relnamespace
  LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
  LEFT JOIN LATERAL (
    SELECT true AS is_pk FROM pg_index i
    WHERE i.indrelid = c.oid AND i.indisprimary AND a.attnum = ANY(i.indkey)
  ) pk ON true
  WHERE n.nspname = 'public'
    AND c.relname = _table
    AND c.relkind = 'r'
    AND a.attnum > 0
    AND NOT a.attisdropped
  ORDER BY a.attnum;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_table_columns(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_table_columns(text) TO authenticated, service_role;
