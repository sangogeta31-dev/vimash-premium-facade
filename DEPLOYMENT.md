# Vimash Manufacturing — Deployment guide (Hostinger Node.js / VPS, own Supabase)

This app is **not a static site**. It is a TanStack Start (React 19 + Vite 7) app with
server-side code (server functions, SSR, Odoo push). It needs a **Node.js runtime**, not
plain shared/static hosting.

Everything below can be done without Lovable Cloud.

---

## 1. What runs where

| Piece | Runs on | Notes |
| --- | --- | --- |
| Website pages, product pages | Server (SSR) + browser | Needs Node |
| Enquiry form insert | Browser → Supabase Data API | Uses public keys only |
| `syncLead` (Odoo push) | Server function | Uses server-only secrets |
| Admin login + Lead Inbox | Browser → Supabase Auth + RLS | Admin-only via `user_roles` |
| Sitemap `/sitemap.xml` | Server route | Generated at request time |

## 2. Build target

The build defaults to a Cloudflare Worker target. For Hostinger Node.js hosting,
switch Nitro to the Node preset **at build time** (no code change needed):

```bash
NITRO_PRESET=node-server npm run build
```

Output: `.output/server/index.mjs` (plus `.output/public`).

Start command on the server:

```bash
node .output/server/index.mjs
```

Hostinger Node.js app settings:
- Application root: project folder
- Startup file: `.output/server/index.mjs`
- Node version: 20 or 22
- Build command: `npm ci && NITRO_PRESET=node-server npm run build`

If you prefer to hardcode it, add to `vite.config.ts`:

```ts
export default defineConfig({
  tanstackStart: { server: { entry: "server" } },
  nitro: { preset: "node-server" },
});
```

## 3. Environment variables

Public (safe in the client bundle, must be present at **build** time):

```
VITE_SUPABASE_URL=https://<client-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable/anon key>
VITE_SUPABASE_PROJECT_ID=<project ref>
```

Server-only (present at **runtime**, never in the client bundle, never in git):

```
SUPABASE_URL=https://<client-project>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable/anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
ODOO_URL=https://attendease1.odoo.com
ODOO_API_KEY=<Odoo API key used as a Bearer token>
```

Leads are pushed with the Odoo JSON-2 API
(`POST ${ODOO_URL}/json/2/crm.lead/create`). Without `ODOO_URL` / `ODOO_API_KEY`
the app still works: leads are stored and marked `failed` with the message
"Odoo CRM is not connected yet", and can be retried from the Lead Inbox once
the variables are set.


## 4. Moving to the client's own Supabase project

1. Create the client's Supabase project.
2. Apply every file in `supabase/migrations/` in filename order (Supabase CLI:
   `supabase db push`, or paste each file into the SQL editor in order).
3. Create the admin user(s) in Auth, then insert their role:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'admin@example.com'
   on conflict do nothing;
   ```
   Do **not** re-run the old seeding migration's hardcoded password on production —
   set a real password in the Auth dashboard.
4. Turn **off** "auto confirm email" in Auth (it was enabled for testing only).
5. Add the production domain to Auth → URL configuration (Site URL + redirect URLs).
6. Update the env vars above and rebuild.

## 5. Security posture already in place

- RLS is on for `leads` and `user_roles`.
- Anonymous visitors can only **INSERT** a lead; they cannot read, update or delete any lead.
  (The form therefore never reads the row back — it generates the lead id client-side.)
- Reading / updating / deleting leads requires an authenticated user with the `admin`
  role, checked through the `has_role()` security-definer function.
- `user_roles` is not writable from the browser; roles are granted with SQL only.
- The service role key is only ever read inside server functions.

## 6. Post-deploy smoke test

1. Submit an enquiry from `/contact` → "Request received".
2. Row appears in the Lead Inbox with the correct city/state from the pincode.
3. Sign in at `/auth` as an admin → lands on `/admin/leads`; Logout returns to `/auth`.
4. Signed-out visit to `/admin/leads` redirects to `/auth`.
5. `/sitemap.xml` and `/robots.txt` load.
6. With `ODOO_WEBHOOK_URL` set, a new lead shows Odoo sync **Synced** and stores the CRM id.
