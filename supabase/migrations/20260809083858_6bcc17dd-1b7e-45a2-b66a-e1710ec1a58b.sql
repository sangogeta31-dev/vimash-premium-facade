ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS source_page text,
  ADD COLUMN IF NOT EXISTS odoo_lead_id text;