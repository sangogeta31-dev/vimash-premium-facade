import { CallbackForm } from "@/components/CallbackForm";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Cog,
  Factory,
  Headphones,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import heroImg from "@/assets/hero-machine.jpg";
import attaImg from "@/assets/atta-pulverizer.jpg";
import masalaImg from "@/assets/masala-pulverizer.jpg";
import factoryImg from "@/assets/factory-floor.jpg";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TrustCards } from "@/components/TrustCards";
import { site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vimash Manufacturing — Atta & Masala Pulverizer Machines" },
      {
        name: "description",
        content:
          "Commercial atta and masala pulverizer machines from 5 HP to 30 HP, engineered for continuous duty by Vimash Manufacturing Pvt. Ltd.",
      },
      { property: "og:title", content: "Vimash Manufacturing — Atta & Masala Pulverizers" },
      {
        property: "og:description",
        content:
          "Precision pulverizing systems for flour mills and spice processors. 5 HP to 30 HP, built for continuous commercial duty.",
      },
    ],
  }),
  component: Home,
});

const whyItems = [
  {
    icon: Cog,
    title: "Balanced rotor engineering",
    body: "Dynamically balanced rotors and hardened hammers keep vibration low and output consistent through long shifts.",
  },
  {
    icon: ShieldCheck,
    title: "Food-grade construction",
    body: "SS 304 contact surfaces, oil-tight seals and dust-controlled hoppers built for hygiene-critical processing.",
  },
  {
    icon: Wrench,
    title: "Serviceable by design",
    body: "Quick-open chambers, standard screens and off-the-shelf spares mean minutes of downtime, not days.",
  },
  {
    icon: Headphones,
    title: "Lifetime support",
    body: "Installation, operator training and on-call service engineers across 19 states of India.",
  },
];

