import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { fetchOutages } from "@/lib/stats";
import { alertsEnabled, nextState, readingFor, sendAlert } from "@/lib/alerts";
import { ALERT_THRESHOLDS } from "@/lib/alerts-config";

const { pushSubscriptions } = schema;

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) =>
  typeof v === "string" && v.length > 0 && v.length <= max ? v : null;

const httpsUrl = (v: unknown) => {
  const s = str(v, 2000);
  if (!s) return null;
  try {
    return new URL(s).protocol === "https:" ? s : null;
  } catch {
    return null;
  }
};

/** Subscribe (or update the preferences of) this browser. */
export async function POST(request: Request) {
  const db = getDb();
  if (!alertsEnabled() || !db) {
    return NextResponse.json({ error: "Alerts not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const endpoint = httpsUrl(body?.subscription?.endpoint);
  const p256dh = str(body?.subscription?.keys?.p256dh, 200);
  const auth = str(body?.subscription?.keys?.auth, 100);
  const region = body?.region === null ? null : str(body?.region, 40);
  const threshold = Number(body?.threshold);
  const loadShed = body?.loadShed !== false;
  const lang = body?.lang === "en" ? "en" : "es";
  if (
    !endpoint || !p256dh || !auth ||
    (region === null && body?.region !== null) ||
    !ALERT_THRESHOLDS.includes(threshold as (typeof ALERT_THRESHOLDS)[number])
  ) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  // Start from the current state so the first alert is a real change, and
  // tell the user where things stand right now.
  const outage = await fetchOutages().catch(() => null);
  const reading = outage ? readingFor(outage, region) : null;
  if (outage && !reading) {
    return NextResponse.json({ error: "Unknown region" }, { status: 400 });
  }
  const state = reading
    ? nextState({ threshold, above: false, loadShedActive: false }, reading)
    : { above: false, loadShedActive: false };

  const values = { endpoint, p256dh, auth, region, threshold, loadShed, lang, ...state, updatedAt: new Date() };
  await db
    .insert(pushSubscriptions)
    .values(values)
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: values });

  const es = lang === "es";
  const name = reading?.name ?? region ?? "Puerto Rico";
  const now = reading
    ? es
      ? ` Ahora: ${reading.pct.toFixed(1)}% sin servicio.`
      : ` Right now: ${reading.pct.toFixed(1)}% without service.`
    : "";
  const sent = await sendAlert(
    { endpoint, p256dh, auth },
    {
      title: es ? `Alertas activadas: ${name}` : `Alerts on: ${name}`,
      body: (es
        ? `Te avisaremos cuando llegue a ${threshold}% sin luz${loadShed ? " o haya relevo de carga" : ""}.`
        : `We'll let you know when it reaches ${threshold}% without power${loadShed ? " or load shedding starts" : ""}.`) + now,
      tag: "welcome",
    }
  );
  if (sent === "gone") {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    return NextResponse.json({ error: "Subscription rejected by push service" }, { status: 410 });
  }

  return NextResponse.json({ ok: true, region, threshold, loadShed });
}

/** Unsubscribe this browser. */
export async function DELETE(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Alerts not configured" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const endpoint = httpsUrl(body?.endpoint);
  if (!endpoint) return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  return NextResponse.json({ ok: true });
}
