import grainsImg from "@/assets/home-grains-spices.jpg";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/**
 * PLACEHOLDER IMAGE SECTION — grains, flour and spices.
 * To use a real Vimash photo: drop it in src/assets and change the import above.
 */
export function GrainsSpicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
      <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="What you can grind"
            title="Fine flour and fine masala from the same trusted build"
            description="Wheat, grains, turmeric, chilli, coriander and more — ground evenly with low heat so colour, aroma and quality stay intact."
          />
        </div>
        <Reveal delay={120}>
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src={grainsImg}
              alt="Wheat grains, flour and ground spices"
              loading="lazy"
              width={1600}
              height={1000}
              className="h-64 w-full object-cover sm:h-80 lg:h-[24rem]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
