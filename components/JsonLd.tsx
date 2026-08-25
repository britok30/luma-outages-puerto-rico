import type { Lang } from "@/lib/lang";
import type { Outage } from "@/lib/types";
import { getFaq } from "@/lib/faq";
import { parseLumaTimestamp } from "@/lib/time";

const BASE = "https://www.apagonpuertorico.com";

export const JsonLd = ({
  lang,
  outage,
  historySince,
}: {
  lang: Lang;
  outage?: Outage | null;
  historySince?: string | null;
}) => {
  const observed = parseLumaTimestamp(outage?.timestamp)?.toISOString();
  const es = lang === "es";

  const graph = [
    {
      "@type": "Organization",
      "@id": `${BASE}/#org`,
      name: "Apagón Puerto Rico",
      url: BASE,
      logo: `${BASE}/icon.svg`,
      sameAs: ["https://x.com/britoszn"],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
      url: BASE,
      name: "Apagón Puerto Rico",
      description: es
        ? "Apagones en Puerto Rico en tiempo real: clientes sin luz, por región y en el mapa, con datos de LUMA."
        : "Puerto Rico power outages in real time: customers without power, by region and on the map, with LUMA data.",
      inLanguage: ["es-PR", "en"],
      publisher: { "@id": `${BASE}/#org` },
    },
    {
      "@type": "WebPage",
      "@id": `${BASE}/#webpage`,
      url: es ? `${BASE}/` : `${BASE}/?lang=en`,
      isPartOf: { "@id": `${BASE}/#website` },
      inLanguage: es ? "es-PR" : "en",
      ...(observed ? { dateModified: observed } : {}),
      about: { "@id": `${BASE}/#dataset` },
    },
    {
      "@type": "Dataset",
      "@id": `${BASE}/#dataset`,
      name: es
        ? "Clientes sin servicio eléctrico en Puerto Rico (LUMA), por región"
        : "Customers without electric service in Puerto Rico (LUMA), by region",
      description: es
        ? "Serie temporal de clientes sin servicio eléctrico en Puerto Rico según LUMA Energy, guardada cada ~5 minutos: total, por región, por mantenimiento planificado y por relevo de carga; además demanda y reserva de generación del sistema."
        : "Time series of customers without electric service in Puerto Rico per LUMA Energy, recorded every ~5 minutes: total, by region, planned maintenance and load shedding; plus system demand and generation reserve.",
      url: `${BASE}/#history`,
      license: "https://creativecommons.org/licenses/by/4.0/",
      isAccessibleForFree: true,
      creator: { "@id": `${BASE}/#org` },
      spatialCoverage: { "@type": "Place", name: "Puerto Rico" },
      ...(historySince ? { temporalCoverage: `${historySince}/..` } : {}),
      keywords: ["apagones", "Puerto Rico", "LUMA", "power outages", "relevo de carga", "load shedding"],
      variableMeasured: [
        "customers without service",
        "customers affected by planned outage",
        "customers affected by load shedding",
        "system demand (MW)",
        "generation reserve (MW)",
      ],
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${BASE}/api/history?range=30d`,
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${BASE}/api/outages`,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${BASE}/#faq`,
      inLanguage: es ? "es-PR" : "en",
      mainEntity: getFaq(lang, outage).map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
};
