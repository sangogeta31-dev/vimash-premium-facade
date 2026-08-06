# Fuller enquiry form with pincode auto-state

## What changes for the visitor

The callback box becomes a short 4-field form:

1. Name
2. Mobile number
3. Pincode
4. City

When 6 digits are typed into Pincode, the state (and a suggested city) fill in automatically from India Post data. The state shows as a read-only line, e.g. "State: Gujarat". If the pincode isn't recognised, the visitor can still submit and can type the city themselves.

When the form is opened from a generic place (home page, contact page, quote band with no machine attached), one extra field appears:

- **Machine HP required** — a dropdown listing the HP ratings we make (3, 5, 7.5, 10, 15, 20 HP) plus "Not sure — please advise".

On a product page, or any form already tied to a machine, the HP field is hidden because the machine is already known.

Button stays "Get a Callback"; the layout becomes a compact stacked card instead of a single pill row, still full-width and thumb-friendly on mobile.

## Admin side

The Lead Inbox table gains a **Pincode** column and shows the requested HP inside the Machine column when no specific machine was selected (e.g. "Enquiry — 10 HP"). State keeps populating automatically from pincode, so the existing State column stays meaningful. Odoo sync payload includes the new fields.

## Technical notes

- Migration: add `pincode text` and `machine_hp text` to `public.leads` (both nullable). No new table, so existing grants/RLS stay as-is.
- Pincode lookup: `https://api.postalpincode.in/pincode/<code>` called from a public server function (`lookupPincode`) so the browser never depends on a third-party CORS policy; returns `{ state, district }`. Debounced on 6 digits, non-blocking — failure never prevents submit.
- `CallbackForm.tsx`: zod schema extended (name 2–80 chars, mobile as today, pincode `^\d{6}$`, city ≤ 80). New `showHpField` derived from absence of `machineName`; HP options read from `src/data/products.ts` so they stay in sync.
- Insert now writes `customer_name`, `city`, `state`, `pincode`, `machine_hp` alongside existing fields; `syncLead` unchanged in shape, `odoo.server.ts` select widened to include the two new columns.
- `admin.leads.tsx`: add Pincode column, include pincode/HP in the search filter.
