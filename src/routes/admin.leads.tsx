import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { retryLeadSync } from "@/lib/leads.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Lead Inbox — Vimash Manufacturing Admin" },
      {
        name: "description",
        content:
          "Every website enquiry stored safely, with Odoo CRM sync status and retry for failed leads.",
      },
      { property: "og:title", content: "Lead Inbox — Vimash Manufacturing Admin" },
      {
        property: "og:description",
        content: "Every website enquiry stored safely with Odoo CRM sync status.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LeadInboxPage,
});

type Lead = {
  id: string;
  customer_name: string | null;
  mobile: string;
  city: string | null;
  state: string | null;
  machine_name: string | null;
  lead_source: string;
  odoo_sync_status: "pending" | "synced" | "failed";
  odoo_error: string | null;
  archived: boolean;
  created_at: string;
};

type Filter = "all" | "synced" | "unsynced" | "archived";

function StatusBadge({ status }: { status: Lead["odoo_sync_status"] }) {
  const map = {
    synced: { label: "Synced", icon: CheckCircle2, cls: "bg-primary/10 text-primary" },
    pending: { label: "Pending", icon: Clock, cls: "bg-muted text-muted-foreground" },
    failed: { label: "Failed", icon: TriangleAlert, cls: "bg-destructive/10 text-destructive" },
  } as const;
  const { label, icon: Icon, cls } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        cls,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function LeadInboxPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<"loading" | "in" | "out">("loading");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "in" : "out");
    });
    supabase.auth.getSession().then(({ data }) => setAuthState(data.session ? "in" : "out"));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authState === "out") navigate({ to: "/auth" });
  }, [authState, navigate]);

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    enabled: authState === "in",
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select(
          "id, customer_name, mobile, city, state, machine_name, lead_source, odoo_sync_status, odoo_error, archived, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const leads = leadsQuery.data ?? [];
  const isForbidden =
    authState === "in" && !leadsQuery.isLoading && !leadsQuery.error && leads.length === 0;

  const counts = useMemo(
    () => ({
      all: leads.filter((l) => !l.archived).length,
      synced: leads.filter((l) => !l.archived && l.odoo_sync_status === "synced").length,
      unsynced: leads.filter((l) => !l.archived && l.odoo_sync_status !== "synced").length,
      archived: leads.filter((l) => l.archived).length,
    }),
    [leads],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filter === "archived" ? !lead.archived : lead.archived) return false;
      if (filter === "synced" && lead.odoo_sync_status !== "synced") return false;
      if (filter === "unsynced" && lead.odoo_sync_status === "synced") return false;
      if (!q) return true;
      return [lead.customer_name, lead.mobile, lead.machine_name]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [leads, query, filter]);

  async function onRetry(id: string) {
    setBusyId(id);
    try {
      await retryLeadSync({ data: { leadId: id } });
    } catch {
      /* status stays failed */
    }
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
    setBusyId(null);
  }

  async function onArchiveToggle(lead: Lead) {
    setBusyId(lead.id);
    await supabase.from("leads").update({ archived: !lead.archived }).eq("id", lead.id);
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
    setBusyId(null);
  }

  if (authState !== "in") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: `All leads (${counts.all})` },
    { key: "synced", label: `Synced (${counts.synced})` },
    { key: "unsynced", label: `Pending / failed (${counts.unsynced})` },
    { key: "archived", label: `Archived (${counts.archived})` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Inbox className="h-3.5 w-3.5" /> Lead Inbox
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Every website enquiry, safely stored
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Leads are saved here first and then pushed to Odoo CRM. If a sync fails, retry it —
            nothing is ever lost or deleted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => leadsQuery.refetch()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-secondary"
          >
            <RefreshCw className={cn("h-4 w-4", leadsQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/auth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, mobile or machine"
            aria-label="Search leads"
            className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm text-charcoal outline-none transition-colors focus:border-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-charcoal",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elevated)]">
        {leadsQuery.isLoading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : leadsQuery.error ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <ShieldAlert className="h-6 w-6 text-destructive" />
            <p className="text-sm text-muted-foreground">
              You don't have Lead Inbox access on this account.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Inbox className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isForbidden
                ? "No leads visible yet. New website enquiries will appear here."
                : "No leads match this view."}
            </p>
            <Link to="/products" className="text-sm font-semibold text-primary">
              View products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Mobile</th>
                  <th className="px-5 py-4 font-semibold">City</th>
                  <th className="px-5 py-4 font-semibold">State</th>
                  <th className="px-5 py-4 font-semibold">Machine</th>
                  <th className="px-5 py-4 font-semibold">Date &amp; time</th>
                  <th className="px-5 py-4 font-semibold">Source</th>
                  <th className="px-5 py-4 font-semibold">Odoo sync</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-border/70 transition-colors hover:bg-secondary/40"
                  >
                    <td className="px-5 py-4 font-medium text-charcoal">
                      {lead.customer_name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-charcoal">
                      <a href={`tel:${lead.mobile}`} className="hover:text-primary">
                        {lead.mobile}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.city ?? "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.state ?? "—"}</td>
                    <td className="px-5 py-4 text-charcoal">{lead.machine_name ?? "General enquiry"}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(lead.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{lead.lead_source}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={lead.odoo_sync_status} />
                      {lead.odoo_error && lead.odoo_sync_status === "failed" && (
                        <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">
                          {lead.odoo_error}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {lead.odoo_sync_status !== "synced" && (
                          <button
                            onClick={() => onRetry(lead.id)}
                            disabled={busyId === lead.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                          >
                            {busyId === lead.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3.5 w-3.5" />
                            )}
                            Retry sync
                          </button>
                        )}
                        <button
                          onClick={() => onArchiveToggle(lead)}
                          disabled={busyId === lead.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-charcoal disabled:opacity-60"
                        >
                          {lead.archived ? (
                            <>
                              <ArchiveRestore className="h-3.5 w-3.5" /> Restore
                            </>
                          ) : (
                            <>
                              <Archive className="h-3.5 w-3.5" /> Archive
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Leads can never be deleted — archiving only hides them from the default view.
      </p>
    </div>
  );
}