const processSteps = [
  { n: "01", title: "Design & sizing", body: "Capacity study and drive selection matched to your product." },
  { n: "02", title: "Fabrication", body: "CNC-cut, jig-welded frames with stress-relieved housings." },
  { n: "03", title: "Assembly & QC", body: "Balanced rotor fitment and full-load trial before dispatch." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--accent) 14%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-8 pt-24 text-center lg:px-8 lg:pt-32">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Since 2003 · Ahmedabad, India
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-[2.35rem] font-bold leading-[1.05] text-charcoal sm:text-6xl lg:text-7xl">
              Pulverizing power,
              <br />
              <span className="text-gradient">engineered to last.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              Atta &amp; masala pulverizers, 5 HP to 30 HP. Built for all-day commercial output.
            </p>
            <div className="mt-7 grid gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:justify-center sm:gap-4">
              <Link
                to="/products"
                className="group inline-flex min-h-[3.5rem] items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-base sm:text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform duration-300 hover:-translate-y-1"
              >
                Explore the range
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[3.5rem] items-center justify-center gap-3 rounded-full border border-border px-7 py-4 text-base font-semibold text-charcoal sm:text-sm transition-colors duration-300 hover:bg-secondary"
              >
                Request a quotation
              </Link>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <img
              src={heroImg}
              alt="Vimash commercial pulverizer machine"
              width={1600}
              height={1200}
              className="mx-auto mt-8 w-[112%] max-w-none -translate-x-[6%] object-contain sm:mt-12 sm:w-full sm:max-w-5xl sm:translate-x-0 drop-shadow-[0_60px_70px_oklch(0.22_0.062_258/0.22)]"
            />
          </Reveal>
        </div>
      </section>


      {/* Stats */}
      <section className="relative z-10 mx-auto mt-6 max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-1 shadow-[var(--shadow-elevated)]">
            <StatStrip />
          </div>
        </Reveal>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Two specialised lines"
          title="Built separately for grain and for spice"
          description="Different materials demand different grinding physics. We engineer each line from the rotor outwards instead of rebadging one machine."
        />
        <div className="mt-9 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-2">
          {[
            {
              img: attaImg,
              tag: "Atta Pulverizers",
              title: "Cool-grinding flour systems",
              body: "Low-heat grinding preserves gluten and colour while delivering up to 400 kg/hr on the 30 HP frame.",
            },
            {
              img: masalaImg,
              tag: "Masala Pulverizers",
              title: "Aroma-retentive spice mills",
              body: "Full stainless contact zones and fine-mesh screens hold volatile oils in the powder, not in the air.",
            },
          ].map((cat, i) => (
            <Reveal key={cat.tag} delay={i * 120}>
              <article className="hover-lift group relative h-full overflow-hidden rounded-3xl border border-border bg-card">
                <div className="overflow-hidden px-5 pb-3 pt-8 sm:px-10 sm:pb-4 sm:pt-12">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    loading="lazy"
                    width={1408}
                    height={1056}
                    className="mx-auto h-80 w-full object-contain sm:h-72 drop-shadow-[0_36px_50px_oklch(0.22_0.062_258/0.18)] transition-transform duration-[900ms] group-hover:scale-[1.05]"
                  />
                </div>

                <div className="p-6 sm:p-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                    {cat.tag}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-charcoal">{cat.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.body}</p>
                  <Link
                    to="/products"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-accent"
                  >
                    View 5 – 30 HP models
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="section-tint blueprint section-seam border-y border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Why Vimash"
            title="Industrial reliability without the industrial headache"
            align="center"
          />
          <div className="mt-9 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {whyItems.map((item, i) => (
              <Reveal key={item.title} delay={i * 90} className="h-full">
                <div className="hover-lift h-full rounded-2xl border border-border bg-card p-6 sm:p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/8 text-primary">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-charcoal">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process teaser */}
      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <div className="grid items-center gap-9 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border">
              <img
                src={factoryImg}
                alt="Vimash manufacturing floor"
                loading="lazy"
                width={1400}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Inside the plant"
              title="Every machine passes a full-load trial before it ships"
              description="A 38,000 sq. ft. facility with in-house fabrication, machining, balancing and testing — so quality is never outsourced."
            />
            <ul className="mt-7 space-y-5 sm:mt-10 sm:space-y-6">
              {processSteps.map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 100}>
                  <div className="flex gap-5">
                    <span className="font-display text-xl font-bold text-accent">{step.n}</span>
                    <div>
                      <h3 className="font-display text-base font-bold text-charcoal">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={280}>
              <Link
                to="/manufacturing"
                className="mt-7 inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-base sm:mt-10 sm:w-auto sm:text-sm font-semibold text-charcoal transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                See the full process
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-navy blueprint-dark relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-5 py-9 text-center lg:px-8">
          <Reveal>
            <Factory className="mx-auto h-8 w-8 text-accent" />
            <blockquote className="mt-8 font-display text-2xl font-semibold leading-snug text-primary-foreground sm:text-3xl">
              “Three 20 HP masala lines running two shifts a day for four years. Screens and
              hammers get changed, nothing else has.”
            </blockquote>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Production Head · Spice processing unit, Rajkot
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tint blueprint section-seam border-t border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elevated)] sm:p-10 lg:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <h2 className="font-display text-[1.75rem] font-bold leading-tight text-charcoal sm:text-4xl">
                  Tell us your product and target output.
                </h2>
                <p className="mt-4 max-w-xl text-muted-foreground">
                  Send your material, mesh requirement and daily tonnage — we'll recommend the HP
                  rating and share a detailed quotation within one working day.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["Free capacity sizing", "Factory visit welcome", "Pan-India dispatch", "On-site commissioning"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-charcoal">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <CallbackForm source="Home page" />
                <a
                  href={site.phoneHref}
                  className="inline-flex min-h-[3.5rem] items-center justify-center gap-2 rounded-full border border-border px-7 py-4 text-base font-semibold text-charcoal transition-colors hover:bg-secondary sm:text-sm"
                >
                  Call {site.phone}
                </a>
              </div>

            </div>
          </div>
        </Reveal>
        </div>
      </section>
    </>
  );
}
