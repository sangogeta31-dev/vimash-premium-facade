// Server-only Odoo CRM sync helper (Odoo JSON-2 API).
// Secrets (ODOO_URL / ODOO_API_KEY) are read here and never leave the server.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SyncResult = { status: "synced" | "failed"; error?: string; odooLeadId?: string | null };

type LeadRecord = {
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

/** Human-readable block for the Odoo lead description. */
function buildDescription(lead: LeadRecord): string {
  return [
    ["Machine HP", lead.machine_hp],
    ["State", lead.state],
    ["Pincode", lead.pincode],
    ["Lead Source", lead.lead_source],
    ["Source Page", lead.source_page],
  ]
    .filter(([, value]) => value != null && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

/**
 * JSON-2 `create` returns the new record id(s). The exact envelope is not
 * contractually fixed, so accept a bare number, an array of ids, or an object.
 */
function extractOdooLeadId(body: unknown): string | null {
  if (typeof body === "number" && Number.isFinite(body)) return String(body);
  if (typeof body === "string" && body.trim() !== "") return body.trim().slice(0, 128);
  if (Array.isArray(body)) return body.length > 0 ? extractOdooLeadId(body[0]) : null;
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const nested = record["result"] ?? record["data"] ?? record["ids"];
  if (nested !== undefined && nested !== record) {
    const fromNested = extractOdooLeadId(nested);
    if (fromNested) return fromNested;
  }
  for (const key of ["id", "lead_id", "crm_lead_id"]) {
    const value = record[key];
    const extracted = extractOdooLeadId(value);
    if (extracted) return extracted;
  }
  return null;
}

async function pushToOdoo(lead: LeadRecord): Promise<SyncResult> {
  const baseUrl = process.env["ODOO_URL"];
  const apiKey = process.env["ODOO_API_KEY"];

  if (!baseUrl || !apiKey) {
    return {
      status: "failed",
      error: "Odoo CRM is not connected yet — lead stored safely in the Lead Inbox.",
    };
  }

  const endpoint = `${baseUrl.replace(/\/+$/, "")}/json/2/crm.lead/create`;

  const values: Record<string, string> = {
    name: lead.machine_name?.trim() || "Vimash Website Enquiry",
    phone: lead.mobile,
    description: buildDescription(lead),
  };
  if (lead.customer_name?.trim()) values["contact_name"] = lead.customer_name.trim();
  if (lead.city?.trim()) values["city"] = lead.city.trim();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ vals_list: [values] }),
    });

    const text = await response.text();

    if (!response.ok) {
      // Trimmed so no upstream payload/credential detail floods the inbox column.
      const detail = text.trim().slice(0, 300);
      return {
        status: "failed",
        error: `Odoo responded with ${response.status}${detail ? `: ${detail}` : ""}`,
      };
    }

    let odooLeadId: string | null = null;
    try {
      if (text.trim() !== "") odooLeadId = extractOdooLeadId(JSON.parse(text));
    } catch {
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
