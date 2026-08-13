import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import contactBg from "@/assets/bg-dark-grains.jpg";
import { CallbackForm } from "@/components/CallbackForm";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";
import { breadcrumbJsonLd, pageMeta, CORE_KEYWORDS, VIMASH_BRAND_KEYWORDS, mergeKeywords } from "@/lib/seo";

/**
 * Only a product slug travels in the URL. The machine name/HP are looked up from
 * local product data, so nothing a visitor types in the URL is trusted or stored.
 */
function validateSearch(search: Record<string, unknown>): { machine?: string; from?: string } {
  const raw = typeof search['machine'] === "string" ? search['machine'] : undefined;
  const machine = raw && getProduct(raw) ? raw : undefined;
  const rawFrom = typeof search['from'] === "string" ? search['from'] : undefined;
  const from = rawFrom && /^[A-Za-z ]{1,40}$/.test(rawFrom) ? rawFrom : undefined;
  return { ...(machine ? { machine } : {}), ...(from ? { from } : {}) };
}

export const Route = createFileRoute("/contact")({
  validateSearch,

  head: () => ({
    ...pageMeta({
      title: "Contact Vimash — Atta Chakki & Masala Pulverizer Enquiry",
      description:
        "Talk to Vimash Manufacturing about commercial atta chakki machines and masala pulverizers. Share your material and target output for a sized recommendation and quotation.",
      path: "/contact",
      keywords: mergeKeywords([
        "atta chakki machine price enquiry",
        "commercial atta chakki",
        "masala pulverizer enquiry",
        "flour mill machine",
      ], CORE_KEYWORDS),
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ),
      },
    ],
  }),
  component: Contact,
});


const details = [
  { icon: Phone, label: "Sales", value: site.phone, href: site.phoneHref },
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with an engineer", href: site.whatsappHref },
  { icon: Clock, label: "Working hours", value: site.hours },
];

function Contact() {
  const { machine, from } = Route.useSearch();
  const product = machine ? getProduct(machine) : undefined;

  return (
    <>
      <PageHero
        image={contactBg}
        eyebrow="Contact"
        title="Tell us what you need to grind"
        description="Leave your mobile number and our application engineer calls you back — we'll size the machine and share a quotation on the call."
      />

      <section className="mx-auto max-w-7xl px-5 py-9 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="glass-card rounded-3xl p-8 shadow-[var(--shadow-elevated)] lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <Send className="h-3.5 w-3.5" />
                Request a callback
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-charcoal lg:text-4xl">
                One field. That's it.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                No forms, no formalities. Drop your mobile number and our application engineer will
                call you to understand your material, mesh and tonnage, then send a sized quotation.
              </p>

              <CallbackForm
                className="mt-8"
                source={from ?? "Contact page"}
                {...(product
                  ? {
                      machineName: product.name,
                      machineSlug: product.slug,
                      machineHp: `${product.hp} HP`,
                    }
                  : {})}
              />


              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" />
                  Call now
                </a>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-accent hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp us
                </a>
              </div>
            </div>
          </Reveal>


          <div className="space-y-5">
            {details.map((d, i) => (
              <Reveal key={d.label} delay={i * 90}>
                <div className="hover-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="mt-1 block truncate font-display text-base font-bold text-charcoal transition-colors hover:text-accent"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 font-display text-base font-bold text-charcoal">{d.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={360}>
              <div className="relative overflow-hidden rounded-2xl border border-border bg-primary-deep p-7 text-primary-foreground">
                <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.09]" />
                <div className="relative">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold">Visit the plant</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">{site.address}</p>
                  <p className="mt-4 text-xs text-primary-foreground/50">
                    Walk-ins welcome during working hours. Call ahead and we'll run a live trial for you.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
