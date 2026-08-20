-- Security: Revoke direct INSERT access on leads from anon/authenticated roles.
--
-- The server always inserts leads using the service_role client (supabaseAdmin),
-- so this anon grant is unnecessary and exposes the table to direct API spam
-- that bypasses server-side validation, rate-limiting, and duplicate checks.
--
-- Nothing in the app breaks: submitLead in leads.functions.ts uses supabaseAdmin.

-- 1. Drop the permissive RLS policy that allowed anyone to insert
DROP POLICY IF EXISTS "Anyone can submit an enquiry" ON public.leads;

-- 2. Revoke the INSERT privilege from roles that should never write directly
REVOKE INSERT ON public.leads FROM anon;
REVOKE INSERT ON public.leads FROM authenticated;

-- authenticated still keeps SELECT and UPDATE (for admin queries via RLS),
-- and service_role keeps ALL (used by the server).
