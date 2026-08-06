ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS pincode text,
  ADD COLUMN IF NOT EXISTS machine_hp text;