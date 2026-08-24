"use client";

import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Container, Eyebrow } from "./Editorial";

const ORGS = [
  { title: "Foundation for Puerto Rico", href: "https://www.foundationforpuertorico.org/", es: "Resiliencia económica y reconstrucción sostenible de comunidades.", en: "Economic resilience and sustainable community rebuilding." },
  { title: "Friends of Puerto Rico", href: "https://www.friendsofpuertorico.org/", es: "Empoderamiento económico con enfoque en juventud y mujeres.", en: "Economic empowerment with a focus on youth and women." },
  { title: "PRxPR Relief and Rebuild Fund", href: "https://www.prxpr.org/", es: "100% de las donaciones a alimentos, agua y energía renovable.", en: "100% of donations to food, water, and renewable energy." },
  { title: "United Way of Puerto Rico", href: "https://www.unitedwaypr.org/", es: "Salud, estabilidad financiera y educación.", en: "Health, financial stability, and education." },
  { title: "Fundación CAP", href: "https://www.fundacioncap.org/", es: "Apoyo a pacientes pediátricos de cáncer.", en: "Support for pediatric cancer patients." },
  { title: "Together Puerto Rico", href: "https://www.togetherpuertorico.com/", es: "Filtros de agua, linternas solares y respuesta a desastres.", en: "Water filters, solar lanterns, and disaster response." },
  { title: "Hispanic Federation", href: "https://www.hispanicfederation.org/about-hispanic-federation/where-we-operate/puerto-rico/", es: "Reconstrucción de hogares, centros de salud y fincas desde María.", en: "Rebuilding homes, health centers, and farms since Maria." },
  { title: "SBP", href: "https://www.sbpusa.org/puerto-rico/", es: "Más hogares reconstruidos en PR que cualquier otra organización.", en: "More homes rebuilt in PR than any other organization." },
  { title: "All Hands and Hearts", href: "https://allhandsandhearts.org/our-work/programs/puerto-rico-hurricane-relief", es: "Hogares e infraestructura en Yabucoa y Barranquitas.", en: "Homes and infrastructure in Yabucoa and Barranquitas." },
  { title: "El Fondo Boricua", href: "https://elfondoboricua.org/", es: "Donaciones a organizaciones 501(c)(3) verificadas.", en: "Donations routed to vetted 501(c)(3) nonprofits." },
  { title: "Fundación Comunitaria de PR", href: "https://fcpr.org/", es: "35+ años: energía renovable, agua, vivienda, educación.", en: "35+ years: renewable energy, water, housing, education." },
  { title: "Comedores Sociales de PR", href: "https://www.comederossociales.org/", es: "Cocinas comunitarias contra la inseguridad alimentaria.", en: "Community kitchens fighting food insecurity." },
];

const HelpPR = () => {
  const { t } = useLang();
  return (
    <section id="help" aria-labelledby="help-heading" className="bg-ink text-cream border-t border-ink-3 scroll-mt-14">
      <Container className="py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0">
          <div className="lg:col-span-5 lg:pr-16">
            <Eyebrow className="text-moss-2">{t("Ayuda", "Help")}</Eyebrow>
            <h2 id="help-heading" className="display text-4xl sm:text-5xl mt-6">
              {t("Organizaciones en la isla.", "Organizations on the island.")}
            </h2>
            <p className="mt-8 text-lg text-cream/70 max-w-md">
              {t(
                "Doce organizaciones que trabajan en Puerto Rico y aceptan donaciones. Ninguna está afiliada a este sitio.",
                "Twelve organizations working in Puerto Rico that accept donations. None are affiliated with this site."
              )}
            </p>
          </div>
          <ul className="lg:col-span-7 lg:border-l border-ink-3 lg:pl-16 -mt-7 divide-y divide-ink-3">
            {ORGS.map((org, i) => (
              <li key={org.href}>
                <a
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[2.5rem_1fr_auto] gap-4 py-7 items-baseline"
                >
                  <span className="eyebrow text-moss tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block text-xl group-hover:text-ember-2 transition-colors">{org.title}</span>
                    <span className="block mt-1 text-sm text-moss-2">{t(org.es, org.en)}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-moss-2 group-hover:text-ember-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all self-center" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default HelpPR;
