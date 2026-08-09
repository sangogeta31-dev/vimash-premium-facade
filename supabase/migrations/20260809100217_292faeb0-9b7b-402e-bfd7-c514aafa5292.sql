-- Restore pre-existing table-level grant so the public enquiry form behaves
-- exactly as before. Row access is still governed by RLS: no SELECT policy
-- exists for anon, so anonymous users cannot read any lead rows.
GRANT SELECT ON public.leads TO anon;