import featuredImg from "@/assets/home-featured-machine.jpg";
import { Reveal } from "@/components/Reveal";

/**
 * PLACEHOLDER IMAGE SECTION — large featured machine crop.
 * To use a real Vimash photo: drop it in src/assets and change the import above.
 */
export function FeaturedMachineImage() {
  return (
    <Reveal>
      <section className="relative isolate overflow-hidden">
        <img
          src={featuredImg}
          alt="Close-up of a Vimash pulverizer grinding assembly"
          loading="lazy"
          width={1920}
          height={1000}
          className="h-72 w-full object-cover sm:h-96 lg:h-[32rem]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--primary) 55%, transparent) 0%, color-mix(in oklab, var(--primary) 75%, transparent) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-8 lg:px-8 lg:pb-14">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Engineering detail
            </span>
            <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold leading-tight text-primary-foreground sm:text-4xl">
              Precision where it matters most
            </h2>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
