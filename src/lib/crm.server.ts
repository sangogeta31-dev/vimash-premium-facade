// Server-only Vidu CRM sync helper.
// Secrets (CRM_URL / CRM_API_KEY) are read here and never leave the server.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SyncResult = { status: "synced" | "failed"; error?: string; crmLeadId?: string | null };

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

/** Human-readable block for the CRM lead description. */
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
 * CRM API may return the new record id in various formats.
 * Accept a bare number, an array of ids, or an object.
 */
function extractCrmLeadId(body: unknown): string | null {
  if (typeof body === "number" && Number.isFinite(body)) return String(body);
  if (typeof body === "string" && body.trim() !== "") return body.trim().slice(0, 128);
  if (Array.isArray(body)) return body.length > 0 ? extractCrmLeadId(body[0]) : null;
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const nested = record["result"] ?? record["data"] ?? record["ids"];
  if (nested !== undefined && nested !== record) {
    const fromNested = extractCrmLeadId(nested);
    if (fromNested) return fromNested;
  }
  for (const key of ["id", "lead_id", "crm_lead_id"]) {
    const value = record[key];
    const extracted = extractCrmLeadId(value);
    if (extracted) return extracted;
  }
  return null;
}

async function pushToCrm(lead: LeadRecord): Promise<SyncResult> {
  const baseUrl = process.env["CRM_URL"] || process.env["ODOO_URL"]; // Support legacy var
  const apiKey = process.env["CRM_API_KEY"] || process.env["ODOO_API_KEY"]; // Support legacy var

  if (!baseUrl || !apiKey) {
    return {
      status: "failed",
      error: "Vidu CRM is not connected yet — lead stored safely in the Lead Inbox.",
    };
  }

  // TODO: Update endpoint for Vidu CRM API
  const endpoint = `${baseUrl.replace(/\/+$/, "")}/api/leads/create`;

  const values: Record<string, string> = {
    name: lead.machine_name?.trim() || "Vimash Website Enquiry",
    phone: lead.mobile,
    description: buildDescription(lead),
  };
  if (lead.customer_name?.trim()) values["contact_name"] = lead.customer_name.trim();
  if (lead.city?.trim()) values["city"] = lead.city.trim();

  try {
    // 30 second timeout for CRM API calls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    // TODO: Update request body format for Vidu CRM API
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ vals_list: [values] }), // May need adjustment for Vidu
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const text = await response.text();

    if (!response.ok) {
      // Trimmed so no upstream payload/credential detail floods the inbox column.
      const detail = text.trim().slice(0, 300);
      return {
        status: "failed",
        error: `Vidu CRM responded with ${response.status}${detail ? `: ${detail}` : ""}`,
      };
    }

    let crmLeadId: string | null = null;
    try {
      if (text.trim() !== "") crmLeadId = extractCrmLeadId(JSON.parse(text));
    } catch {
      crmLeadId = null;
    }

    return { status: "synced", crmLeadId };
  } catch (error) {
    let errorMessage = "Unknown CRM sync error";
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Vidu CRM API request timeout (30s)";
      } else {
        errorMessage = error.message;
      }
    }
    return {
      status: "failed",
      error: errorMessage,
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

  const result = await pushToCrm(lead);
  const now = new Date().toISOString();

  if (result.status === "synced") {
    await supabaseAdmin
      .from("leads")
      .update({
        odoo_sync_status: "synced",
        odoo_error: null,
        odoo_last_attempt_at: now,
        odoo_synced_at: now,
        ...(result.crmLeadId ? { odoo_lead_id: result.crmLeadId } : {}), // Column name stays for DB compat
      })
      .eq("id", leadId);
  } else {
    await supabaseAdmin
      .from("leads")
      .update({
        odoo_sync_status: "failed",
        odoo_error: result.error ?? "CRM sync failed",
        odoo_last_attempt_at: now,
        odoo_synced_at: null,
      })
      .eq("id", leadId);
  }

  return result;
}
