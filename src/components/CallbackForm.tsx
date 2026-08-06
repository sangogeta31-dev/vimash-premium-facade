import { PhoneCall, Check, Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { syncLead } from "@/lib/leads.functions";
import { lookupPincode } from "@/lib/pincode.functions";
import { products } from "@/data/products";

const HP_OPTIONS = Array.from(new Set(products.map((p) => p.hp))).sort(
  (a, b) => Number(a) - Number(b),
);

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Enter your name" })
    .max(80, { message: "Name is too long" }),
  mobile: z
    .string()
    .trim()
    .min(8, { message: "Enter a valid mobile number" })
    .max(20, { message: "Mobile number is too long" })
    .regex(/^[0-9+\-\s()]+$/, { message: "Enter a valid mobile number" }),
  pincode: z.string().trim().regex(/^\d{6}$/, { message: "Enter a valid 6-digit pincode" }),
  city: z
    .string()
    .trim()
    .min(2, { message: "Enter your city" })
    .max(80, { message: "City name is too long" }),
});

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
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [cityTouched, setCityTouched] = useState(false);
  const [state, setState] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [hp, setHp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = variant === "dark";
  const showHp = !machineName;

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) {
      setState(null);
      return;
    }
    let cancelled = false;
    setLookingUp(true);
    const timer = setTimeout(() => {
      lookupPincode({ data: { pincode } })
        .then((res) => {
          if (cancelled) return;
          setState(res.state);
          if (res.city && !cityTouched) setCity(res.city);
        })
        .catch(() => undefined)
        .finally(() => {
          if (!cancelled) setLookingUp(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      setLookingUp(false);
    };
    // cityTouched intentionally excluded so typing a city doesn't refire lookup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pincode]);

  const fieldClass = cn(
    "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-colors sm:py-3 sm:text-sm",
    dark
      ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
      : "border-border bg-card text-charcoal placeholder:text-muted-foreground/70 focus:border-accent",
  );

  function resetError() {
    setSent(false);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = formSchema.safeParse({ name, mobile, pincode, city });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details");
      return;
    }
    if (showHp && !hp) {
      setError("Please select the machine HP you need");
      return;
    }

    setBusy(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("leads")
      .insert({
        customer_name: parsed.data.name,
        mobile: parsed.data.mobile,
        city: parsed.data.city,
        state,
        pincode: parsed.data.pincode,
        machine_name: machineName ?? null,
        machine_slug: machineSlug ?? null,
        machine_hp: showHp ? hp : null,
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
    setName("");
    setMobile("");
    setPincode("");
    setCity("");
    setCityTouched(false);
    setState(null);
    setHp("");
    // Stored first, then pushed to Odoo — a sync failure never loses the lead.
    void syncLead({ data: { leadId: data.id } }).catch(() => undefined);
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-2xl p-4",
          dark
            ? "border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-xl"
            : "border border-border bg-card shadow-[var(--shadow-elevated)]",
        )}
      >
        <input
          type="text"
          required
          maxLength={80}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            resetError();
          }}
          placeholder="Your name"
          aria-label="Your name"
          className={fieldClass}
        />

        <input
          type="tel"
          inputMode="tel"
          required
          maxLength={20}
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            resetError();
          }}
          placeholder="Mobile number"
          aria-label="Mobile number"
          className={fieldClass}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            inputMode="numeric"
            required
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
              resetError();
            }}
            placeholder="Pincode"
            aria-label="Pincode"
            className={fieldClass}
          />
          <input
            type="text"
            required
            maxLength={80}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCityTouched(true);
              resetError();
            }}
            placeholder="City"
            aria-label="City"
            className={fieldClass}
          />
        </div>

        {(lookingUp || state) && (
          <p
            className={cn(
              "flex items-center gap-1.5 px-1 text-xs",
              dark ? "text-primary-foreground/70" : "text-muted-foreground",
            )}
          >
            {lookingUp ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MapPin className="h-3.5 w-3.5" />
            )}
            {lookingUp ? "Finding your state…" : `State: ${state}`}
          </p>
        )}

        {showHp && (
          <select
            required
            value={hp}
            onChange={(e) => {
              setHp(e.target.value);
              resetError();
            }}
            aria-label="Machine HP required"
            className={cn(fieldClass, hp ? "" : dark ? "text-primary-foreground/50" : "text-muted-foreground/70")}
          >
            <option value="">Machine HP required</option>
            {HP_OPTIONS.map((h) => (
              <option key={h} value={h} className="text-charcoal">
                {h} HP
              </option>
            ))}
            <option value="Not sure" className="text-charcoal">
              Not sure — please advise
            </option>
          </select>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-70 sm:min-h-0 sm:text-sm"
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
            ? `Enquiry for ${machineName} — our team will call you as soon as possible.`
            : "Our team will call you as soon as possible.")}
      </p>
    </form>
  );
}
