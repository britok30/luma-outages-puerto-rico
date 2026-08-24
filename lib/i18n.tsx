"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { LANG_COOKIE, type Lang } from "./lang";

export type { Lang };

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "es",
  setLang: () => {},
});

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/**
 * Returns the current language plus `t(es, en)`, which picks the string for
 * the active language. Spanish is listed first because it is the site default.
 */
export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = useCallback(
    (es: string, en: string) => (lang === "es" ? es : en),
    [lang]
  );
  return { lang, setLang, t };
}

export const formatNumber = (n: number | undefined | null) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("en-US") : "-";
