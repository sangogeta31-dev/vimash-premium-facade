import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDays, Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type LeadRange = {
  key: string;
  label: string;
  from: number | null;
  to: number | null;
};

const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const endOf = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const PRESETS: { key: string; label: string; compute: () => { from: number | null; to: number | null } }[] = [
  { key: "today", label: "Today", compute: () => ({ from: startOf(new Date()), to: endOf(new Date()) }) },
  {
    key: "yesterday",
    label: "Yesterday",
    compute: () => ({ from: startOf(daysAgo(1)), to: endOf(daysAgo(1)) }),
  },
  {
    key: "7",
    label: "Last 7 days",
    compute: () => ({ from: startOf(daysAgo(6)), to: endOf(new Date()) }),
  },
  {
    key: "14",
    label: "Last 14 days",
    compute: () => ({ from: startOf(daysAgo(13)), to: endOf(new Date()) }),
  },
  {
    key: "30",
    label: "Last 30 days",
    compute: () => ({ from: startOf(daysAgo(29)), to: endOf(new Date()) }),
  },
  {
    key: "this-week",
    label: "This week",
    compute: () => {
      const now = new Date();
      const diff = (now.getDay() + 6) % 7; // week starts Monday
      return { from: startOf(daysAgo(diff)), to: endOf(new Date()) };
    },
  },
  {
    key: "last-week",
    label: "Last week",
    compute: () => {
      const now = new Date();
      const diff = (now.getDay() + 6) % 7;
      return { from: startOf(daysAgo(diff + 7)), to: endOf(daysAgo(diff + 1)) };
    },
  },
  {
    key: "this-month",
    label: "This month",
    compute: () => {
      const now = new Date();
      return { from: startOf(new Date(now.getFullYear(), now.getMonth(), 1)), to: endOf(new Date()) };
    },
  },
  {
    key: "last-month",
    label: "Last month",
    compute: () => {
      const now = new Date();
      return {
        from: startOf(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        to: endOf(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    },
  },
  { key: "max", label: "Maximum", compute: () => ({ from: null, to: null }) },
];

export function defaultLeadRange(): LeadRange {
  const preset = PRESETS.find((p) => p.key === "30")!;
  return { key: preset.key, label: preset.label, ...preset.compute() };
}

const fmt = (t: number) =>
  new Date(t).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export function LeadDateRange({
  value,
  onChange,
}: {
  value: LeadRange;
  onChange: (range: LeadRange) => void;
}) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(
    value.key === "custom" && value.from
      ? { from: new Date(value.from), to: value.to ? new Date(value.to) : undefined }
      : undefined,
  );

  const summary =
    value.from === null && value.to === null
      ? "All time"
      : `${value.from ? fmt(value.from) : "…"} – ${value.to ? fmt(value.to) : "Today"}`;

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key)!;
    onChange({ key, label: preset.label, ...preset.compute() });
    setShowCustom(false);
    setOpen(false);
  }

  function applyCustom() {
    if (!draft?.from) return;
    const from = startOf(draft.from);
    const to = endOf(draft.to ?? draft.from);
    onChange({ key: "custom", label: "Custom range", from, to });
    setOpen(false);
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setShowCustom(value.key === "custom");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Change date range"
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-secondary"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{value.label}</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{summary}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(20rem,calc(100vw-2rem))] rounded-3xl border-border bg-card p-2 shadow-[var(--shadow-elevated)]"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {!showCustom ? (
            <div className="flex flex-col">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
                    value.key === p.key
                      ? "bg-primary/10 text-primary"
                      : "text-charcoal hover:bg-secondary",
                  )}
                >
                  {p.label}
                  {value.key === p.key && <Check className="h-4 w-4" />}
                </button>
              ))}
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => setShowCustom(true)}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
                  value.key === "custom"
                    ? "bg-primary/10 text-primary"
                    : "text-charcoal hover:bg-secondary",
                )}
              >
                Custom range
                {value.key === "custom" && <Check className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <div className="p-1">
              <div className="flex items-center justify-between px-3 py-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Custom range
                </p>
                <button
                  onClick={() => setShowCustom(false)}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Presets
                </button>
              </div>
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={draft}
                onSelect={setDraft}
                disabled={{ after: new Date() }}
                className="pointer-events-auto mx-auto"
              />
              <div className="flex items-center justify-end gap-2 px-2 pb-1">
                <button
                  onClick={() => setDraft(undefined)}
                  className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-charcoal transition-colors hover:bg-secondary"
                >
                  Clear
                </button>
                <button
                  onClick={applyCustom}
                  disabled={!draft?.from}
                  className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
