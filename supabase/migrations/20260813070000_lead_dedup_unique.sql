-- Defence in depth against the duplicate-lead race: two identical submissions
-- can both pass the in-code duplicate check and insert twice. This unique index
-- mirrors the code's duplicate semantics exactly:
--   * mobile compared by its last 10 digits (ignoring formatting)
--   * machine name compared case-insensitively, trimmed
--   * only non-archived, non-failed leads count (a failed sync must never
--     block a new enquiry)
--
-- Part 1 is a self-healing dedup pass: any existing duplicates are moved to
-- the Bin (archived, never deleted) BEFORE the index is created, so this
-- migration cannot fail on pre-existing data.
--
-- Part 2 creates the unique index. If it somehow still errors, inspect the
-- offending rows, clean them up, and re-run.

-- Part 1: archive older duplicates (keep the newest row per mobile+machine)
UPDATE public.leads l
SET archived = true
FROM (
  SELECT id,
         row_number() OVER (
           PARTITION BY right(regexp_replace(mobile, '\D', '', 'g'), 10),
                        lower(btrim(machine_name))
           ORDER BY created_at DESC, id DESC
         ) AS rn
  FROM public.leads
  WHERE archived = false AND odoo_sync_status IN ('synced', 'pending')
) dup
WHERE l.id = dup.id AND dup.rn > 1;

-- Part 2: unique index for active, non-failed leads
CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_active_mobile_machine
  ON public.leads (
    right(regexp_replace(mobile, '\D', '', 'g'), 10),
    lower(btrim(machine_name))
  )
  WHERE archived = false AND odoo_sync_status IN ('synced', 'pending');
