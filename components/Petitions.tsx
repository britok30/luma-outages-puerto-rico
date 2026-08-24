"use client";

import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Container, Eyebrow } from "./Editorial";

const PETITIONS = [
  { es: "Cancelación del contrato de LUMA en Puerto Rico", en: "Cancel the LUMA contract in Puerto Rico", url: "https://www.change.org/p/cancelacion-contrato-luma-puerto-rico" },
  { es: "Protejamos las tierras de Puerto Rico", en: "Protect Puerto Rico's land", url: "https://www.change.org/p/gobernador-pedro-pierluisi-protect-puerto-rico-s-land" },
  { es: "Reconstruir la red eléctrica con energía renovable, no combustibles fósiles", en: "Rebuild the power grid with renewables, not fossil fuels", url: "https://www.change.org/p/fema-rebuild-puerto-rico-s-power-grid-with-renewables-not-fossil-fuels" },
];

export const Petitions = () => {
  const { t } = useLang();
  return (
    <section aria-labelledby="petitions-heading" className="bg-cream text-ink border-t border-cream-3">
      <Container className="py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="text-moss">{t("Acción", "Action")}</Eyebrow>
            <h2 id="petitions-heading" className="display text-4xl sm:text-5xl mt-6">
              {t("Peticiones.", "Petitions.")}
            </h2>
          </div>
          <a
            className="eyebrow border border-ink/30 px-4 py-2.5 hover:bg-ink hover:text-cream transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.change.org/"
          >
            {t("Más en Change.org", "More on Change.org")}
          </a>
        </div>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 border-t border-cream-3 md:divide-x divide-cream-3">
          {PETITIONS.map((p, i) => (
            <li
              key={p.url}
              className="border-b md:border-b-0 border-cream-3 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={p.url}
                className="group flex flex-col justify-between h-full min-h-[200px] py-8"
              >
                <span className="eyebrow text-moss tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-10 flex items-end justify-between gap-4">
                  <span className="text-xl leading-snug group-hover:text-ember transition-colors">{t(p.es, p.en)}</span>
                  <ArrowUpRight className="w-5 h-5 shrink-0 text-moss group-hover:text-ember group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" aria-hidden />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default Petitions;
