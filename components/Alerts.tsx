"use client";

import { useEffect, useMemo, useState } from "react";
import { Regions } from "@/lib/types";
import { useLang } from "@/lib/i18n";
import { ALERT_THRESHOLDS, VAPID_PUBLIC_KEY } from "@/lib/alerts-config";
import { registerServiceWorker } from "./ServiceWorker";
import { Eyebrow, Split } from "./Editorial";

const STORAGE_KEY = "apagon-alerts";

interface Prefs {
  region: string | null;
  threshold: number;
  loadShed: boolean;
}

type Support = "checking" | "unsupported" | "ios-install" | "denied" | "ready";
type Status = "idle" | "saving" | "saved" | "removed" | "error";

const readPrefs = (): Prefs | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Prefs) : null;
  } catch {
    return null;
  }
};
const writePrefs = (p: Prefs | null) => {
  try {
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode: preferences just won't be remembered in this browser.
  }
};

const base64ToBytes = (b64: string) => {
  const padded = (b64 + "=".repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const detectSupport = (): Support => {
  const ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  // iOS only allows web push from a site added to the home screen.
  if (ios && !standalone) return "ios-install";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission === "denied" ? "denied" : "ready";
};

/**
 * Opt-in push alerts: pick a region (or the whole island) and a threshold, and
 * get notified when it's crossed or when load shedding starts. Hidden unless
 * VAPID keys are configured.
 */
export const Alerts = ({ regions }: { regions: Regions[] }) => {
  const { t, lang } = useLang();
  const [support, setSupport] = useState<Support>("checking");
  const [subscribed, setSubscribed] = useState<Prefs | null>(null);
  const [prefs, setPrefs] = useState<Prefs>({ region: null, threshold: 5, loadShed: true });
  const [status, setStatus] = useState<Status>("idle");

  const regionNames = useMemo(
    () => regions.map((r) => r.name).sort((a, b) => a.localeCompare(b, "es")),
    [regions]
  );

  useEffect(() => {
    if (!VAPID_PUBLIC_KEY) return;
    const s = detectSupport();
    setSupport(s);
    if (s !== "ready") return;
    // Trust the browser, not localStorage: only "subscribed" if a push subscription exists.
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      const sub = await reg?.pushManager.getSubscription();
      const saved = readPrefs();
      if (sub && saved) {
        setSubscribed(saved);
        setPrefs(saved);
      } else if (!sub) {
        writePrefs(null);
      }
    });
  }, []);

  if (!VAPID_PUBLIC_KEY) return null;

  const save = async () => {
    setStatus("saving");
    try {
      if ((await Notification.requestPermission()) !== "granted") {
        setSupport("denied");
        setStatus("idle");
        return;
      }
      const reg = await registerServiceWorker();
      if (!reg) throw new Error("Service worker unavailable");
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64ToBytes(VAPID_PUBLIC_KEY),
        }));
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), ...prefs, lang }),
      });
      if (!res.ok) throw new Error(`Subscribe failed (${res.status})`);
      writePrefs(prefs);
      setSubscribed(prefs);
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const remove = async () => {
    setStatus("saving");
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/alerts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      writePrefs(null);
      setSubscribed(null);
      setStatus("removed");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  const dirty =
    !subscribed ||
    subscribed.region !== prefs.region ||
    subscribed.threshold !== prefs.threshold ||
    subscribed.loadShed !== prefs.loadShed;

  return (
    <Split
      id="alerts"
      tone="olive"
      aside={
        <>
          <Eyebrow className="text-sage">{t("Alertas", "Alerts")}</Eyebrow>
          <h2 className="display text-4xl sm:text-5xl mt-6">
            {t("Que te avisen a ti.", "Get a heads-up.")}
          </h2>
          <p className="mt-8 text-lg text-cream/80 max-w-md">
            {t(
              "Recibe una notificación cuando tu región pase del nivel que escojas, cuando mejore, o cuando LUMA active el relevo de carga. Gratis, sin cuenta y sin correo.",
              "Get a notification when your region crosses the level you choose, when it improves, or when LUMA starts load shedding. Free, no account, no email."
            )}
          </p>
        </>
      }
    >
      {support === "checking" ? (
        <div className="h-40" aria-busy="true" />
      ) : support === "ios-install" ? (
        <Notice title={t("Primero, añádela a tu pantalla de inicio", "First, add it to your home screen")}>
          {t(
            "En iPhone, las alertas solo funcionan desde la pantalla de inicio: toca Compartir (el cuadro con la flecha) y luego “Añadir a pantalla de inicio”. Abre Apagón PR desde allí y vuelve a esta sección.",
            "On iPhone, alerts only work from the home screen: tap Share (the box with the arrow), then “Add to Home Screen”. Open Apagón PR from there and come back to this section."
          )}
        </Notice>
      ) : support === "unsupported" ? (
        <Notice title={t("Este navegador no permite alertas", "This browser doesn't support alerts")}>
          {t(
            "Prueba con Chrome, Edge, Firefox o Safari actualizados.",
            "Try an up-to-date Chrome, Edge, Firefox or Safari."
          )}
        </Notice>
      ) : support === "denied" ? (
        <Notice title={t("Las notificaciones están bloqueadas", "Notifications are blocked")}>
          {t(
            "Permite las notificaciones para este sitio en la configuración del navegador y recarga la página.",
            "Allow notifications for this site in your browser settings, then reload the page."
          )}
        </Notice>
      ) : (
        <form
          className="space-y-10"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="block">
            <span className="eyebrow text-sage">{t("Región", "Region")}</span>
            <select
              value={prefs.region ?? ""}
              onChange={(e) => setPrefs({ ...prefs, region: e.target.value || null })}
              className="mt-3 block w-full bg-olive-2 border border-cream/30 text-cream text-xl px-4 py-3 focus:outline-none focus:border-cream"
            >
              <option value="">{t("Toda la isla", "Whole island")}</option>
              {regionNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="eyebrow text-sage">
              {t("Avísame cuando esté sin luz al menos", "Alert me when at least this much is out")}
            </legend>
            <div className="mt-3 grid grid-cols-5 border border-cream/30 divide-x divide-cream/30">
              {ALERT_THRESHOLDS.map((v) => (
                <label
                  key={v}
                  className={`text-center py-3 text-lg tabular-nums cursor-pointer transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cream ${
                    prefs.threshold === v ? "bg-cream text-ink" : "hover:bg-olive-2"
                  }`}
                >
                  <input
                    type="radio"
                    name="threshold"
                    value={v}
                    checked={prefs.threshold === v}
                    onChange={() => setPrefs({ ...prefs, threshold: v })}
                    className="sr-only"
                  />
                  {v}%
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.loadShed}
              onChange={(e) => setPrefs({ ...prefs, loadShed: e.target.checked })}
              className="mt-1 h-5 w-5 accent-cream"
            />
            <span className="text-lg">
              {t("También cuando haya relevo de carga", "Also when load shedding starts or ends")}
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === "saving" || !dirty}
              className="eyebrow bg-cream text-ink px-5 py-3 hover:bg-cream-2 disabled:opacity-50 transition-colors"
            >
              {status === "saving"
                ? t("Guardando…", "Saving…")
                : subscribed
                  ? t("Guardar cambios", "Save changes")
                  : t("Activar alertas", "Turn on alerts")}
            </button>
            {subscribed && (
              <button
                type="button"
                onClick={remove}
                disabled={status === "saving"}
                className="eyebrow text-cream/80 hover:text-cream underline underline-offset-4 disabled:opacity-50"
              >
                {t("Desactivar alertas", "Turn off alerts")}
              </button>
            )}
          </div>

          <p role="status" className="text-base text-cream/80 min-h-6">
            {status === "saved" &&
              t(
                "Listo. Te enviamos una notificación de prueba.",
                "Done. We sent you a test notification."
              )}
            {status === "removed" && t("Alertas desactivadas.", "Alerts turned off.")}
            {status === "error" &&
              t(
                "No pudimos activar las alertas. Inténtalo de nuevo en un momento.",
                "We couldn't turn on alerts. Please try again in a moment."
              )}
            {status === "idle" &&
              subscribed &&
              t(
                `Alertas activas para ${subscribed.region ?? "toda la isla"} a partir de ${subscribed.threshold}%.`,
                `Alerts on for ${subscribed.region ?? "the whole island"} from ${subscribed.threshold}%.`
              )}
          </p>
        </form>
      )}
    </Split>
  );
};

const Notice = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-cream/30 p-6 sm:p-8">
    <p className="display text-2xl sm:text-3xl">{title}</p>
    <p className="mt-4 text-lg text-cream/80 max-w-xl">{children}</p>
  </div>
);
