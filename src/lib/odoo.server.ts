// Server-only Odoo CRM sync helper.
// Secrets (ODOO_WEBHOOK_URL / ODOO_API_KEY) are read here and never leave the server.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SyncResult = { status: "synced" | "failed"; error?: string; odooLeadId?: string | null };

type OdooPayload = {
  customer_name: string | null;
  mobile: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  machine_name: string | null;
  machine_hp: string | null;
  lead_source: string;
  source_page: string | null;
};

/**
 * The Odoo webhook response format is not contractually defined, so we only pick up
 * an id when the body is JSON and carries an obvious identifier. Otherwise: null.
 */
function extractOdooLeadId(body: unknown): string | null {
  if (typeof body === "number") return String(body);
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const nested = record["result"] ?? record["data"] ?? record["lead"];
  const candidateSource =
    nested && typeof nested === "object" ? (nested as Record<string, unknown>) : record;
  for (const key of ["id", "lead_id", "odoo_lead_id", "crm_lead_id"]) {
    const value = candidateSource[key];
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "string" && value.trim() !== "") return value.trim().slice(0, 128);
  }
  return null;
}

async function pushToOdoo(lead: OdooPayload): Promise<SyncResult> {
  const url = process.env["ODOO_WEBHOOK_URL"];
  if (!url) {
    return {
      status: "failed",
      error: "Odoo CRM is not connected yet — lead stored safely in the Lead Inbox.",
    };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env["ODOO_API_KEY"]
          ? { authorization: `Bearer ${process.env["ODOO_API_KEY"]}` }
          : {}),
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      return { status: "failed", error: `Odoo responded with ${response.status}` };
    }

    let odooLeadId: string | null = null;
    try {
      const text = await response.text();
      if (text.trim() !== "") odooLeadId = extractOdooLeadId(JSON.parse(text));
    } catch {
      // Non-JSON or empty body is a valid success response — just no lead id to store.
      odooLeadId = null;
    }

    return { status: "synced", odooLeadId };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown Odoo sync error",
    };
  }
}

export async function syncLeadById(leadId: string): Promise<SyncResult> {
  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .select(
      "customer_name, mobile, city, state, pincode, machine_name, machine_hp, lead_source, source_page",
    )
    .eq("id", leadId)
    .maybeSingle();

  if (error || !lead) {
    return { status: "failed", error: "Lead not found" };
  }

  const result = await pushToOdoo(lead);
  const now = new Date().toISOString();

  if (result.status === "synced") {
    await supabaseAdmin
      .from("leads")
      .update({
        odoo_sync_status: "synced",
        odoo_error: null,
        odoo_last_attempt_at: now,
        odoo_synced_at: now,
        ...(result.odooLeadId ? { odoo_lead_id: result.odooLeadId } : {}),
      })
      .eq("id", leadId);
  } else {
    await supabaseAdmin
      .from("leads")
      .update({
        odoo_sync_status: "failed",
        odoo_error: result.error ?? "Odoo sync failed",
        odoo_last_attempt_at: now,
        odoo_synced_at: null,
      })
      .eq("id", leadId);
  }

  return result;
}
