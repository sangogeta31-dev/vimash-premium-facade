drop function if exists public.__whoami();

delete from public.leads
where customer_name in ('RLS selftest', 'RLS selftest2')
  and mobile in ('9990000000','9990000001','9990000002','9999999999');

revoke execute on function public.has_role(uuid, public.app_role) from anon;