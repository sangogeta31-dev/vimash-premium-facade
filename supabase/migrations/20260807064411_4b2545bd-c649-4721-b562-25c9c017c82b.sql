insert into public.user_roles (user_id, role)
select id, 'admin'::app_role from auth.users
on conflict (user_id, role) do nothing;

update auth.users
set encrypted_password = crypt('vimash1234', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now())
where email in ('sangogeta31@gmail.com','jameshpanchal@gmail.com');