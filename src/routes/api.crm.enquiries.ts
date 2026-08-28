import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 100;
const MAX_PER_PAGE = 100;

type FeedLead = {
  id: string;
  created: string;
  updated: string;
  name: string | null;
  phone: string;
  city: string | null;
  state: string | null;
  country: "India";
  products: string[];
  source: string;
  message: string;
  archived: boolean;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function parsePositiveInteger(value: string | null, fallback: number): number | null {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function buildMessage(lead: {
  machine_hp: string | null;
  pincode: string | null;
  source_page: string | null;
}): string {
  return [
    ["Machine HP", lead.machine_hp],
    ["Pincode", lead.pincode],
    ["Source Page", lead.source_page],
  ]
    .filter(([, value]) => value != null && value.trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export const Route = createFileRoute("/api/crm/enquiries")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expectedKey = process.env["CRM_FEED_KEY"];
        const providedKey = request.headers.get("X-Api-Key");

        if (!expectedKey || providedKey !== expectedKey) {
          return jsonResponse({ error: "Unauthorized" }, 401);
        }

        const url = new URL(request.url);
        const changedSince = url.searchParams.get("changed_since");
        if (changedSince !== null && (!changedSince || Number.isNaN(Date.parse(changedSince)))) {
          return jsonResponse({ error: "changed_since must be a valid ISO 8601 date" }, 400);
        }

        const page = parsePositiveInteger(url.searchParams.get("page"), DEFAULT_PAGE);
        const requestedPerPage = parsePositiveInteger(
          url.searchParams.get("per_page"),
          DEFAULT_PER_PAGE,
        );

        if (page === null || requestedPerPage === null) {
          return jsonResponse({ error: "page and per_page must be positive integers" }, 400);
        }

        const perPage = Math.min(requestedPerPage, MAX_PER_PAGE);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const baseQuery = supabaseAdmin
          .from("leads")
          .select(
            "id, created_at, updated_at, customer_name, mobile, city, state, machine_name, lead_source, machine_hp, pincode, source_page, archived",
          );
        const filteredQuery = changedSince ? baseQuery.gte("updated_at", changedSince) : baseQuery;
        const { data, error } = await filteredQuery
          .order("updated_at", { ascending: changedSince !== null })
          // A timestamp alone is not unique. Keep records with identical
          // updated_at values in a deterministic order across paginated calls.
          .order("id", { ascending: true })
          .range((page - 1) * perPage, page * perPage);

        if (error) {
          console.error("[CRM feed] Failed to read leads", error);
          return jsonResponse({ error: "Unable to read enquiries" }, 500);
        }

        const rows = data ?? [];
        const hasNextPage = rows.length > perPage;
        const leads = rows.slice(0, perPage).map((lead): FeedLead => ({
          id: lead.id,
          created: new Date(lead.created_at).toISOString(),
          updated: new Date(lead.updated_at).toISOString(),
          name: lead.customer_name,
          phone: lead.mobile,
          city: lead.city,
          state: lead.state,
          country: "India",
          products: lead.machine_name ? [lead.machine_name] : [],
          source: lead.lead_source,
          message: buildMessage(lead),
          archived: lead.archived,
        }));

        let next: string | null = null;
        if (hasNextPage) {
          const nextUrl = new URL(url);
          nextUrl.searchParams.set("page", String(page + 1));
          nextUrl.searchParams.set("per_page", String(perPage));
          next = nextUrl.toString();
        }

        return jsonResponse({ data: leads, paging: { next } });
      },
    },
  },
});
