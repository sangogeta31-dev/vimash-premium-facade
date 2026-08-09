-- Defence in depth: RLS already blocked these, but anon should not hold the
-- table-level privileges either. Submitting an enquiry stays allowed.
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.leads FROM anon;
GRANT INSERT ON public.leads TO anon;

REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.user_roles FROM authenticated;