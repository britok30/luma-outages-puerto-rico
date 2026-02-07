import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const eudoxusSans = localFont({
  src: [
    {
      path: "./fonts/EudoxusSans-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/EudoxusSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/EudoxusSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/EudoxusSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/EudoxusSans-ExtraBold.woff",
      weight: "900",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title:
    "Puerto Rico Power Outages | Real-Time Updates & Reports | Apagones en Puerto Rico - Información en Tiempo Real",
  description:
    "Track, record, and stay updated on power outages across Puerto Rico with Apagón Puerto Rico. Receive real-time updates and comprehensive reports on electricity interruptions. Mantente informado sobre apagones en Puerto Rico con reportes en tiempo real.",
  metadataBase: new URL("https://www.apagonpuertorico.com"),
  openGraph: {
    title: "Apagón Puerto Rico | Real-Time Power Outage Reports",
    description:
      "Real-time updates and alerts on power outages across Puerto Rico. Track and understand electricity interruptions as they happen.",
    url: "https://www.apagonpuertorico.com",
    siteName: "Apagón Puerto Rico",
    images: ["/pr.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apagón Puerto Rico | Real-Time Alerts and Power Outage Reports",
    description:
      "Stay informed with real-time alerts and updates on power outages in Puerto Rico. Apagón Puerto Rico provides up-to-date information on electricity interruptions.",
    site: "@britoszn",
    creator: "@britoszn",
    images: ["/pr.jpg"], // Updated image URL
  },
  alternates: {
    canonical: "https://www.apagonpuertorico.com",
  },
  keywords: [
    "Puerto Rico",
    "power outages",
    "apagones",
    "LUMA",
    "hurricane",
    "electricity updates",
    "energy status",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Brito" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className="bg-gray-50 text-gray-900 scrollbar scrollbar-thumb-zinc-300 scrollbar-track-gray-50"
    >
      <body className={`${eudoxusSans.className} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
