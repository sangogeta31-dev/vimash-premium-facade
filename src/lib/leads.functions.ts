import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rateLimit } from "@/lib/rate-limiter.server";

const idSchema = z.object({ leadId: z.string().uuid() });

const submitSchema = z.object({
  name: z.string().trim().min(2).max(80),
  mobile: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().max(80).nullable().optional(),
  machineName: z.string().trim().max(160).nullable().optional(),
  machineSlug: z.string().trim().max(160).nullable().optional(),
  machineHp: z.string().trim().max(40).nullable().optional(),
  sourcePage: z.string().trim().max(160).optional(),
});

export type SubmitLeadResult =
  { status: "created" } | { status: "duplicate" } | { status: "error" };

/**
 * Normalises an Indian mobile number to its last 10 digits so that
 * "+91 95749 54050", "09574954050" and "9574954050" compare equal.
 */
function normaliseMobile(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function normaliseMachine(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Public: the single entry point for website enquiries.
 * Duplicate detection (same mobile + same machine) happens here, server-side,
 * before anything is written to the database or pushed to Odoo.
 */
export const submitLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitLeadResult> => {
    // Rate limit: 5 submissions per IP per 15 minutes
    if (!rateLimit("submitLead", 5, 15 * 60 * 1000)) {
      return { status: "error" };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const machineName = (data.machineName ?? "General enquiry").trim();
    const machineKey = normaliseMachine(machineName);
    const mobileKey = normaliseMobile(data.mobile);

    // Narrow by machine name case-insensitively in SQL, then compare the
    // normalised mobile in code (formatting varies too much for a SQL match).
    // Only "synced" or "pending" leads count — a previously failed sync must
    // never block the customer from enquiring again.
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("leads")
      .select("id, mobile, machine_name, odoo_sync_status")
      .eq("archived", false)
      .in("odoo_sync_status", ["synced", "pending"])
      .ilike("machine_name", machineName);

    if (lookupError) return { status: "error" };

    const isDuplicate = (existing ?? []).some(
      (lead) =>
        normaliseMobile(lead.mobile) === mobileKey &&
        normaliseMachine(lead.machine_name) === machineKey,
    );

    if (isDuplicate) return { status: "duplicate" };

    const leadId = crypto.randomUUID();
    const { error: insertError } = await supabaseAdmin.from("leads").insert({
      id: leadId,
      customer_name: data.name,
      mobile: data.mobile.trim(),
      city: data.city,
      state: data.state ?? null,
      pincode: data.pincode,
      machine_name: machineName,
      machine_slug: data.machineSlug ?? null,
      machine_hp: data.machineHp ?? null,
      lead_source: "Website",
      source_page: data.sourcePage ?? "Website",
      odoo_sync_status: "pending",
    });

    if (insertError) return { status: "error" };

    // Stored first, then pushed to Odoo — a sync failure never loses the lead.
    const { syncLeadById } = await import("@/lib/odoo.server");
    try {
      await syncLeadById(leadId);
    } catch {
      // Sync status is already persisted by syncLeadById; never fail the visitor.
    }

    return { status: "created" };
  });

// syncLead was removed — it was publicly callable without authentication.
// submitLead already calls syncLeadById internally, and retryLeadSync
// (admin-only, below) handles manual retries from the Lead Inbox.

/** Admin-only manual retry from the Lead Inbox. */
export const retryLeadSync = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Rate limit: 20 retries per IP per 15 minutes
    if (!rateLimit("retryLeadSync", 20, 15 * 60 * 1000)) {
      throw new Error("Too many requests");
    }

    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { syncLeadById } = await import("@/lib/odoo.server");
    return syncLeadById(data.leadId);
  });
