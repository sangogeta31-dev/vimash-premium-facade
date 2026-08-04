import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import factoryImg from "@/assets/factory-floor.jpg";
import qcImg from "@/assets/quality-check.jpg";
import { PageHero } from "@/components/PageHero";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({
    meta: [
      { title: "Manufacturing Process & Quality Control | Vimash Manufacturing" },
      {
        name: "description",
        content:
          "Inside the Vimash plant: design, fabrication, machining, rotor balancing, assembly, full-load QC trials and dispatch — all in-house.",
      },
      { property: "og:title", content: "How Vimash Pulverizers Are Built" },
      {
        property: "og:description",
        content: "Six controlled stages from capacity study to full-load trial, all under one roof.",
      },
    ],
  }),
  component: Manufacturing,
});

const steps = [
  { n: "01", title: "Design & capacity study", body: "Your material, mesh target and daily tonnage drive the drive rating, rotor profile and screen area. Nothing is picked off a chart." },
  { n: "02", title: "Fabrication", body: "CNC plasma-cut plate, jig-welded frames and stress-relieved housings keep alignment true under continuous vibration." },
  { n: "03", title: "Machining", body: "Shafts, hubs and bearing seats turned in-house to tight tolerance, then hardened for abrasive duty." },
  { n: "04", title: "Rotor balancing", body: "Every rotor is dynamically balanced and the residual reading is logged against the machine serial number." },
  { n: "05", title: "Assembly & wiring", body: "Motors, bearings, seals and panels fitted by a single team per machine, so accountability is never split." },
  { n: "06", title: "Full-load trial & dispatch", body: "Each unit runs a loaded trial with real product before crating, painting and pan-India dispatch." },
];

const infrastructure = [
  { t: "38,000 sq. ft.", d: "Covered manufacturing and assembly area" },
  { t: "5-ton EOT crane", d: "Heavy frame handling across all bays" },
  { t: "In-house balancing", d: "Dynamic rotor balancing rig" },
  { t: "Load-test bay", d: "Full-load trials with customer material" },
];

const qc = [
  "Plate thickness and grade verification at inward",
  "Weld penetration inspection on all structural joints",
  "Shaft runout checked before and after hardening",
  "Residual rotor imbalance logged per serial number",
  "Bearing temperature monitored through the trial run",
  "No-load and full-load current draw recorded",
  "Screen fitment and chamber sealing leak check",
  "Paint film thickness and finish sign-off",
];

function Manufacturing() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing"
        title="Six controlled stages, one roof"
        description="Nothing critical is outsourced. From plate to painted machine, every stage happens inside our Ahmedabad plant and is signed off before the next begins."
      />

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="lg:sticky lg:top-32 lg:h-fit">
            <SectionHeading
              eyebrow="The process"
              title="How a Vimash pulverizer takes shape"
              description="Each stage has its own checklist. A machine cannot move forward until the previous stage is closed."
            />
            <Reveal delay={140}>
              <div className="mt-8 overflow-hidden rounded-2xl border border-border">
                <img
                  src={factoryImg}
                  alt="Machines under assembly at the Vimash plant"
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>

          <ol className="space-y-4">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.n} delay={i * 70}>
                <div className="hover-lift group rounded-2xl border border-border bg-card p-7">
                  <div className="flex items-start gap-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                      {step.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-charcoal">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-tint blueprint section-seam border-y border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <SectionHeading eyebrow="Infrastructure" title="The plant behind the range" align="center" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {infrastructure.map((item, i) => (
              <Reveal key={item.t} delay={i * 80} className="h-full">
                <div className="hover-lift h-full rounded-2xl border border-border bg-card p-7 text-center">
                  <p className="font-display text-2xl font-bold text-primary">{item.t}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Quality control"
              title="The checklist that clears a dispatch"
              description="Eight sign-offs stand between a finished frame and a loaded truck."
            />
            <ul className="mt-8 grid gap-3">
              {qc.map((item, i) => (
                <Reveal as="li" key={item} delay={i * 55}>
                  <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="text-sm text-charcoal">{item}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-3xl border border-border">
              <img
                src={qcImg}
                alt="Quality inspection at the Vimash plant"
                loading="lazy"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <QuoteBand source="Manufacturing page" />
    </>
  );
}
