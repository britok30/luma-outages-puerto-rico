"use client";

import { useLang } from "@/lib/i18n";
import { getFaq } from "@/lib/faq";
import type { Outage } from "@/lib/types";
import { Container, Eyebrow } from "./Editorial";

export const FAQ = ({ outage }: { outage?: Outage | null }) => {
  const { t, lang } = useLang();
  const items = getFaq(lang, outage);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-cream text-ink border-t border-cream-3 scroll-mt-14">
      <Container className="py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pr-16">
            <Eyebrow className="text-moss">{t("Preguntas", "Questions")}</Eyebrow>
            <h2 id="faq-heading" className="display text-4xl sm:text-5xl mt-6">
              {t("Lo que la gente pregunta.", "What people ask.")}
            </h2>
          </div>
          <dl className="lg:col-span-7 lg:border-l border-cream-3 lg:pl-16 mt-10 lg:mt-0 divide-y divide-cream-3">
            {items.map((it, i) => (
              <div key={it.q} className="py-7 first:pt-0 last:pb-0 grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="eyebrow text-moss pt-1.5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <dt className="text-xl sm:text-2xl leading-snug">{it.q}</dt>
                  <dd className="mt-3 text-base text-ink/70 max-w-2xl">{it.a}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
};
