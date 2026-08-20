import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Gauge, Ruler, Zap } from "lucide-react";
import attaImg from "@/assets/atta-masala-front.png";
import masalaImg from "@/assets/atta-masala-front.png";
import type { Product } from "@/data/products";
import { productImageAlt } from "@/lib/seo";
import { Reveal } from "./Reveal";

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const isAtta = product.category === "atta";

  return (
    <Reveal delay={delay} className="h-full">
      <article className="hover-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card">
        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="relative block overflow-hidden bg-background px-5 pb-5 pt-8 sm:px-8 sm:pt-10"
        >
          <img
            src={isAtta ? attaImg : masalaImg}
            alt={productImageAlt(product)}
            loading="lazy"
            width={1408}
            height={1056}
            className="mx-auto h-64 w-full object-contain sm:h-56 drop-shadow-[0_28px_40px_oklch(0.22_0.062_258/0.16)] transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-6 top-6 rounded-full bg-primary px-3 py-1 text-xs font-bold tracking-wide text-primary-foreground">
            {product.hp} HP
          </span>
          <span className="absolute right-6 top-6 rounded-full border border-border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {isAtta ? "Atta" : "Masala"}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-bold text-charcoal">
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Model {product.model}
          </p>
          <p className="mt-2 font-display text-lg font-bold text-accent">{product.price}</p>

          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <SpecRow
              icon={<Gauge className="h-4 w-4" />}
              label="Capacity"
              value={product.capacity}
            />
            <SpecRow
              icon={<Zap className="h-4 w-4" />}
              label="Main motor"
              value={product.mainMotor}
            />
            <SpecRow
              icon={<Ruler className="h-4 w-4" />}
              label="Chamber"
              value={product.chamber.replace("Double Chamber", "Double")}
            />
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {[product.automation, product.voltage, product.powerConsumption].map((f) => (
              <span
                key={f}
                className="rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-medium text-secondary-foreground"
              >
                {f}
              </span>
            ))}
          </div>

          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="mt-auto inline-flex min-h-[3.25rem] items-center justify-between rounded-xl border border-border px-4 py-3 text-base sm:text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground"
          >
            View details & get quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex min-w-0 items-center gap-2 text-muted-foreground">
        <span className="text-accent">{icon}</span>
        {label}
      </dt>
      <dd className="shrink-0 text-right font-semibold text-charcoal">{value}</dd>
    </div>
  );
}
