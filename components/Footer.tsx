"use client";

import { useLang } from "@/lib/i18n";
import { Container } from "./Editorial";

export const Footer = () => {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream border-t border-ink-3">
      <Container className="py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[15px] font-medium tracking-tight">
              <span aria-hidden className="inline-block w-2 h-2 bg-ember mr-2.5 align-middle" />
              Apagón Puerto Rico
            </p>
            <p className="mt-4 text-xs text-moss-2 max-w-lg">
              {t(
                "No está afiliado con el Gobierno de Puerto Rico ni con LUMA Energy. Datos de apagones: LUMA Energy. Datos demográficos: U.S. Census Bureau.",
                "Not affiliated with the Government of Puerto Rico or LUMA Energy. Outage data: LUMA Energy. Demographic data: U.S. Census Bureau."
              )}
            </p>
          </div>
          <div className="eyebrow text-moss-2 flex flex-wrap gap-x-8 gap-y-2">
            <a href="https://miluma.lumapr.com/outages/outageMap" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
              {t("Fuente: LUMA", "Source: LUMA")}
            </a>
            <a href="https://x.com/britoszn" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">
              {t("Hecho por Brito", "Built by Brito")}
            </a>
            <span>© {year}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
