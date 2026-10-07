import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apagón Puerto Rico",
    short_name: "Apagón PR",
    description:
      "Clientes sin luz en Puerto Rico ahora mismo, por región. Datos de LUMA cada 5 minutos.",
    lang: "es-PR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a1a3f",
    theme_color: "#0a1a3f",
    icons: [
      { src: "/pwa-icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/pwa-icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
