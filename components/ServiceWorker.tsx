"use client";

import { useEffect } from "react";

/** Registers /sw.js (offline fallback). Resolves to null where unsupported. */
const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) return null;
  await navigator.serviceWorker.register("/sw.js");
  return navigator.serviceWorker.ready;
};

/** Production only: in dev a caching worker would fight hot reload. */
export const ServiceWorker = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    registerServiceWorker().catch((e) => console.error("Service worker registration failed:", e));
  }, []);
  return null;
};
