"use client";

import { useLang, type Lang } from "@/lib/i18n";

const LangButton = ({
  value,
  current,
  onSelect,
}: {
  value: Lang;
  current: Lang;
  onSelect: (lang: Lang) => void;
}) => {
  const active = value === current;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      lang={value}
      className={`eyebrow px-2 py-1 transition-colors ${
        active ? "text-cream" : "text-moss-2 hover:text-cream"
      }`}
    >
      {value.toUpperCase()}
    </button>
  );
};

export const Header = () => {
  const { lang, setLang, t } = useLang();

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur-sm border-b border-ink-3">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 h-14 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-center gap-2.5 shrink-0">
          <span
            aria-hidden
            className="inline-block w-2 h-2 bg-ember"
          />
          <span className="text-[15px] font-medium tracking-tight">
            Apagón Puerto Rico
          </span>
        </a>

        <nav
          aria-label={t("Secciones", "Sections")}
          className="hidden md:flex items-center gap-8 eyebrow text-moss-2"
        >
          <a href="#outages" className="hover:text-cream transition-colors">
            {t("Apagones", "Outages")}
          </a>
          <a href="#grid" className="hover:text-cream transition-colors">
            {t("Red", "Grid")}
          </a>
          <a href="#regions" className="hover:text-cream transition-colors">
            {t("Regiones", "Regions")}
          </a>
          <a href="#history" className="hover:text-cream transition-colors">
            {t("Historial", "History")}
          </a>
          <a href="#census" className="hover:text-cream transition-colors">
            {t("Contexto", "Context")}
          </a>
          <a href="#faq" className="hover:text-cream transition-colors">
            {t("Preguntas", "FAQ")}
          </a>
          <a href="#help" className="hover:text-cream transition-colors">
            {t("Ayuda", "Help")}
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <LangButton value="es" current={lang} onSelect={setLang} />
          <span className="text-ink-3" aria-hidden>/</span>
          <LangButton value="en" current={lang} onSelect={setLang} />
        </div>
      </div>
    </header>
  );
};
