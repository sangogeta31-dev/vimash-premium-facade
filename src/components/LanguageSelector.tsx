import { Globe, Check } from "lucide-react";
import { LANGUAGES, useI18n, type LangCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const active = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.language")}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-charcoal/80 transition-colors hover:border-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Globe className="h-4 w-4" />
        <span>{active.short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 border-border bg-card">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code as LangCode)}
            className="flex cursor-pointer items-center justify-between text-sm text-charcoal/85"
          >
            <span>{l.label}</span>
            {l.code === lang && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
