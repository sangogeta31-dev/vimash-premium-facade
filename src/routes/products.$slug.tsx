import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, CheckCircle2, PhoneCall } from "lucide-react";
import attaImg from "@/assets/atta-pulverizer.jpg";
import masalaImg from "@/assets/masala-pulverizer.jpg";
import { CallbackForm } from "@/components/CallbackForm";
import { QuoteBand } from "@/components/QuoteBand";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getProduct, products, specTable, type Product } from "@/data/products";
import { site } from "@/data/site";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Machine not found | Vimash Manufacturing" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.product;
    const title = `${p.name} — Specifications & Price | Vimash`;
    const description = `${p.name}: ${p.capacity} grinding capacity, ${p.mainMotor} main motor, ${p.chamber.toLowerCase()}, powder coated SS/MS body. Request a callback for pricing.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: MachineNotFound,
  component: ProductDetail,
});

function MachineNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-40 text-center">
      <h1 className="font-display text-3xl font-bold text-charcoal">Machine not found</h1>
      <p className="mt-3 text-muted-foreground">This model is not in our catalogue.</p>
      <Link to="/products" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
        Back to all machines
      </Link>
    </div>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: Product };
  const isAtta = product.category === "atta";
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div
          className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-accent)" }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-32 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24 lg:pt-40">
          <Reveal>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All machines
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {isAtta ? "Commercial Atta Pulverizer" : "Commercial Masala Pulverizer"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-charcoal sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Model {product.model}
            </p>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">{product.description}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { l: "Capacity", v: product.capacity },
                { l: "Main motor", v: product.mainMotor },
                { l: "Power use", v: product.powerConsumption },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-border bg-card p-4">
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{x.l}</dt>
                  <dd className="mt-1.5 font-display text-base font-bold text-charcoal">{x.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquiry"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Get Quote
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-charcoal transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <PhoneCall className="h-4 w-4" />
                Call {site.phone}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative rounded-[2rem] border border-border bg-card p-10">
              <img
                src={isAtta ? attaImg : masalaImg}
                alt={`${product.name} — Vimash Manufacturing`}
                width={1408}
                height={1056}
                className="mx-auto w-full object-contain drop-shadow-[0_40px_60px_oklch(0.22_0.062_258/0.18)]"
              />
              <span className="absolute left-8 top-8 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
                {product.hp} HP
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <SectionHeading eyebrow="Technical data" title="Full specifications" />
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {specTable(product).map((row, i) => (
                    <tr key={row.label} className={i % 2 ? "bg-secondary/50" : "bg-card"}>
                      <th scope="row" className="w-1/2 px-5 py-3.5 text-left font-medium text-muted-foreground">
                        {row.label}
                      </th>
                      <td className="px-5 py-3.5 font-semibold text-charcoal">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <div className="space-y-12">
            <Reveal delay={80}>
              <SectionHeading eyebrow="Features" title="Built-in advantages" />
              <ul className="mt-6 space-y-3">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={140}>
              <SectionHeading eyebrow="Applications" title="Where it is used" />
              <div className="mt-6 flex flex-wrap gap-2">
                {product.applications.map((a) => (
                  <span key={a} className="rounded-full bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground">
                    {a}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div id="enquiry" className="scroll-mt-28 rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-elevated)]">
                <h3 className="font-display text-xl font-bold text-charcoal">
                  Get a quote for the {product.hp} HP model
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share your mobile number — we call back with pricing and delivery time.
                </p>
                <CallbackForm
                  className="mt-5"
                  machineName={product.name}
                  machineSlug={product.slug}
                  source="Product page"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border" style={{ background: "var(--gradient-steel)" }}>
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
            <SectionHeading eyebrow="Other capacities" title={`More ${isAtta ? "atta" : "masala"} pulverizers`} />
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80} className="h-full">
                  <Link
                    to="/products/$slug"
                    params={{ slug: p.slug }}
                    className="hover-lift flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-7"
                  >
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{p.hp} HP</span>
                      <h3 className="mt-2 font-display text-base font-bold text-charcoal">{p.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{p.capacity}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-charcoal">
                      View details <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteBand machineName={product.name} machineSlug={product.slug} source="Product page" />
    </>
  );
}
