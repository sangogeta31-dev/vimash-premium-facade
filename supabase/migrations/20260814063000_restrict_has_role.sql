-- Security: restrict has_role so it only returns true when the caller
-- checks their own user_id, preventing arbitrary user enumeration.
-- RLS policies all pass auth.uid() so this is a no-op for legitimate use.

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;
