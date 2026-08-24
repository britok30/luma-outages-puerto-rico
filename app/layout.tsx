import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import { cookies } from "next/headers";
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

export const metadata: Metadata = {
  title:
    "Apagón Puerto Rico | Apagones en Tiempo Real | Real-Time Power Outages",
  description:
    "Mantente informado sobre apagones en Puerto Rico con datos de LUMA actualizados cada 5 minutos, por región y en el mapa. Track power outages across Puerto Rico in real time.",
  metadataBase: new URL("https://www.apagonpuertorico.com"),
  openGraph: {
    title: "Apagón Puerto Rico | Apagones en Tiempo Real",
    description:
      "Clientes sin servicio eléctrico en Puerto Rico, por región y en el mapa. Datos de LUMA actualizados cada 5 minutos.",
    url: "https://www.apagonpuertorico.com",
    siteName: "Apagón Puerto Rico",
    images: ["/pr.jpg"],
    type: "website",
    locale: "es_PR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apagón Puerto Rico | Apagones en Tiempo Real",
    description:
      "Clientes sin servicio eléctrico en Puerto Rico, por región y en el mapa. Datos de LUMA actualizados cada 5 minutos.",
    site: "@britoszn",
    creator: "@britoszn",
    images: ["/pr.jpg"],
  },
  alternates: { canonical: "https://www.apagonpuertorico.com" },
  keywords: [
    "Puerto Rico", "apagones", "apagón", "power outages", "LUMA",
    "LUMA Energy", "sin luz", "huracán", "hurricane", "electricidad",
  ],
  icons: { icon: "/favicon.ico" },
  authors: [{ name: "Brito" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang: Lang = isLang(cookieLang) ? cookieLang : "es";

  return (
    <html lang={lang} className={grotesk.variable}>
      <body className="bg-ink text-cream">
        <Analytics />
        <LanguageProvider initialLang={lang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
