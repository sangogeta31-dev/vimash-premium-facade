import { PhoneCall, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CallbackForm({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);
  const dark = variant === "dark";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim().length >= 8) setSent(true);
      }}
      className={cn("w-full", className)}
    >
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
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSent(false);
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
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          {sent ? <Check className="h-4 w-4" /> : <PhoneCall className="h-4 w-4" />}
          {sent ? "Request received" : "Get a Callback"}
        </button>
      </div>
      <p
        className={cn(
          "mt-3 px-2 text-xs",
          dark ? "text-primary-foreground/55" : "text-muted-foreground",
        )}
      >
        Just your number — our engineer calls back within one working hour.
      </p>
    </form>
  );
}
