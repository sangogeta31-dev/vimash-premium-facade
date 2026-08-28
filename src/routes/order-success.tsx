import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Phone, Home } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { pageMeta } from "@/lib/seo";
import { site } from "@/data/site";

type OrderSuccessSearch = {
  order_id?: string;
  payment_id?: string;
};

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>): OrderSuccessSearch => ({
    order_id:
      typeof search["order_id"] === "string" ? search["order_id"] : undefined,
    payment_id:
      typeof search["payment_id"] === "string"
        ? search["payment_id"]
        : undefined,
  }),
  head: () => ({
    ...pageMeta({
      title: "Order Confirmed | Vimash Manufacturing",
      description: "Your payment was successful. Thank you for your order!",
      path: "/order-success",
    }),
    meta: [{ name: "robots", content: "noindex" }],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { order_id, payment_id } = useSearch({ from: "/order-success" });

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 py-20 text-center">
      <Reveal>
        {/* Success icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Order Confirmed!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thank you for your purchase. Your payment has been processed
          successfully. Our team will contact you shortly to confirm delivery
          details.
        </p>
      </Reveal>

      {/* Order details */}
      {(order_id || payment_id) && (
        <Reveal delay={80}>
          <div className="mt-8 w-full rounded-2xl border border-border bg-card p-5 text-left">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Details
            </h3>
            <div className="mt-3 space-y-2">
              {order_id && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono text-xs font-semibold text-charcoal">
                    {order_id}
                  </span>
                </div>
              )}
              {payment_id && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment ID</span>
                  <span className="font-mono text-xs font-semibold text-charcoal">
                    {payment_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      )}

      {/* What happens next */}
      <Reveal delay={120}>
        <div className="mt-6 w-full rounded-2xl border border-border bg-secondary/30 p-5 text-left">
          <h3 className="text-sm font-bold text-charcoal">What happens next?</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">1.</span>
              <span>You'll receive a payment confirmation on your phone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">2.</span>
              <span>Our team will call you to confirm your order and delivery schedule</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">3.</span>
              <span>Your machine will be dispatched within the agreed timeline</span>
            </li>
          </ul>
        </div>
      </Reveal>

      {/* Actions */}
      <Reveal delay={160}>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:border-accent hover:text-accent"
          >
            <Phone className="h-4 w-4" />
            Call Us
          </a>
        </div>
      </Reveal>

      {/* Contact note */}
      <Reveal delay={200}>
        <p className="mt-6 text-xs text-muted-foreground">
          Questions? Call us at{" "}
          <a href={site.phoneHref} className="font-semibold text-accent hover:underline">
            {site.phone}
          </a>{" "}
          or WhatsApp us anytime.
        </p>
      </Reveal>
    </section>
  );
}
