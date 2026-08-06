// Server-only Odoo CRM sync helper.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type SyncResult = { status: "synced" | "failed"; error?: string };

async function pushToOdoo(lead: {
  customer_name: string | null;
  mobile: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  machine_name: string | null;
  machine_hp: string | null;
  lead_source: string;
}): Promise<SyncResult> {
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
    return { status: "synced" };
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
    .select("customer_name, mobile, city, state, pincode, machine_name, machine_hp, lead_source")
    .eq("id", leadId)
    .maybeSingle();

  if (error || !lead) {
    return { status: "failed", error: "Lead not found" };
  }

  const result = await pushToOdoo(lead);

  await supabaseAdmin
    .from("leads")
    .update({
      odoo_sync_status: result.status,
      odoo_error: result.error ?? null,
      odoo_last_attempt_at: new Date().toISOString(),
      odoo_synced_at: result.status === "synced" ? new Date().toISOString() : null,
    })
    .eq("id", leadId);

  return result;
}
