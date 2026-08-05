import { Factory, Truck, Headphones, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  {
    icon: Factory,
    title: "Direct Manufacturer",
    body: "Factory-direct pricing, no dealer margins.",
  },
  {
    icon: Truck,
    title: "PAN India Delivery",
    body: "Safe dispatch and installation across India.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    body: "Service engineers on call after handover.",
  },
  {
    icon: ShieldCheck,
    title: "Commercial Grade",
    body: "Built for continuous all-day production.",
  },
];

export function TrustCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {items.map((item, i) => (
        <Reveal key={item.title} delay={i * 80} className="h-full">
          <div className="hover-lift flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-col sm:gap-4 sm:p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary sm:h-12 sm:w-12">
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-charcoal sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
