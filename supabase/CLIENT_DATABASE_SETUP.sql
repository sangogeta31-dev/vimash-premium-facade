-- Vimash website: fresh Supabase database setup
--
-- Run this file ONCE in the new project's Supabase SQL Editor. It creates the
-- complete schema required by the current website; it is not an incremental
-- migration and must not be run against the existing production database.

-- ---------------------------------------------------------------------------
-- Roles for the admin area
-- ---------------------------------------------------------------------------

CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
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
REVOKE ALL ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

COMMENT ON TABLE public.user_roles IS
  'Admin/user role assignments. Only the service role or Supabase SQL Editor may change them.';

-- ---------------------------------------------------------------------------
-- Customer enquiries / VIDU CRM feed
-- ---------------------------------------------------------------------------

CREATE TABLE public.leads (
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

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_updated_at_id_asc_idx ON public.leads (updated_at ASC, id ASC);

-- Prevent duplicate active enquiries while permitting a new enquiry after the
-- earlier one has been archived.
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

COMMENT ON TABLE public.leads IS
  'Website enquiries. The application server writes leads; admins can view, archive, and delete them.';

-- ---------------------------------------------------------------------------
-- Razorpay orders and successfully captured payments
-- ---------------------------------------------------------------------------

CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text UNIQUE,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
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

CREATE TRIGGER payment_orders_set_updated_at
BEFORE UPDATE ON public.payment_orders
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX payment_orders_created_at_idx ON public.payment_orders (created_at DESC);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.payment_orders FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.payment_orders TO service_role;

COMMENT ON TABLE public.payment_orders IS
  'Customer and order details for Razorpay orders; paid rows are confirmed by server-side signature or webhook verification.';

-- ---------------------------------------------------------------------------
-- First admin setup (run this only after creating the Auth user in Supabase):
--
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::public.app_role
-- FROM auth.users
-- WHERE lower(email) = lower('YOUR_ADMIN_EMAIL@example.com')
-- ON CONFLICT (user_id, role) DO NOTHING;
