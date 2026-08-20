import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { products, type Category } from "@/data/products";
import { cn } from "@/lib/utils";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  pageMeta,
  CORE_KEYWORDS,
  VIMASH_BRAND_KEYWORDS,
  mergeKeywords,
} from "@/lib/seo";

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): { filter?: Filter } => {
    return {
      filter: (search.filter as Filter | undefined) || undefined,
    };
  },
  head: () => ({
    ...pageMeta({
      title: "Atta Chakki & Masala Pulverizer Models 5–20 HP | Vimash",
      description:
        "Browse Vimash commercial atta chakki pulverizers (flour mill machines) and masala grinding machines in 5, 7.5, 10, 15 and 20 HP with full capacity, motor and dimension specifications.",
      path: "/products",
      keywords: mergeKeywords(
        [
          "atta chakki machine",
          "commercial atta chakki",
          "atta pulverizer",
          "flour mill machine",
          "masala pulverizer",
          "masala grinding machine",
          "spice grinding machine",
          "commercial masala pulverizer",
        ],
        CORE_KEYWORDS,
        VIMASH_BRAND_KEYWORDS,
      ),
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
        ),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.name,
            url: canonicalUrl(`/products/${p.slug}`),
          })),
        }),
      },
    ],
  }),
  component: Products,
});

type Filter = "all" | Category;

const filters: { id: Filter; label: string; short: string }[] = [
  { id: "all", label: "All machines", short: "All" },
  { id: "atta", label: "Atta Chakki Pulverizers", short: "Atta" },
  { id: "masala", label: "Masala Grinder Pulverizers", short: "Masala" },
];

function Products() {
  const { filter: urlFilter } = Route.useSearch();
  const [filter, setFilter] = useState<Filter>((urlFilter as Filter) || "all");

  const sections = [
    {
      id: "atta" as const,
      title: "Atta Chakki Pulverizers",
      copy: "Double chamber flour mill pulverizers with twin cyclone discharge, automatic operation and powder coated SS / MS bodies.",
    },
    {
      id: "masala" as const,
      title: "Masala Grinder Pulverizers",
      copy: "Strong machines for grinding different types of dry spices into fine powder. Available from 5 HP to 30 HP for commercial use.",
    },
  ].filter((s) => filter === "all" || filter === s.id);

  return (
    <>
      <PageHero
        eyebrow="Product range"
        title="Ten models. Two grinding lines."
        description="Double chamber atta pulverizers and cyclone masala pulverizers, each available in 5, 7.5, 10, 15 and 20 HP. Every model has its own specification page."
      />

      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <Reveal>
          <div className="flex w-full gap-1 rounded-full border border-border bg-secondary p-1.5 sm:inline-flex sm:w-auto">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex-1 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 sm:flex-none sm:px-5 sm:py-2.5",
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "text-muted-foreground hover:text-charcoal",
                )}
              >
                <span className="sm:hidden">{f.short}</span>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {sections.map((section) => (
          <div key={section.id} className="mt-16 first:mt-12">
            <SectionHeading
              eyebrow={section.id === "atta" ? "Grain line" : "SPICE LINE"}
              title={section.title}
              description={section.copy}
            />
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
