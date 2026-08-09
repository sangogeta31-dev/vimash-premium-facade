-- Reverts an over-tightening: the leads SELECT policy is evaluated (and must be
-- executable) even when an anonymous INSERT returns the new row id.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;