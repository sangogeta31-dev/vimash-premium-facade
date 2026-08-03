import { PhoneCall, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { syncLead } from "@/lib/leads.functions";

const mobileSchema = z
  .string()
  .trim()
  .min(8, { message: "Enter a valid mobile number" })
  .max(20, { message: "Mobile number is too long" })
  .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid mobile number" });

export function CallbackForm({
  variant = "light",
  className,
  machineName,
  machineSlug,
  source = "Website",
}: {
  variant?: "light" | "dark";
  className?: string;
  machineName?: string;
  machineSlug?: string;
  source?: string;
}) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = variant === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = mobileSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid mobile number");
      return;
    }

    setBusy(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("leads")
      .insert({
        mobile: parsed.data,
        machine_name: machineName ?? null,
        machine_slug: machineSlug ?? null,
        lead_source: source,
      })
      .select("id")
      .single();

    setBusy(false);

    if (insertError || !data) {
      setError("Could not send your request. Please call us instead.");
      return;
    }

    setSent(true);
    // Stored first, then pushed to Odoo — a sync failure never loses the lead.
    void syncLead({ data: { leadId: data.id } }).catch(() => undefined);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-2xl p-2 sm:flex-row sm:items-center sm:rounded-full",
          dark
            ? "border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-xl"
            : "border border-border bg-card shadow-[var(--shadow-elevated)]",
        )}
      >
        <input
          type="tel"
          inputMode="tel"
          required
          maxLength={20}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSent(false);
            setError(null);
          }}
          placeholder="Enter your mobile number"
          aria-label="Mobile number"
          className={cn(
            "min-w-0 flex-1 bg-transparent px-5 py-3.5 text-sm outline-none",
            dark
              ? "text-primary-foreground placeholder:text-primary-foreground/50"
              : "text-charcoal placeholder:text-muted-foreground/70",
          )}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : sent ? (
            <Check className="h-4 w-4" />
          ) : (
            <PhoneCall className="h-4 w-4" />
          )}
          {sent ? "Request received" : "Get a Callback"}
        </button>
      </div>
      <p
        className={cn(
          "mt-3 px-2 text-xs",
          error
            ? "text-destructive"
            : dark
              ? "text-primary-foreground/55"
              : "text-muted-foreground",
        )}
      >
        {error ??
          (machineName
            ? `Enquiry for ${machineName} — our engineer calls back within one working hour.`
            : "Just your number — our engineer calls back within one working hour.")}
      </p>
    </form>
  );
}
