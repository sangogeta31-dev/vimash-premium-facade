import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Vimash Manufacturing — Request a Pulverizer Quotation" },
      {
        name: "description",
        content:
          "Talk to Vimash Manufacturing about atta and masala pulverizers. Share your material and target output for a sized recommendation and quotation.",
      },
      { property: "og:title", content: "Contact Vimash Manufacturing" },
      {
        property: "og:description",
        content: "Request a quotation, book a factory visit or reach our service team.",
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
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you need to grind"
        description="Share your material, mesh requirement and daily tonnage. We'll recommend the HP rating and send a detailed quotation within one working day."
      />

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="glass-card rounded-3xl p-8 shadow-[var(--shadow-elevated)] lg:p-10"
            >
              <h2 className="font-display text-2xl font-bold text-charcoal">Enquiry form</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fields marked with an asterisk help us size the machine accurately.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Full name *" placeholder="Ramesh Patel" />
                <Field label="Company" placeholder="Shree Flour Mills" />
                <Field label="Phone *" placeholder="+91 98250 00000" type="tel" />
                <Field label="Email" placeholder="you@company.com" type="email" />
                <Field label="Material to grind *" placeholder="Wheat / Turmeric / Chilli" />
                <Field label="Required output *" placeholder="e.g. 150 kg per hour" />
              </div>

              <label className="mt-5 block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Additional details
                </span>
                <textarea
                  rows={4}
                  placeholder="Mesh size, shift hours, existing setup, delivery location…"
                  className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent"
                />
              </label>

              <button
                type="submit"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-1 sm:w-auto"
              >
                Send enquiry
                <Send className="h-4 w-4" />
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                This is a design preview — the form is not connected yet.
              </p>
            </form>
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

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent"
      />
    </label>
  );
}
