import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",
          "/*.json$",
          "/*_buildManifest.js$",
          "/*_middlewareManifest.js$",
          "/*_ssgManifest.js$",
          "/*.js$",
          "/*?ref*",
          "/*?utm_source*",
        ],
      },
    ],
    sitemap: "https://www.apagonpuertorico.com/sitemap.xml",
  };
}
