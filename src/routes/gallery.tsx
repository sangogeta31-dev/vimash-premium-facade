import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import heroImg from "@/assets/atta-chakki-pulverizer-1.png";
import attaImg from "@/assets/atta-chakki-pulverizer-2.png";
import masalaImg from "@/assets/atta-chakki-pulverizer-3.png";
import factoryImg from "@/assets/factory-floor.png";
import rotorImg from "@/assets/atta-masala-front.png";
import qcImg from "@/assets/atta-masala-side.png";
import { PageHero } from "@/components/PageHero";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import {
  breadcrumbJsonLd,
  pageMeta,
  CORE_KEYWORDS,
  VIMASH_BRAND_KEYWORDS,
  mergeKeywords,
} from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    ...pageMeta({
      title: "Gallery — Atta Chakki & Masala Pulverizer Machines | Vimash",
      description:
        "Photographs of Vimash commercial atta chakki pulverizers and masala grinding machines, the Ahmedabad manufacturing floor, rotor components and quality inspection.",
      path: "/gallery",
      keywords: mergeKeywords(
        ["atta chakki machine photos", "masala pulverizer machine", "flour mill machine"],
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
            { name: "Gallery", path: "/gallery" },
          ]),
        ),
      },
    ],
  }),
  component: Gallery,
});

const items: { src: string; alt: string; span: string; w: number; h: number }[] = [
  {
    src: heroImg,
    alt: "Commercial pulverizer machine on the shop floor",
    span: "lg:col-span-2 lg:row-span-2",
    w: 1600,
    h: 1104,
  },
  { src: attaImg, alt: "Atta pulverizer unit", span: "", w: 1024, h: 768 },
  { src: masalaImg, alt: "Masala pulverizer unit", span: "", w: 1024, h: 768 },
  {
    src: factoryImg,
    alt: "Manufacturing floor with machines under assembly",
    span: "lg:col-span-2",
    w: 1400,
    h: 900,
  },
  {
    src: rotorImg,
    alt: "Precision rotor and bearing detail",
    span: "",
    w: 1200,
    h: 900,
  },
  {
    src: qcImg,
    alt: "Engineer performing quality inspection",
    span: "",
    w: 1200,
    h: 900,
  },
];

function Gallery() {
  const [lightbox, setLightbox] = useState<null | (typeof items)[number]>(null);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Steel, light and tolerances"
        description="A closer look at the machines we ship, the floor they are built on and the components that decide how long they last."
      />

      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <div className="grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.alt} delay={i * 70} className={cn("h-full", item.span)}>
              <button
                type="button"
                onClick={() => setLightbox(item)}
                className="group relative h-full w-full overflow-hidden rounded-2xl border border-border bg-secondary text-left"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  width={item.w}
                  height={item.h}
                  className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-primary-deep/0 transition-colors duration-500 group-hover:bg-primary-deep/55" />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-between gap-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="text-sm font-semibold text-primary-foreground">{item.alt}</span>
                  <Maximize2 className="h-4 w-4 shrink-0 text-accent" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <QuoteBand source="Gallery page" />

      {lightbox ? (
        <div
          role="presentation"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-deep/90 p-5 backdrop-blur-md animate-fade-in"
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] w-auto max-w-5xl rounded-2xl object-contain shadow-[var(--shadow-elevated)]"
          />
        </div>
      ) : null}
    </>
  );
}
