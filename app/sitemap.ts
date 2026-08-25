import type { MetadataRoute } from "next";

const BASE = "https://www.apagonpuertorico.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified,
      changeFrequency: "hourly",
      priority: 1,
      alternates: { languages: { "es-PR": `${BASE}/`, en: `${BASE}/?lang=en`, "x-default": `${BASE}/` } },
    },
    {
      url: `${BASE}/?lang=en`,
      lastModified,
      changeFrequency: "hourly",
      priority: 0.8,
      alternates: { languages: { "es-PR": `${BASE}/`, en: `${BASE}/?lang=en`, "x-default": `${BASE}/` } },
    },
  ];
}
