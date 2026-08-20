import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "gu", label: "ગુજરાતી", short: "GU" },
  { code: "mr", label: "मराठी", short: "MR" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

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

type I18nValue = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
      },
      t: (key) => translations[lang][key] ?? translations.en[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) return { lang: "en" as LangCode, setLang: () => {}, t: (k: string) => translations.en[k] ?? k };
  return ctx;
}
