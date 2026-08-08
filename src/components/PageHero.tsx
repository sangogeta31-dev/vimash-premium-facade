import { Reveal } from "./Reveal";
import { darkSectionBg } from "./section-backgrounds";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative isolate overflow-hidden section-navy blueprint-dark">
      <img
        src={darkSectionBg}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={912}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--primary) 92%, transparent) 0%, color-mix(in oklab, var(--primary) 80%, transparent) 55%, color-mix(in oklab, var(--primary) 68%, transparent) 100%)",
        }}
      />
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-accent)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-24 lg:px-8 lg:pb-14 lg:pt-32">
        <Reveal className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-8 bg-accent" />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-[2.1rem] font-bold leading-[1.08] text-primary-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.975rem] leading-relaxed sm:mt-6 sm:text-base text-primary-foreground/70">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
