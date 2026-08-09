import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { getProduct } from "@/data/products";
import { site } from "@/data/site";

export function MobileActionBar() {
  // Carry the machine the visitor is looking at into the Contact enquiry form.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const slug = pathname.match(/^\/products\/([^/]+)\/?$/)?.[1];
  const product = slug ? getProduct(decodeURIComponent(slug)) : undefined;
  const search = product
    ? { machine: product.slug, from: "Product page" }
    : pathname.startsWith("/products")
      ? { from: "Products page" }
      : {};

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="glass-card border-t border-border px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5">
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-2">
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className="grid h-13 w-13 min-h-[3.25rem] min-w-[3.25rem] place-items-center rounded-2xl bg-whatsapp text-primary-foreground"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
          <a
            href={site.phoneHref}
            className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl border border-border bg-background text-base font-semibold text-charcoal"
          >
            <Phone className="h-5 w-5 text-primary" />
            Call
          </a>
          <Link
            to="/contact"
            className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-[var(--shadow-elevated)]"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
