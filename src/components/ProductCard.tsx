import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Gauge, Ruler, Zap } from "lucide-react";
import attaImg from "@/assets/atta-pulverizer.jpg";
import masalaImg from "@/assets/masala-pulverizer.jpg";
import type { Product } from "@/data/products";
import { Reveal } from "./Reveal";

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const isAtta = product.category === "atta";

  return (
    <Reveal delay={delay} className="h-full">
      <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative overflow-hidden bg-secondary">
          <img
            src={isAtta ? attaImg : masalaImg}
            alt={`${product.hp} HP ${isAtta ? "atta" : "masala"} pulverizer`}
            loading="lazy"
            width={1024}
            height={768}
            className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground">
            {product.hp} HP
          </span>
          <span className="absolute right-4 top-4 rounded-full glass-card px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal">
            {isAtta ? "Atta" : "Masala"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold text-charcoal">
            {isAtta ? "Atta" : "Masala"} Pulverizer {product.hp} HP
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Model {product.model}
          </p>

          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <SpecRow icon={<Gauge className="h-4 w-4" />} label="Output" value={product.output} />
            <SpecRow icon={<Zap className="h-4 w-4" />} label="Rotor RPM" value={product.rpm} />
            <SpecRow icon={<Ruler className="h-4 w-4" />} label="Chamber" value={product.screen} />
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {product.features.map((f) => (
              <span
                key={f}
                className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-medium text-secondary-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          <Link
            to="/contact"
            className="mt-6 inline-flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
          >
            Enquire about this model
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex min-w-0 items-center gap-2 text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="shrink-0 font-semibold text-charcoal">{value}</dd>
    </div>
  );
}
