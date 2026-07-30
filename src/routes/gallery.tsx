import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Maximize2 } from "lucide-react";
import heroImg from "@/assets/hero-machine.jpg";
import attaImg from "@/assets/atta-pulverizer.jpg";
import masalaImg from "@/assets/masala-pulverizer.jpg";
import factoryImg from "@/assets/factory-floor.jpg";
import rotorImg from "@/assets/rotor-detail.jpg";
import qcImg from "@/assets/quality-check.jpg";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Machines, Plant & Components | Vimash Manufacturing" },
      {
        name: "description",
        content:
          "Photographs of Vimash pulverizer machines, the Ahmedabad manufacturing floor, rotor components and quality inspection.",
      },
      { property: "og:title", content: "Vimash Manufacturing Gallery" },
      {
        property: "og:description",
        content: "A look at our machines, plant and precision components.",
      },
    ],
  }),
  component: Gallery,
});

type Tag = "machines" | "plant" | "components";

const items: { src: string; alt: string; tag: Tag; span: string; w: number; h: number }[] = [
  { src: heroImg, alt: "Commercial pulverizer machine on the shop floor", tag: "machines", span: "lg:col-span-2 lg:row-span-2", w: 1600, h: 1104 },
  { src: attaImg, alt: "Atta pulverizer unit", tag: "machines", span: "", w: 1024, h: 768 },
  { src: masalaImg, alt: "Masala pulverizer unit", tag: "machines", span: "", w: 1024, h: 768 },
  { src: factoryImg, alt: "Manufacturing floor with machines under assembly", tag: "plant", span: "lg:col-span-2", w: 1400, h: 900 },
  { src: rotorImg, alt: "Precision rotor and bearing detail", tag: "components", span: "", w: 1200, h: 900 },
  { src: qcImg, alt: "Engineer performing quality inspection", tag: "plant", span: "", w: 1200, h: 900 },
];

const tabs: { id: "all" | Tag; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "machines", label: "Machines" },
  { id: "plant", label: "Plant" },
  { id: "components", label: "Components" },
];

function Gallery() {
  const [active, setActive] = useState<"all" | Tag>("all");
  const [lightbox, setLightbox] = useState<null | (typeof items)[number]>(null);
  const visible = items.filter((i) => active === "all" || i.tag === active);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Steel, light and tolerances"
        description="A closer look at the machines we ship, the floor they are built on and the components that decide how long they last."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <Reveal>
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-secondary p-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300",
                  active === t.id
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-elevated)]"
                    : "text-muted-foreground hover:text-charcoal",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((item, i) => (
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
