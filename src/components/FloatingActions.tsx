import { MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/site";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-4 z-50 hidden flex-col gap-3 sm:bottom-8 sm:right-6 lg:flex">
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-0 overflow-hidden rounded-full bg-whatsapp px-4 py-4 text-primary-foreground shadow-[var(--shadow-elevated)] transition-all duration-500 hover:gap-3 hover:pr-6"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-500 group-hover:max-w-[8rem] group-hover:opacity-100">
          WhatsApp
        </span>
      </a>
      <a
        href={site.phoneHref}
        aria-label="Call Vimash Manufacturing"
        className="group flex items-center gap-0 overflow-hidden rounded-full bg-accent px-4 py-4 text-accent-foreground shadow-[var(--shadow-glow)] transition-all duration-500 hover:gap-3 hover:pr-6"
      >
        <Phone className="h-5 w-5 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-500 group-hover:max-w-[8rem] group-hover:opacity-100">
          Call Now
        </span>
      </a>
    </div>
  );
}
