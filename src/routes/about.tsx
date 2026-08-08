import { createFileRoute } from "@tanstack/react-router";
import {
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  Headphones,
  BadgeCheck,
  Cog,
  Package,
} from "lucide-react";
import factoryImg from "@/assets/factory-floor.jpg";
import bandImg from "@/assets/industrial-band.jpg";

import rotorImg from "@/assets/rotor-detail.jpg";
import qualityImg from "@/assets/quality-check.jpg";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vimash Manufacturing — Atta & Masala Pulverizer Maker" },
      {
        name: "description",
        content:
          "Vimash Manufacturing Pvt. Ltd. makes commercial atta and masala pulverizers in Ahmedabad. Own factory, tested machines, PAN India delivery and support.",
      },
      { property: "og:title", content: "About Vimash Manufacturing" },
      {
        property: "og:description",
        content: "We make commercial atta and masala pulverizers in our own factory in Ahmedabad, India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const whatWeMake = [
  { icon: Cog, title: "Atta Chakki Pulverizer", body: "For flour and grain grinding." },
  { icon: Package, title: "Masala Chakki Pulverizers", body: "For spice grinding with cyclone." },
  { icon: Wrench, title: "Spare Parts", body: "Screens, hammers and rotors." },
];

const facility = [
  { icon: Factory, title: "Own Factory", body: "All machines are made in our own unit." },
  { icon: Wrench, title: "In-House Work", body: "Cutting, welding, machining and assembly." },
  { icon: ShieldCheck, title: "Tested Machines", body: "Every machine is run before dispatch." },
];

const trust = [
  { icon: BadgeCheck, title: "Direct Manufacturer", body: "You buy directly from us. No middleman." },
  { icon: ShieldCheck, title: "Good Quality Parts", body: "Strong body and food-grade contact parts." },
  { icon: Truck, title: "PAN India Delivery", body: "We deliver machines all over India." },
  { icon: Headphones, title: "After-Sales Support", body: "Help with installation and spare parts." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We make Atta Chakki machines"
        description="Vimash Manufacturing Pvt. Ltd. is based in Ahmedabad, India. We make commercial atta and masala Chakki for daily production."
      />

      {/* What we make */}
      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <SectionHeading eyebrow="What we make" title="Machines for flour and spices" align="center" />
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6">
          {whatWeMake.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="h-full">
              <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent/12 text-accent">
                  <item.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Facility */}
      <section className="section-tint blueprint section-seam border-y border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-border bg-card">
                <img
                  src={factoryImg}
                  alt="Vimash Manufacturing factory in Ahmedabad"
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="Our factory"
                title="Made in our own unit"
                description="We build each machine step by step in our factory — body, rotor, fitting and testing."
              />
              <div className="mt-6 space-y-3">
                {facility.map((f, i) => (
                  <Reveal key={f.title} delay={i * 90}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
                        <f.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-charcoal">{f.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality */}
      <section className="mx-auto max-w-6xl px-5 py-9 lg:px-8 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal className="order-2 lg:order-1">
            <SectionHeading
              eyebrow="Quality"
              title="Checked before delivery"
              description="Every machine is checked and run on full load before it leaves our factory, so it works well from day one."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Balanced rotor for less vibration",
                "Strong body for long life",
                "Food-grade contact parts",
                "Full-load trial before dispatch",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm text-charcoal">
                  <BadgeCheck className="h-5 w-5 shrink-0 text-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="order-1 lg:order-2">
            <img
              src={qualityImg}
              alt="Quality check on a Vimash pulverizer machine"
              loading="lazy"
              width={1408}
              height={1056}
              className="mx-auto w-full max-w-lg object-contain drop-shadow-[0_44px_54px_oklch(0.22_0.062_258/0.2)]"
            />
          </Reveal>
        </div>
      </section>

      {/* Why customers trust us */}
      <section className="section-tint blueprint section-seam border-y border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
          <SectionHeading eyebrow="Why choose us" title="Why customers trust Vimash" align="center" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-6">
            {trust.map((t, i) => (
              <Reveal key={t.title} delay={i * 80} className="h-full">
                <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/12 text-accent">
                    <t.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-charcoal">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wide facility band */}
      <section className="relative isolate overflow-hidden">
        <img
          src={bandImg}
          alt="Vimash manufacturing facility in Ahmedabad"
          loading="lazy"
          width={1920}
          height={1088}
          className="h-[260px] w-full object-cover sm:h-[380px] lg:h-[440px]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--primary) 88%, transparent) 0%, color-mix(in oklab, var(--primary) 55%, transparent) 55%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 lg:px-8">
            <Reveal className="max-w-md">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                Inside our unit
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-primary-foreground sm:text-4xl">
                Built, fitted and tested under one roof
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Rotor visual */}

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-9 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:py-20">
          <Reveal>
            <img
              src={rotorImg}
              alt="Pulverizer rotor and grinding chamber detail"
              loading="lazy"
              width={1408}
              height={1056}
              className="mx-auto w-full max-w-lg object-contain drop-shadow-[0_44px_54px_oklch(0.22_0.062_258/0.2)]"
            />
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-2xl font-bold text-charcoal sm:text-4xl">
              Strong rotor. Smooth grinding.
            </h2>
            <p className="mt-4 text-muted-foreground">
              The rotor is the heart of the machine. We make and balance it in our own factory for
              steady output and long machine life.
            </p>
          </Reveal>
        </div>
      </section>

      <QuoteBand source="About page" />
    </>
  );
}
