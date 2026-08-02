import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { products, type Category } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Atta & Masala Pulverizer Models 5–30 HP | Vimash Manufacturing" },
      {
        name: "description",
        content:
          "Browse Vimash atta and masala pulverizers in 5, 7.5, 10, 15, 20 and 30 HP with output, RPM and chamber specifications.",
      },
      { property: "og:title", content: "Pulverizer Product Range — Vimash Manufacturing" },
      {
        property: "og:description",
        content: "Twelve models across two lines: atta and masala pulverizers from 5 HP to 30 HP.",
      },
    ],
  }),
  component: Products,
});

type Filter = "all" | Category;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All machines" },
  { id: "atta", label: "Atta Pulverizers" },
  { id: "masala", label: "Masala Pulverizers" },
];

function Products() {
  const [filter, setFilter] = useState<Filter>("all");

  const sections = (
    [
      { id: "atta" as const, title: "Atta Pulverizers", copy: "Cool-grinding flour systems with dust-controlled hoppers and hardened hammers." },
      { id: "masala" as const, title: "Masala Pulverizers", copy: "Stainless contact zones and fine-mesh screens that keep volatile oils in the powder." },
    ]
  ).filter((s) => filter === "all" || filter === s.id);

  return (
    <>
      <PageHero
        eyebrow="Product range"
        title="Twelve models. Two grinding philosophies."
        description="Every frame is available from 5 HP up to 30 HP. Pick by material first, then by the output your line needs."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-secondary p-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "text-muted-foreground hover:text-charcoal",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        {sections.map((section) => (
          <div key={section.id} className="mt-16 first:mt-12">
            <SectionHeading eyebrow={`${section.id === "atta" ? "Grain" : "Spice"} line`} title={section.title} description={section.copy} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((p) => p.category === section.id)
                .map((p, i) => (
                  <ProductCard key={p.slug} product={p} delay={i * 70} />
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-border" style={{ background: "var(--gradient-steel)" }}>
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <SectionHeading
            eyebrow="Also supplied"
            title="Everything around the machine"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Cyclone & blower sets", d: "Matched air handling for dust-free discharge." },
              { t: "Screens & sieves", d: "Mesh sizes from 20 to 200 for every product grade." },
              { t: "Hammers & rotors", d: "Hardened replacements machined to original spec." },
              { t: "Control panels", d: "Star-delta and VFD panels with overload protection." },
            ].map((item, i) => (
              <Reveal key={item.t} delay={i * 80} className="h-full">
                <div className="hover-lift h-full rounded-2xl border border-border bg-card p-7">
                  <h3 className="font-display text-base font-bold text-charcoal">{item.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <QuoteBand />
    </>
  );
}
