import { createFileRoute } from "@tanstack/react-router";
import { Compass, HeartHandshake, Target } from "lucide-react";
import factoryImg from "@/assets/factory-floor.jpg";
import rotorImg from "@/assets/rotor-detail.jpg";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vimash Manufacturing — Two Decades of Pulverizer Engineering" },
      {
        name: "description",
        content:
          "Founded in 2003 in Ahmedabad, Vimash Manufacturing designs and builds atta and masala pulverizers with in-house fabrication, machining and testing.",
      },
      { property: "og:title", content: "About Vimash Manufacturing" },
      {
        property: "og:description",
        content: "Two decades of pulverizer engineering, built entirely in-house in Ahmedabad, India.",
      },
    ],
  }),
  component: About,
});

const milestones = [
  { year: "2003", title: "Workshop begins", body: "A four-man fabrication unit builds its first 5 HP atta pulverizer." },
  { year: "2009", title: "Masala line launched", body: "Stainless contact zones and fine-mesh screens open the spice market." },
  { year: "2014", title: "New facility", body: "38,000 sq. ft. plant with in-house machining and rotor balancing." },
  { year: "2019", title: "30 HP frame", body: "Heavy-duty industrial frame crosses 400 kg/hr sustained output." },
  { year: "2026", title: "4,200+ installed", body: "Machines running across 19 states with a dedicated service network." },
];

const values = [
  { icon: Target, title: "Precision first", body: "Tolerances are checked, not assumed. Every rotor is balanced and logged." },
  { icon: HeartHandshake, title: "Honest sizing", body: "We recommend the HP you need — never the one with a bigger invoice." },
  { icon: Compass, title: "Long horizon", body: "Spares stay available for a decade after a model leaves the catalogue." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Machines built by people who run them"
        description="Vimash Manufacturing Pvt. Ltd. has been designing pulverizing systems in Ahmedabad since 2003 — every frame fabricated, machined and tested under one roof."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border">
              <img
                src={factoryImg}
                alt="Vimash Manufacturing factory floor"
                loading="lazy"
                width={1400}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="From a four-man workshop to 4,200 machines"
              description="We started by repairing other people's pulverizers. That taught us exactly where they fail — bearings starved of grease, rotors out of balance, screens impossible to change. Every Vimash machine is an answer to one of those failures."
            />
            <Reveal delay={120}>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                Today the same principle holds. We keep fabrication, machining, balancing and
                load-testing in-house so nothing critical is left to a vendor. Customers are welcome
                on the floor before they place an order — most of them come.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-border" style={{ background: "var(--gradient-steel)" }}>
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <SectionHeading eyebrow="Milestones" title="Two decades, one direction" align="center" />
          <ol className="mt-16 grid gap-6 md:grid-cols-5">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 90} className="h-full">
                <div className="hover-lift relative h-full rounded-2xl border border-border bg-card p-6">
                  <span className="font-display text-2xl font-bold text-accent">{m.year}</span>
                  <h3 className="mt-3 font-display text-base font-bold text-charcoal">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading eyebrow="What we hold to" title="Three commitments that do not flex" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 100} className="h-full">
              <div className="hover-lift h-full rounded-2xl border border-border bg-card p-8">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/12 text-accent">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-charcoal">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <img
          src={rotorImg}
          alt="Precision rotor assembly detail"
          loading="lazy"
          width={1200}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:px-8 lg:py-32">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              The rotor is the machine.
            </h2>
            <p className="mt-5 text-primary-foreground/75">
              Everything else is housing. We machine, harden and dynamically balance every rotor
              in-house, then log the readings against the serial number before dispatch.
            </p>
          </Reveal>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
