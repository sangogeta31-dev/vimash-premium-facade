-- Trigger-only helper: never needs to be callable via the API.
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;

-- has_role must stay callable by signed-in users: RLS policies on public.leads
-- evaluate it as the calling role, and the admin UI calls it via RPC.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;