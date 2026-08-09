-- Security remediation: restrict the admin role to an explicit allowlist.
-- Replaces the effect of the earlier blanket "grant admin to every auth user" statement.
-- No passwords are set here. No lead data is touched. No user accounts are deleted.

DO $$
DECLARE
  designated_admins text[] := ARRAY['sangogeta31@gmail.com', 'jameshpanchal@gmail.com'];
BEGIN
  -- 1. Remove the admin role from anyone who is not a designated admin.
  DELETE FROM public.user_roles ur
  USING auth.users u
  WHERE ur.user_id = u.id
    AND ur.role = 'admin'::public.app_role
    AND lower(u.email) <> ALL (SELECT lower(unnest(designated_admins)));

  -- 2. Make sure the designated admins still hold the role (idempotent).
  INSERT INTO public.user_roles (user_id, role)
  SELECT u.id, 'admin'::public.app_role
  FROM auth.users u
  WHERE lower(u.email) = ANY (SELECT lower(unnest(designated_admins)))
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- 3. Defence in depth: browsers must never be able to create/modify role rows.
--    Role changes stay server-side (service role) only.
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
REVOKE ALL ON public.user_roles FROM anon;

COMMENT ON TABLE public.user_roles IS
  'Admin/user role assignments. Rows may only be created or removed with the service role (or a migration). Never grant roles automatically to new signups.';