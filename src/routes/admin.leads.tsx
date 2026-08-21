import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  Trash2,
  RefreshCw,
  Search,
  ShieldAlert,
  TriangleAlert,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { retryLeadSync } from "@/lib/leads.functions";
import { cn } from "@/lib/utils";
import { LeadDateRange, defaultLeadRange, type LeadRange } from "@/components/admin/LeadDateRange";

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
  pincode: string | null;
  machine_name: string | null;
  machine_hp: string | null;
  lead_source: string;
  source_page: string | null;

  odoo_sync_status: "pending" | "synced" | "failed";
  odoo_error: string | null;
  archived: boolean;
  created_at: string;
};

type Filter = "all" | "synced" | "unsynced" | "archived";

type BulkConfirm = { ids: string[]; mode: "bin" | "permanent" };

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

/** Checkbox that supports the indeterminate state */
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={ariaLabel}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 cursor-pointer accent-primary"
    />
  );
}

function LeadInboxPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<"loading" | "in" | "out">("loading");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [range, setRange] = useState<LeadRange>(() => defaultLeadRange());

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmLead, setConfirmLead] = useState<{ lead: Lead; mode: "bin" | "permanent" } | null>(
    null,
  );

  // ── Multi-select state ────────────────────────────────────────────────────
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState<BulkConfirm | null>(null);

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
          "id, customer_name, mobile, city, state, pincode, machine_name, machine_hp, lead_source, source_page, odoo_sync_status, odoo_error, archived, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const leads = leadsQuery.data ?? [];
  const isForbidden =
    authState === "in" && !leadsQuery.isLoading && !leadsQuery.error && leads.length === 0;

  const dated = useMemo(() => {
    const { from, to } = range;
    return leads.filter((lead) => {
      const t = new Date(lead.created_at).getTime();
      if (from !== null && t < from) return false;
      if (to !== null && t > to) return false;
      return true;
    });
  }, [leads, range]);

  const counts = useMemo(
    () => ({
      all: dated.filter((l) => !l.archived).length,
      synced: dated.filter((l) => !l.archived && l.odoo_sync_status === "synced").length,
      unsynced: dated.filter((l) => !l.archived && l.odoo_sync_status !== "synced").length,
      archived: dated.filter((l) => l.archived).length,
    }),
    [dated],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dated.filter((lead) => {
      if (filter === "archived" ? !lead.archived : lead.archived) return false;
      if (filter === "synced" && lead.odoo_sync_status !== "synced") return false;
      if (filter === "unsynced" && lead.odoo_sync_status === "synced") return false;
      if (!q) return true;
      return [
        lead.customer_name,
        lead.mobile,
        lead.machine_name,
        lead.pincode,
        lead.city,
        lead.machine_hp,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q));
    });
  }, [dated, query, filter]);

  // Clear selection when filter / search / range changes
  useEffect(() => {
    setSelected(new Set());
  }, [filter, query, range]);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const visibleIds = useMemo(() => visible.map((l) => l.id), [visible]);
  const selectedCount = selected.size;
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id)) && !allVisibleSelected;

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(visibleIds) : new Set());
  }

  function clearSelection() {
    setSelected(new Set());
  }

  // ── Single-lead actions ───────────────────────────────────────────────────
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

  async function onConfirm() {
    if (!confirmLead) return;
    const { lead, mode } = confirmLead;
    setConfirmLead(null);
    setBusyId(lead.id);
    if (mode === "permanent") {
      await supabase.from("leads").delete().eq("id", lead.id);
    } else {
      await supabase.from("leads").update({ archived: true }).eq("id", lead.id);
    }
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
    setBusyId(null);
  }

  // ── Bulk actions ──────────────────────────────────────────────────────────
  async function onBulkConfirm() {
    if (!bulkConfirm) return;
    const { ids, mode } = bulkConfirm;
    setBulkConfirm(null);
    setBulkBusy(true);

    if (mode === "permanent") {
      await supabase.from("leads").delete().in("id", ids);
    } else {
      await supabase.from("leads").update({ archived: true }).in("id", ids);
    }

    clearSelection();
    await queryClient.invalidateQueries({ queryKey: ["leads"] });
    setBulkBusy(false);
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
    { key: "archived", label: `Bin (${counts.archived})` },
  ];

  const selectedIds = Array.from(selected);
  const inBinView = filter === "archived";

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
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto">
          <LeadDateRange value={range} onChange={setRange} />
          <button
            onClick={() => leadsQuery.refetch()}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-secondary"
          >
            <RefreshCw className={cn("h-4 w-4", leadsQuery.isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card px-4 py-3 sm:px-5">
        <p className="text-sm font-semibold text-charcoal">
          Showing <span className="text-primary">{visible.length}</span>{" "}
          {visible.length === 1 ? "lead" : "leads"}
          <span className="ml-1 font-normal text-muted-foreground">· {range.label}</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, mobile, pincode or machine"
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
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  {/* Select-all checkbox */}
                  <th className="w-10 px-4 py-4">
                    <IndeterminateCheckbox
                      checked={allVisibleSelected}
                      indeterminate={someVisibleSelected}
                      onChange={toggleAll}
                      ariaLabel="Select all visible leads"
                    />
                  </th>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Mobile</th>
                  <th className="px-5 py-4 font-semibold">City</th>
                  <th className="px-5 py-4 font-semibold">Pincode</th>
                  <th className="px-5 py-4 font-semibold">State</th>
                  <th className="px-5 py-4 font-semibold">Machine</th>
                  <th className="px-5 py-4 font-semibold">HP</th>
                  <th className="px-5 py-4 font-semibold">Date &amp; time</th>
                  <th className="px-5 py-4 font-semibold">Source</th>
                  <th className="px-5 py-4 font-semibold">Odoo sync</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((lead) => {
                  const isSelected = selected.has(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      className={cn(
                        "border-t border-border/70 transition-colors",
                        isSelected ? "bg-primary/5" : "hover:bg-secondary/40",
                      )}
                    >
                      {/* Row checkbox */}
                      <td className="px-4 py-4">
                        <IndeterminateCheckbox
                          checked={isSelected}
                          onChange={(checked) => toggleRow(lead.id, checked)}
                          ariaLabel={`Select lead from ${lead.customer_name ?? lead.mobile}`}
                        />
                      </td>
                      <td className="px-5 py-4 font-medium text-charcoal">
                        {lead.customer_name ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-charcoal">
                        <a href={`tel:${lead.mobile}`} className="hover:text-primary">
                          {lead.mobile}
                        </a>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{lead.city ?? "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground">{lead.pincode ?? "—"}</td>
                      <td className="px-5 py-4 text-muted-foreground">{lead.state ?? "—"}</td>
                      <td className="px-5 py-4 text-charcoal">
                        {lead.machine_name ?? "General enquiry"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {lead.machine_hp
                          ? /hp|not sure/i.test(lead.machine_hp)
                            ? lead.machine_hp
                            : `${lead.machine_hp} HP`
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(lead.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {lead.lead_source}
                        {lead.source_page && (
                          <span className="mt-0.5 block text-xs text-muted-foreground/70">
                            {lead.source_page}
                          </span>
                        )}
                      </td>

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
                          {lead.archived ? (
                            <button
                              onClick={() => setConfirmLead({ lead, mode: "permanent" })}
                              disabled={busyId === lead.id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete permanently
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmLead({ lead, mode: "bin" })}
                              disabled={busyId === lead.id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Deleting a lead moves it to Bin. Leads are only removed for good when you delete them
        permanently from Bin.
      </p>

      {/* ── Floating bulk-action bar ─────────────────────────────────────── */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-[var(--shadow-elevated)] backdrop-blur-md">
            <span className="min-w-[5ch] text-sm font-semibold text-charcoal">
              {selectedCount} selected
            </span>
            <div className="h-4 w-px bg-border" />
            {inBinView ? (
              <button
                disabled={bulkBusy}
                onClick={() => setBulkConfirm({ ids: selectedIds, mode: "permanent" })}
                className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {bulkBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete permanently
              </button>
            ) : (
              <button
                disabled={bulkBusy}
                onClick={() => setBulkConfirm({ ids: selectedIds, mode: "bin" })}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
              >
                {bulkBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Move to Bin
              </button>
            )}
            <button
              onClick={clearSelection}
              aria-label="Clear selection"
              className="ml-1 grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-charcoal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Single-lead confirm dialog ───────────────────────────────────── */}
      {confirmLead && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-title"
          className="fixed inset-0 z-50 grid place-items-center bg-charcoal/50 p-5 backdrop-blur-sm"
          onClick={() => setConfirmLead(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-elevated)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10">
              <TriangleAlert className="h-5 w-5 text-destructive" />
            </div>
            <h2
              id="confirm-delete-title"
              className="mt-4 font-display text-xl font-bold text-charcoal"
            >
              {confirmLead.mode === "permanent"
                ? "Delete this lead permanently?"
                : "Move this lead to Bin?"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirmLead.lead.customer_name
                ? `${confirmLead.lead.customer_name} · ${confirmLead.lead.mobile}`
                : confirmLead.lead.mobile}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {confirmLead.mode === "permanent"
                ? "This removes the lead from the database. It cannot be undone."
                : "The lead will be moved to Bin and hidden from the main list."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmLead(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition-transform hover:-translate-y-0.5"
              >
                <Trash2 className="h-4 w-4" />
                {confirmLead.mode === "permanent" ? "Delete permanently" : "Move to Bin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk confirm dialog ──────────────────────────────────────────── */}
      {bulkConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="bulk-confirm-title"
          className="fixed inset-0 z-50 grid place-items-center bg-charcoal/50 p-5 backdrop-blur-sm"
          onClick={() => setBulkConfirm(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-elevated)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10">
              <TriangleAlert className="h-5 w-5 text-destructive" />
            </div>
            <h2
              id="bulk-confirm-title"
              className="mt-4 font-display text-xl font-bold text-charcoal"
            >
              {bulkConfirm.mode === "permanent"
                ? `Delete ${bulkConfirm.ids.length} leads permanently?`
                : `Move ${bulkConfirm.ids.length} leads to Bin?`}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {bulkConfirm.mode === "permanent"
                ? "This will permanently remove all selected leads from the database. This action cannot be undone."
                : "All selected leads will be moved to Bin and hidden from the main list."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setBulkConfirm(null)}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                onClick={onBulkConfirm}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition-transform hover:-translate-y-0.5"
              >
                <Trash2 className="h-4 w-4" />
                {bulkConfirm.mode === "permanent"
                  ? `Delete ${bulkConfirm.ids.length} permanently`
                  : `Move ${bulkConfirm.ids.length} to Bin`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
