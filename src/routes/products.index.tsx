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
      { title: "Atta & Masala Pulverizer Models 3–20 HP | Vimash Manufacturing" },
      {
        name: "description",
        content:
          "Browse Vimash double chamber atta pulverizers and cyclone masala pulverizers in 3, 5, 7.5, 10, 15 and 20 HP with full capacity, motor and dimension specifications.",
      },
      { property: "og:title", content: "Pulverizer Product Range — Vimash Manufacturing" },
      {
        property: "og:description",
        content: "Twelve models across two lines: double chamber atta pulverizers and masala pulverizers with cyclone, 3 HP to 20 HP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Products,
});

type Filter = "all" | Category;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All machines" },
  { id: "atta", label: "Commercial Atta Pulverizers" },
  { id: "masala", label: "Commercial Masala Pulverizers" },
];

function Products() {
  const [filter, setFilter] = useState<Filter>("all");

  const sections = (
    [
      { id: "atta" as const, title: "Commercial Atta Pulverizers", copy: "Double chamber flour mill pulverizers with twin cyclone discharge, automatic operation and powder coated SS / MS bodies." },
      { id: "masala" as const, title: "Commercial Masala Pulverizers", copy: "Cyclone masala pulverizers running 3840 RPM beaters that keep spice aroma and volatile oils in the powder." },
    ]
  ).filter((s) => filter === "all" || filter === s.id);

  return (
    <>
      <PageHero
        eyebrow="Product range"
        title="Twelve models. Two grinding lines."
        description="Double chamber atta pulverizers and cyclone masala pulverizers, each available in 3, 5, 7.5, 10, 15 and 20 HP. Every model has its own specification page."
      />



      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
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

      <section className="section-tint blueprint section-seam border-t border-border">
        <div className="relative mx-auto max-w-7xl px-5 py-9 lg:px-8">
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

      <QuoteBand source="Products page" />
    </>
  );
}
