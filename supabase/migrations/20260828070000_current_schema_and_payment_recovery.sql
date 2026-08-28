-- Consolidated forward migration for deployments that were using the
-- previously tracked schema migrations. It is also sufficient for a fresh
-- database after the migration history was consolidated.

DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND _user_id = auth.uid()
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated;
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text,
  mobile text NOT NULL,
  city text,
  state text,
  pincode text,
  machine_name text,
  machine_slug text,
  machine_hp text,
  lead_source text NOT NULL DEFAULT 'Website',
  source_page text,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pincode text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS machine_hp text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source_page text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO service_role;
DROP TRIGGER IF EXISTS leads_set_updated_at ON public.leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_updated_at_id_asc_idx ON public.leads (updated_at ASC, id ASC);

-- Keep the newest active duplicate before enforcing the current dedup rule.
WITH ranked AS (
  SELECT id,
         row_number() OVER (
           PARTITION BY right(regexp_replace(mobile, '\D', '', 'g'), 10),
                        lower(btrim(machine_name))
           ORDER BY created_at DESC, id DESC
         ) AS row_number
  FROM public.leads
  WHERE archived = false
)
UPDATE public.leads AS leads
SET archived = true
FROM ranked
WHERE leads.id = ranked.id AND ranked.row_number > 1;

DROP INDEX IF EXISTS public.leads_unique_active_mobile_machine;
CREATE UNIQUE INDEX leads_unique_active_mobile_machine
  ON public.leads (
    right(regexp_replace(mobile, '\D', '', 'g'), 10),
    lower(btrim(machine_name))
  )
  WHERE archived = false;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
REVOKE ALL ON public.leads FROM anon;
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can view leads"
ON public.leads FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update leads"
ON public.leads FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete leads"
ON public.leads FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text UNIQUE,
  payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid')),
  customer_first_name text NOT NULL,
  customer_last_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_state text NOT NULL,
  delivery_pincode text NOT NULL,
  items jsonb NOT NULL,
  amount_paise integer NOT NULL CHECK (amount_paise >= 0),
  currency text NOT NULL DEFAULT 'INR',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_orders ALTER COLUMN razorpay_payment_id DROP NOT NULL;
ALTER TABLE public.payment_orders ALTER COLUMN paid_at DROP NOT NULL;
ALTER TABLE public.payment_orders DROP CONSTRAINT IF EXISTS payment_orders_payment_status_check;
ALTER TABLE public.payment_orders ADD CONSTRAINT payment_orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid'));

DROP TRIGGER IF EXISTS payment_orders_set_updated_at ON public.payment_orders;
CREATE TRIGGER payment_orders_set_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS payment_orders_created_at_idx
  ON public.payment_orders (created_at DESC);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_orders FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.payment_orders TO service_role;
