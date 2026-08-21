import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/site";
import { products } from "@/data/products";
import logoMark from "@/assets/vimash-mark.png";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        scrolled
          ? "glass-card shadow-[0_10px_40px_-24px_oklch(0.25_0.09_264/0.5)]"
          : "border-transparent bg-background",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logoMark}
            alt="Vimash Manufacturing logo"
            width={512}
            height={512}
            className="h-11 w-11 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight text-charcoal">
              Vimash
            </span>
            <span className="block truncate text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Manufacturing
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) =>
            link.to === "/products" ? (
              <div key={link.to} className="group/mega relative">
                <Link
                  to={link.to}
                  search={{}}
                  className="group relative inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/75 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/mega:rotate-180" />
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                </Link>

                <div className="invisible absolute left-1/2 top-full z-50 w-[min(46rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-2 pt-5 opacity-0 transition-all duration-300 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-deep)]">
                    <div className="grid gap-8 sm:grid-cols-2">
                      {(["atta", "masala"] as const).map((cat) => (
                        <div key={cat}>
                          <h4 className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-accent">
                            {cat === "atta" ? "Atta Chakki Pulverizers" : "Masala Grinder Machines"}
                          </h4>
                          <ul className="mt-4 space-y-1">
                            {products
                              .filter((p) => p.category === cat)
                              .map((p) => (
                                <li key={p.slug}>
                                  <Link
                                    to="/products/$slug"
                                    params={{ slug: p.slug }}
                                    className="block rounded-lg px-3 py-2 text-sm text-charcoal/80 transition-colors hover:bg-secondary hover:text-primary"
                                  >
                                    <span className="font-medium">{p.name}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      {p.hp} HP
                                    </span>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 border-t border-border pt-4">
                      <Link
                        to="/products"
                        search={{}}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                      >
                        View all machines
                        <ChevronDown className="h-4 w-4 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="group relative text-sm font-medium text-charcoal/75 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
              </Link>
            ),
          )}
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Phone className="h-4 w-4" />
            Get a Quote
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-background/70 text-charcoal lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-3 font-display text-lg font-semibold text-charcoal transition-colors hover:bg-secondary"
              activeProps={{ className: "text-primary bg-secondary" }}
              activeOptions={{ exact: link.to === "/" }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={site.phoneHref}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
          >
            <Phone className="h-4 w-4" />
            Get a Quote
          </a>
        </nav>
      </div>
    </header>
  );
}
