import webpush, { type PushSubscription } from "web-push";
import { eq, inArray } from "drizzle-orm";
import type { Outage } from "./types";
import { RECOVERY_RATIO, VAPID_PUBLIC_KEY } from "./alerts-config";
import { getDb, schema } from "./db";

const { pushSubscriptions } = schema;
type Subscription = typeof pushSubscriptions.$inferSelect;

const SITE = "https://www.apagonpuertorico.com";

let configured: boolean | undefined;
/** True when VAPID keys and the database are configured; alerts are a no-op otherwise. */
export const alertsEnabled = () => {
  if (configured === undefined) {
    const priv = process.env.VAPID_PRIVATE_KEY;
    configured = !!(VAPID_PUBLIC_KEY && priv && process.env.DATABASE_URL);
    if (configured) webpush.setVapidDetails(process.env.VAPID_SUBJECT || SITE, VAPID_PUBLIC_KEY, priv!);
  }
  return configured;
};

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

/** The numbers a subscription watches: one region, or the island total when `region` is null. */
export const readingFor = (outage: Outage, region: string | null) => {
  if (!region) {
    const t = outage.totals;
    return {
      name: "Puerto Rico",
      pct: t.totalPercentageWithoutService ?? 0,
      without: t.totalClientsWithoutService,
      loadShed: t.totalClientsAffectedByLoadShed ?? 0,
    };
  }
  const r = outage.regions.find((x) => normalize(x.name) === normalize(region));
  if (!r) return null;
  return {
    name: r.name,
    pct: r.percentageClientsWithoutService ?? 0,
    without: r.totalClientsWithoutService,
    loadShed: r.totalClientsAffectedByLoadShed ?? 0,
  };
};

type Reading = NonNullable<ReturnType<typeof readingFor>>;

/** Next alert state for a subscription, with hysteresis so a value hovering at the threshold doesn't flap. */
export const nextState = (
  sub: Pick<Subscription, "threshold" | "above" | "loadShedActive">,
  r: Reading
) => ({
  above: sub.above ? r.pct >= sub.threshold * RECOVERY_RATIO : r.pct >= sub.threshold,
  loadShedActive: r.loadShed > 0,
});

export interface AlertMessage {
  title: string;
  body: string;
  tag: string;
}

const pct = (n: number) => `${n.toFixed(1)}%`;
const num = (n: number) => n.toLocaleString("en-US");

/** Messages for the transitions between two states (empty if nothing changed that the user asked about). */
export const messagesFor = (
  sub: Pick<Subscription, "threshold" | "above" | "loadShedActive" | "loadShed" | "lang">,
  r: Reading,
  next: { above: boolean; loadShedActive: boolean }
): AlertMessage[] => {
  const es = sub.lang !== "en";
  const out: AlertMessage[] = [];
  if (next.above && !sub.above) {
    out.push({
      title: es ? `${r.name}: ${pct(r.pct)} sin luz` : `${r.name}: ${pct(r.pct)} without power`,
      body: es
        ? `${num(r.without)} clientes sin servicio. Tu alerta es a partir de ${sub.threshold}%.`
        : `${num(r.without)} customers out. Your alert threshold is ${sub.threshold}%.`,
      tag: `level-${r.name}`,
    });
  } else if (!next.above && sub.above) {
    out.push({
      title: es ? `${r.name} mejora: ${pct(r.pct)} sin luz` : `${r.name} improving: ${pct(r.pct)} without power`,
      body: es
        ? `Bajó de tu umbral de ${sub.threshold}%.`
        : `Back below your ${sub.threshold}% threshold.`,
      tag: `level-${r.name}`,
    });
  }
  if (sub.loadShed && next.loadShedActive !== sub.loadShedActive) {
    out.push(
      next.loadShedActive
        ? {
            title: es ? `Relevo de carga en ${r.name}` : `Load shedding in ${r.name}`,
            body: es
              ? `LUMA reporta ${num(r.loadShed)} clientes afectados por relevo de carga.`
              : `LUMA reports ${num(r.loadShed)} customers affected by load shedding.`,
            tag: `loadshed-${r.name}`,
          }
        : {
            title: es ? `Terminó el relevo de carga en ${r.name}` : `Load shedding ended in ${r.name}`,
            body: es ? "LUMA ya no reporta clientes en relevo de carga." : "LUMA no longer reports customers in load shedding.",
            tag: `loadshed-${r.name}`,
          }
    );
  }
  return out;
};

const toPush = (s: Pick<Subscription, "endpoint" | "p256dh" | "auth">): PushSubscription => ({
  endpoint: s.endpoint,
  keys: { p256dh: s.p256dh, auth: s.auth },
});

/** Sends one notification. Returns "gone" when the browser has dropped the subscription. */
export const sendAlert = async (
  s: Pick<Subscription, "endpoint" | "p256dh" | "auth">,
  msg: AlertMessage
): Promise<"ok" | "gone" | "error"> => {
  try {
    await webpush.sendNotification(toPush(s), JSON.stringify({ ...msg, url: "/" }), {
      TTL: 60 * 60,
      urgency: "high",
    });
    return "ok";
  } catch (e) {
    const status = (e as { statusCode?: number }).statusCode;
    if (status === 404 || status === 410) return "gone";
    console.error("Push send failed:", status, e);
    return "error";
  }
};

/**
 * Called once per new LUMA update (right after it's recorded). Sends alerts for
 * every subscription whose state changed and saves the new state. Never throws.
 */
export const notifyAlerts = async (outage: Outage) => {
  if (!alertsEnabled()) return;
  const db = getDb();
  if (!db) return;
  try {
    const subs = await db.select().from(pushSubscriptions);
    const gone: number[] = [];
    const changed: Array<{ id: number; above: boolean; loadShedActive: boolean }> = [];

    const work = subs.map((sub) => async () => {
      const r = readingFor(outage, sub.region);
      if (!r) return;
      const next = nextState(sub, r);
      if (next.above === sub.above && next.loadShedActive === sub.loadShedActive) return;
      for (const msg of messagesFor(sub, r, next)) {
        if ((await sendAlert(sub, msg)) === "gone") return void gone.push(sub.id);
      }
      changed.push({ id: sub.id, ...next });
    });
    // Small batches keep us well inside the push services' rate limits.
    for (let i = 0; i < work.length; i += 25) {
      await Promise.all(work.slice(i, i + 25).map((w) => w()));
    }

    if (gone.length) await db.delete(pushSubscriptions).where(inArray(pushSubscriptions.id, gone));
    for (const c of changed) {
      await db
        .update(pushSubscriptions)
        .set({ above: c.above, loadShedActive: c.loadShedActive, updatedAt: new Date() })
        .where(eq(pushSubscriptions.id, c.id));
    }
  } catch (e) {
    console.error("notifyAlerts failed:", e);
  }
};
