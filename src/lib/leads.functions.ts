import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limiter.server";
import { sanitizeForStorage } from "@/lib/sanitize";

const submitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine(
      (val) => !/<|>|<script|<\/script|javascript:|onerror|onclick/i.test(val),
      { message: "Invalid characters detected in name" }
    ),
  mobile: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, { message: "Mobile number contains invalid characters" }),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "Pincode must be exactly 6 digits" }),
  city: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .refine(
      (val) => !/<|>|<script|<\/script|javascript:|onerror|onclick/i.test(val),
      { message: "Invalid characters detected in city" }
    ),
  state: z
    .string()
    .trim()
    .max(80)
    .refine(
      (val) => !val || !/<|>|<script|<\/script|javascript:|onerror|onclick/i.test(val),
      { message: "Invalid characters detected in state" }
    )
    .nullable()
    .optional(),
  machineName: z
    .string()
    .trim()
    .max(160)
    .refine(
      (val) => !val || !/<|>|<script|<\/script|javascript:|onerror|onclick/i.test(val),
      { message: "Invalid characters detected in machine name" }
    )
    .nullable()
    .optional(),
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
 * Public: submits a lead enquiry from the website.
 * 
 * Security features:
 * - CSRF protection (via global middleware in src/start.ts)
 * - Rate limiting (5 submissions per IP per 15 minutes)
 * - Server-side duplicate detection
 * - Input validation via Zod schema
 * 
 * Duplicate detection (same mobile + same machine) happens here, server-side,
 * before anything is written to the database. VIDU CRM pulls new leads from
 * the authenticated feed endpoint instead of receiving a push from here.
 */
export const submitLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }): Promise<SubmitLeadResult> => {
    try {
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
      // Archived leads are intentionally excluded, so a customer can submit a
      // fresh enquiry after an earlier lead was moved to the Bin.
      const { data: existing, error: lookupError } = await supabaseAdmin
        .from("leads")
        .select("id, mobile, machine_name")
        .eq("archived", false)
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
        customer_name: sanitizeForStorage(data.name),
        mobile: data.mobile.trim(),
        city: sanitizeForStorage(data.city),
        state: sanitizeForStorage(data.state) || null,
        pincode: data.pincode,
        machine_name: sanitizeForStorage(machineName),
        machine_slug: data.machineSlug ?? null,
        machine_hp: data.machineHp ?? null,
        lead_source: "Website",
        source_page: data.sourcePage ?? "Website",
      });

      if (insertError) return { status: "error" };

      return { status: "created" };
    } catch {
      // Catch-all: bad credentials, missing table, network failure — never abort HTTP.
      return { status: "error" };
    }
  });
