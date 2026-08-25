import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { cookies, headers } from "next/headers";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/lib/i18n";
import { LANG_COOKIE, isLang, type Lang } from "@/lib/lang";

const grotesk = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: "#1c1b17",
};

const BASE = "https://www.apagonpuertorico.com";

const COPY = {
  es: {
    title: "Apagones en Puerto Rico en tiempo real | Apagón Puerto Rico",
    description:
      "Cuántos clientes están sin luz ahora mismo en Puerto Rico, por región y en el mapa. Datos de LUMA actualizados cada 5 minutos, con historial.",
  },
  en: {
    title: "Puerto Rico power outages in real time | Apagón Puerto Rico",
    description:
      "How many customers are without power in Puerto Rico right now, by region and on the map. LUMA data refreshed every 5 minutes, with history.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const c = COPY[lang];
  const url = lang === "en" ? `${BASE}/?lang=en` : `${BASE}/`;
  return {
    title: c.title,
    description: c.description,
    metadataBase: new URL(BASE),
    alternates: {
      canonical: url,
      languages: { "es-PR": `${BASE}/`, en: `${BASE}/?lang=en`, "x-default": `${BASE}/` },
    },
    openGraph: {
      title: c.title,
      description: c.description,
      url,
      siteName: "Apagón Puerto Rico",
      type: "website",
      locale: lang === "en" ? "en_US" : "es_PR",
      alternateLocale: lang === "en" ? ["es_PR"] : ["en_US"],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      site: "@britoszn",
      creator: "@britoszn",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    keywords: [
      "Puerto Rico", "apagones", "apagón", "apagón hoy", "sin luz", "relevo de carga",
      "LUMA", "LUMA Energy", "power outages", "huracán", "electricidad",
    ],
    authors: [{ name: "Brito", url: "https://x.com/britoszn" }],
    creator: "Brito",
  };
}

/** Language resolved by proxy.ts (`?lang=` or cookie), with a cookie fallback. */
async function resolveLang(): Promise<Lang> {
  const fromProxy = (await headers()).get("x-lang");
  if (isLang(fromProxy)) return fromProxy;
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(cookieLang) ? cookieLang : "es";
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await resolveLang();

  return (
    <html lang={lang} className={grotesk.variable}>
      <body className="bg-ink text-cream">
        <Analytics />
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
