import { PhoneCall, Check, Loader2, MapPin, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/leads.functions";
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
  machineHp,
  source = "Website",
}: {
  variant?: "light" | "dark";
  className?: string;
  machineName?: string;
  machineSlug?: string;
  machineHp?: string;
  /** The page the enquiry was submitted from — stored as source_page. */
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
  const [hpOpen, setHpOpen] = useState(false);
  const hpRef = useRef<HTMLDivElement | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dark = variant === "dark";
  // A known machine already carries its HP, so only ask when the enquiry is generic.
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

  useEffect(() => {
    if (!hpOpen) return;
    function onDown(e: MouseEvent) {
      if (hpRef.current && !hpRef.current.contains(e.target as Node)) setHpOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setHpOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [hpOpen]);

  const fieldClass = cn(
    "w-full rounded-xl border px-4 py-3.5 text-base outline-none transition-colors sm:py-3 sm:text-sm",
    dark
      ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent"
      : "border-border bg-card text-charcoal placeholder:text-muted-foreground/70 focus:border-accent",
  );

  function resetError() {
    setSent(false);
    setDuplicate(false);
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
    setDuplicate(false);

    const selectedHp = showHp ? (hp === "Not sure" ? "Not sure" : `${hp} HP`) : (machineHp ?? null);

    // Storing, duplicate detection and the Odoo push all happen server-side.
    let result: { status: "created" | "duplicate" | "error" };
    try {
      result = await submitLead({
        data: {
          name: parsed.data.name,
          mobile: parsed.data.mobile,
          pincode: parsed.data.pincode,
          city: parsed.data.city,
          state,
          machineName: machineName ?? null,
          machineSlug: machineSlug ?? null,
          machineHp: selectedHp,
          sourcePage: source,
        },
      });
    } catch {
      result = { status: "error" };
    }

    setBusy(false);

    if (result.status === "error") {
      setError("Could not send your request. Please call us instead.");
      return;
    }

    if (result.status === "duplicate") {
      setDuplicate(true);
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
          <div className="relative" ref={hpRef}>
            <button
              type="button"
              onClick={() => setHpOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={hpOpen}
              aria-label="Machine HP required"
              className={cn(
                fieldClass,
                "flex items-center justify-between gap-2 text-left",
                hpOpen && "border-accent",
                !hp && (dark ? "text-primary-foreground/50" : "text-muted-foreground/70"),
              )}
            >
              <span>
                {hp ? (hp === "Not sure" ? "Not sure — please advise" : `${hp} HP`) : "Machine HP required"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-accent transition-transform duration-200",
                  hpOpen && "rotate-180",
                )}
              />
            </button>

            {hpOpen && (
              <ul
                role="listbox"
                className={cn(
                  "absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border p-1.5 shadow-[var(--shadow-elevated)]",
                  dark
                    ? "border-primary-foreground/20 bg-primary text-primary-foreground backdrop-blur-xl"
                    : "border-border bg-card text-charcoal",
                )}
              >
                {[...HP_OPTIONS.map((h) => ({ value: h, label: `${h} HP` })), { value: "Not sure", label: "Not sure — please advise" }].map(
                  (opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={hp === opt.value}
                        onClick={() => {
                          setHp(opt.value);
                          setHpOpen(false);
                          resetError();
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3.5 py-3 text-left text-base transition-colors sm:py-2.5 sm:text-sm",
                          hp === opt.value
                            ? "bg-accent text-accent-foreground"
                            : dark
                              ? "hover:bg-primary-foreground/10"
                              : "hover:bg-secondary",
                        )}
                      >
                        {opt.label}
                        {hp === opt.value && <Check className="h-4 w-4" />}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
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
