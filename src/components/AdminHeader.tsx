import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/vimash-mark.png.asset.json";

export function AdminHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-4 lg:px-8">
        <Link to="/admin/leads" className="flex items-center gap-3">
          <img
            src={logoMark.url}
            alt="Vimash Manufacturing logo"
            width={512}
            height={512}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-bold leading-tight text-charcoal">
              Lead Inbox
            </span>
            <span className="block truncate text-[0.62rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Vimash Admin
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
