import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  invert = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  invert?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em]",
            invert ? "text-accent" : "text-accent",
          )}
        >
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
          invert ? "text-primary-foreground" : "text-charcoal",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            invert ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
