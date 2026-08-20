import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { translateBatch } from "@/lib/translate.functions";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "gu", label: "ગુજરાતી", short: "GU" },
  { code: "mr", label: "मराठी", short: "MR" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

/** Instant translations for chrome that must never flicker. */
const translations: Record<LangCode, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.products": "Products",
    "nav.gallery": "Gallery",
    "nav.contact": "Contact",
    "nav.quote": "Get a Quote",
    "nav.language": "Language",
    "nav.atta": "Atta Chakki Pulverizers",
    "nav.masala": "Masala Grinder Machines",
    "nav.viewAll": "View all machines",
  },
  hi: {
    "nav.home": "होम",
    "nav.about": "हमारे बारे में",
    "nav.products": "उत्पाद",
    "nav.gallery": "गैलरी",
    "nav.contact": "संपर्क",
    "nav.quote": "कोटेशन पाएं",
    "nav.language": "भाषा",
    "nav.atta": "आटा चक्की पल्वराइज़र",
    "nav.masala": "मसाला ग्राइंडर मशीनें",
    "nav.viewAll": "सभी मशीनें देखें",
  },
  gu: {
    "nav.home": "હોમ",
    "nav.about": "અમારા વિશે",
    "nav.products": "પ્રોડક્ટ્સ",
    "nav.gallery": "ગેલેરી",
    "nav.contact": "સંપર્ક",
    "nav.quote": "ભાવ મેળવો",
    "nav.language": "ભાષા",
    "nav.atta": "આટા ચક્કી પલ્વરાઈઝર",
    "nav.masala": "મસાલા ગ્રાઇન્ડર મશીનો",
    "nav.viewAll": "બધી મશીનો જુઓ",
  },
  mr: {
    "nav.home": "मुख्यपृष्ठ",
    "nav.about": "आमच्याबद्दल",
    "nav.products": "उत्पादने",
    "nav.gallery": "गॅलरी",
    "nav.contact": "संपर्क",
    "nav.quote": "कोटेशन मिळवा",
    "nav.language": "भाषा",
    "nav.atta": "आटा चक्की पल्व्हरायझर",
    "nav.masala": "मसाला ग्राइंडर मशीन",
    "nav.viewAll": "सर्व मशीन पहा",
  },
};

const STORAGE_KEY = "vimash-lang";
const CACHE_PREFIX = "vimash-i18n-cache:";

type I18nValue = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "SVG",
  "PATH",
  "TEXTAREA",
  "IFRAME",
]);

const hasLetters = (value: string) => /[A-Za-z]{2,}/.test(value);

function collectTextNodes(root: Node): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      const value = node.nodeValue ?? "";
      if (!value.trim() || !hasLetters(value)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;

function collectAttrTargets(root: ParentNode): Array<{ el: Element; attr: string; value: string }> {
  const out: Array<{ el: Element; attr: string; value: string }> = [];
  const selector = ATTRS.map((a) => `[${a}]`).join(",");
  const elements = [
    ...(root instanceof Element && root.matches(selector) ? [root] : []),
    ...Array.from(root.querySelectorAll(selector)),
  ];
  for (const el of elements) {
    if (el.closest("[data-no-translate]")) continue;
    for (const attr of ATTRS) {
      const value = el.getAttribute(attr);
      if (value && hasLetters(value)) out.push({ el, attr, value });
    }
  }
  return out;
}

function loadCache(lang: LangCode): Dict {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_PREFIX + lang) ?? "{}") as Dict;
  } catch {
    return {};
  }
}

function saveCache(lang: LangCode, dict: Dict) {
  try {
    window.localStorage.setItem(CACHE_PREFIX + lang, JSON.stringify(dict));
  } catch {
    /* quota — ignore */
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");
  const cacheRef = useRef<Dict>({});
  const pendingRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /* Whole-page translation layer. Runs only for non-English languages. */
  useEffect(() => {
    if (lang === "en") return;
    let cancelled = false;
    cacheRef.current = loadCache(lang);

    const applyDict = (dict: Dict, scope: ParentNode = document.body) => {
      for (const node of collectTextNodes(scope)) {
        const raw = node.nodeValue ?? "";
        const key = raw.trim();
        const hit = dict[key];
        if (hit && hit !== key) {
          node.nodeValue = raw.replace(key, hit);
        }
      }
      for (const { el, attr, value } of collectAttrTargets(scope)) {
        const hit = dict[value.trim()];
        if (hit) el.setAttribute(attr, hit);
      }
    };

    const flush = async () => {
      const texts = Array.from(pendingRef.current).slice(0, 400);
      pendingRef.current = new Set(Array.from(pendingRef.current).slice(400));
      if (!texts.length) return;
      try {
        const result = await translateBatch({ data: { lang: lang as "hi" | "gu" | "mr", texts } });
        if (cancelled) return;
        cacheRef.current = { ...cacheRef.current, ...result };
        saveCache(lang, cacheRef.current);
        applyDict(result);
      } catch {
        /* keep English on failure */
      }
      if (pendingRef.current.size && !cancelled) void flush();
    };

    const scan = (scope: ParentNode = document.body) => {
      const dict = cacheRef.current;
      const missing: string[] = [];
      for (const node of collectTextNodes(scope)) {
        const key = (node.nodeValue ?? "").trim();
        if (!dict[key]) missing.push(key);
      }
      for (const { value } of collectAttrTargets(scope)) {
        const key = value.trim();
        if (!dict[key]) missing.push(key);
      }
      applyDict(dict, scope);
      missing.forEach((m) => pendingRef.current.add(m));
      if (pendingRef.current.size) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => void flush(), 250);
      }
    };

    scan();

    let debounce: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => scan(), 150);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributeFilter: [...ATTRS],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (debounce) clearTimeout(debounce);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: (next) => {
        if (next === lang) return;
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
        // Reload so the page starts from clean English markup, then re-translates.
        window.location.reload();
      },
      t: (key) => translations[lang][key] ?? translations.en[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx)
    return {
      lang: "en" as LangCode,
      setLang: () => {},
      t: (k: string) => translations.en[k] ?? k,
    };
  return ctx;
}
