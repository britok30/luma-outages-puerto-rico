// Apagón Puerto Rico service worker: offline fallback + outage alerts.
const CACHE = "apagon-v1";
const API = ["/api/outages", "/api/system", "/api/history"];
// On a weak signal, show the saved page after this long instead of spinning.
const NAV_TIMEOUT_MS = 4000;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })()
  );
});

const save = async (request, response) => {
  if (response.ok && response.type === "basic") {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

/** Network first; fall back to the cache when offline (or slow, for pages). */
const networkFirst = async (request, { timeoutMs, fallbackUrl } = {}) => {
  const network = fetch(request).then((res) => save(request, res));
  const cached = async () =>
    (await caches.match(request, { ignoreVary: true })) ||
    (fallbackUrl && (await caches.match(fallbackUrl, { ignoreVary: true })));

  if (!timeoutMs) {
    try {
      return await network;
    } catch (e) {
      const hit = await cached();
      if (hit) return hit;
      throw e;
    }
  }
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs)).then(cached);
  const first = await Promise.race([network.catch(() => null), timeout]);
  if (first) return first;
  // Timed out with nothing cached (or the network failed first): wait it out.
  try {
    return await network;
  } catch (e) {
    const hit = await cached();
    if (hit) return hit;
    throw e;
  }
};

const cacheFirst = async (request) =>
  (await caches.match(request)) || fetch(request).then((res) => save(request, res));

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, { timeoutMs: NAV_TIMEOUT_MS, fallbackUrl: "/" }));
  } else if (API.includes(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  }
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Apagón Puerto Rico", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "Apagón Puerto Rico", {
      body: data.body || "",
      tag: data.tag,
      renotify: !!data.tag,
      icon: "/pwa-icon/192",
      badge: "/pwa-icon/192",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/", self.location.origin).href;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((w) => new URL(w.url).origin === self.location.origin);
      if (open) {
        await open.focus();
        return open.navigate(target);
      }
      return self.clients.openWindow(target);
    })()
  );
});
