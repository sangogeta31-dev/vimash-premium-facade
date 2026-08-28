# Vimash Manufacturing — Deployment guide (Hostinger Node.js / VPS, own Supabase)

This app is **not a static site**. It is a TanStack Start (React 19 + Vite 7) app with
server-side code (server functions, SSR, and a VIDU CRM feed). It needs a **Node.js runtime**, not
plain shared/static hosting.

Everything below can be done without Lovable Cloud.

---

## 1. What runs where

| Piece                        | Runs on                       | Notes                       |
| ---------------------------- | ----------------------------- | --------------------------- |
| Website pages, product pages | Server (SSR) + browser        | Needs Node                  |
| Enquiry form insert          | Browser → server function → Supabase | Uses server-side service role |
| VIDU CRM feed `/api/crm/enquiries` | Server route             | Uses server-only secrets      |
| Admin login + Lead Inbox     | Browser → Supabase Auth + RLS | Admin-only via `user_roles` |
| Sitemap `/sitemap.xml`       | Server route                  | Generated at request time   |

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
CRM_FEED_KEY=<strong secret shared with VIDU CRM>
TRUST_PROXY=true
RAZORPAY_KEY_ID=rzp_live_... (or rzp_test_... while testing)
RAZORPAY_KEY_SECRET=<matching Razorpay secret>
RAZORPAY_WEBHOOK_SECRET=<secret configured for the Razorpay webhook>
```

Set `TRUST_PROXY=true` only when the app is behind Hostinger's trusted reverse
proxy and that proxy overwrites the client-IP headers. Leave it unset for a
directly reachable Node process.

VIDU CRM pulls new and changed enquiries from `GET /api/crm/enquiries` every 30 minutes.
The route requires the `X-Api-Key: <CRM_FEED_KEY>` header and uses the Supabase service
role to return leads, including their archived state, so a lead cannot disappear before
VIDU's next poll. Keep `CRM_FEED_KEY` server-only and share its value
with VIDU through a secure channel.

The endpoint supports:

- `changed_since=<ISO 8601 timestamp>` to return leads whose `updated_at` is on or after the timestamp.
- `page` and `per_page` pagination. `per_page` defaults to 100 and is capped at 100.
- `paging.next` as the next-page URL, or `null` when there are no more records.

Each record contains stable `id`, `created`, and `updated` values plus customer, location,
product, source, and message fields in VIDU’s expected format.

## 4. Moving to the client's own Supabase project

1. Create the client's Supabase project.
2. Link the project and apply the versioned migrations from this repository:
   ```bash
   supabase link --project-ref <client-project-ref>
   supabase db push
   ```
   This creates the complete schema, including RLS, admin roles, enquiries,
   VIDU feed indexes, and pending/paid Razorpay payment records. The
   [`CLIENT_DATABASE_SETUP.sql`](supabase/CLIENT_DATABASE_SETUP.sql) file is
   available only as a one-time SQL Editor alternative for a brand-new project;
   do not run it against an existing database.
3. Create the admin user(s) in Auth, then insert their role:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'::public.app_role
   from auth.users
   where lower(email) = lower('admin@example.com')
   on conflict (user_id, role) do nothing;
   ```
4. Turn **off** "auto confirm email" in Auth (it was enabled for testing only).
5. Add the production domain to Auth → URL configuration (Site URL + redirect URLs).
6. Update the env vars above, including `CRM_FEED_KEY`, `TRUST_PROXY`, and
   `RAZORPAY_WEBHOOK_SECRET`, and rebuild.

## 5. Security posture already in place

- RLS is on for `leads`, `payment_orders`, and `user_roles`.
- Anonymous visitors have no direct access to lead or payment data. Enquiries
  are validated and inserted by the website server using its service-role key.
- Reading / updating / deleting leads requires an authenticated user with the `admin`
  role, checked through the `has_role()` security-definer function.
- `user_roles` is not writable from the browser; roles are granted with SQL only.
- `payment_orders` stores the signed order context as `pending` before checkout,
  then marks it `paid` only after client-side signature verification or a signed
  Razorpay webhook.
- The service role key and CRM feed key are only ever read inside server-side code.

## 6. Post-deploy smoke test

1. Submit an enquiry from `/contact` → "Request received".
2. Row appears in the Lead Inbox with the correct city/state from the pincode.
3. Sign in at `/auth` as an admin → lands on `/admin/leads`; Logout returns to `/auth`.
4. Signed-out visit to `/admin/leads` redirects to `/auth`.
5. `/sitemap.xml` and `/robots.txt` load.
6. `GET /api/crm/enquiries` with the `X-Api-Key` header returns `200` and a `data` array.
7. The same endpoint without a key or with a wrong key returns `401`.
8. Configure Razorpay to POST signed `payment.captured` events to `/api/razorpay/webhook`.
9. Add the production URL, auth method, field mappings, and `CRM_FEED_KEY` to VIDU’s connector configuration.
