import bannerImg from "@/assets/home-banner-industrial.jpg";
import { Reveal } from "@/components/Reveal";

/**
 * PLACEHOLDER IMAGE SECTION — wide industrial / manufacturing banner.
 * To use a real Vimash photo: drop it in src/assets and change the import above.
 */
export function IndustrialBanner() {
  return (
    <Reveal>
      <section className="relative isolate overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border">
            <img
              src={bannerImg}
              alt="Vimash manufacturing facility"
              loading="lazy"
              width={1920}
              height={900}
              className="h-56 w-full object-cover sm:h-80 lg:h-[26rem]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--primary) 82%, transparent) 0%, color-mix(in oklab, var(--primary) 40%, transparent) 60%, transparent 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-md p-6 sm:p-10 lg:p-14">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Our facility
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-primary-foreground sm:text-4xl">
                  Machines built in-house, start to finish
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
                  Fabrication, assembly, and full-load testing under one roof in
                  Ahmedabad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
