import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { navLinks, site } from "@/data/site";
import logoMark from "@/assets/vimash-mark.png.asset.json";


export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-primary-deep text-primary-foreground">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-9 lg:grid-cols-4 lg:px-8 lg:py-20">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-primary-foreground">
              <img src={logoMark.url} alt="Vimash Manufacturing logo" className="h-9 w-9 object-contain" />
            </span>
            <span className="font-display text-lg font-bold">Vimash</span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-primary-foreground/65">
            {site.tagline}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Navigate</h3>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Product Range</h3>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/70">
            <li>Atta Pulverizers · 5 – 20 HP</li>
            <li>Masala Pulverizers · 5 – 20 HP</li>
            <li>Cyclone & blower assemblies</li>
            <li>Spare screens, hammers, rotors</li>
            <li>Turnkey plant integration</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Reach Us</h3>
          <ul className="mt-5 space-y-4 text-sm text-primary-foreground/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={site.phoneHref} className="hover:text-primary-foreground">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${site.email}`} className="hover:text-primary-foreground">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-primary-foreground/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>ISO-aligned manufacturing · GST registered · Made in India</p>
        </div>
      </div>
    </footer>
  );
}
