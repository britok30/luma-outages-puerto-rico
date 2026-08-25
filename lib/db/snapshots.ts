import { and, gte, sql } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import type { Outage, SystemOverview } from "../types";
import { parseLumaTimestamp } from "../time";
import { getDb, schema } from "./index";

const { outageSnapshots, regionSnapshots, systemSnapshots } = schema;

/**
 * Persists one LUMA update. Idempotent: LUMA's own timestamp is unique, so
 * calling this on every request only writes when LUMA has actually updated.
 * Never throws — history must not break the live dashboard.
 */
export const recordOutageSnapshot = async (outage: Outage): Promise<boolean> => {
  const db = getDb();
  if (!db) return false;
  try {
    const observedAt = parseLumaTimestamp(outage.timestamp);
    if (!observedAt) return false;
    const t = outage.totals;

    const inserted = await db
      .insert(outageSnapshots)
      .values({
        lumaTimestamp: outage.timestamp,
        observedAt,
        totalClients: t.totalClients,
        withoutService: t.totalClientsWithoutService,
        withService: t.totalClientsWithService,
        planned: t.totalClientsAffectedByPlannedOutage ?? 0,
        loadShed: t.totalClientsAffectedByLoadShed ?? 0,
        pctWithout: String(t.totalPercentageWithoutService ?? 0),
      })
      .onConflictDoNothing({ target: outageSnapshots.lumaTimestamp })
      .returning({ id: outageSnapshots.id });

    const snapshotId = inserted[0]?.id;
    if (!snapshotId) return false; // already recorded
    revalidateTag("history", "max");

    if (outage.regions.length) {
      await db.insert(regionSnapshots).values(
        outage.regions.map((r) => ({
          snapshotId,
          name: r.name,
          totalClients: r.totalClients,
          withoutService: r.totalClientsWithoutService,
          planned: r.totalClientsAffectedByPlannedOutage ?? 0,
          loadShed: r.totalClientsAffectedByLoadShed ?? 0,
          pctWithout: String(r.percentageClientsWithoutService ?? 0),
        }))
      );
    }
    return true;
  } catch (e) {
    console.error("recordOutageSnapshot failed:", e);
    return false;
  }
};

export const SYSTEM_BUCKET_MS = 5 * 60 * 1000;

/**
 * Persists a System Overview reading, at most once per 5-minute bucket. The
 * unique index on `bucket` makes this atomic, so concurrent callers (cron +
 * visitor-triggered writes) can't both insert.
 */
export const recordSystemSnapshot = async (system: SystemOverview): Promise<boolean> => {
  const db = getDb();
  if (!db) return false;
  try {
    const generationMw = system.plants.reduce((s, p) => s + p.mw, 0);
    const inserted = await db
      .insert(systemSnapshots)
      .values({
        bucket: Math.floor(Date.now() / SYSTEM_BUCKET_MS),
        demandMw: Math.round(system.demandMw),
        nextHourDemandMw: Math.round(system.nextHourDemandMw),
        reserveMw: Math.round(system.reserveMw),
        peakDemandMw: system.peakDemandMw === null ? null : Math.round(system.peakDemandMw),
        peakReserveMw: system.peakReserveMw === null ? null : Math.round(system.peakReserveMw),
        generationMw: generationMw.toFixed(2),
        plants: system.plants,
      })
      .onConflictDoNothing({ target: systemSnapshots.bucket })
      .returning({ id: systemSnapshots.id });
    return inserted.length > 0;
  } catch (e) {
    console.error("recordSystemSnapshot failed:", e);
    return false;
  }
};

export type HistoryRange = "24h" | "7d" | "30d";
const RANGE_MS: Record<HistoryRange, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};
export const isHistoryRange = (v: unknown): v is HistoryRange =>
  v === "24h" || v === "7d" || v === "30d";

export interface HistoryPoint {
  /** ISO time */
  t: string;
  without: number;
  planned: number;
  loadShed: number;
}
export interface SystemPoint {
  t: string;
  demand: number;
  reserve: number;
}
export interface History {
  range: HistoryRange;
  outages: HistoryPoint[];
  system: SystemPoint[];
  /** Oldest snapshot we have at all, for "tracking since" copy. */
  since: string | null;
}

/** Thin out a series so charts stay light: keep at most `max` points, preserving the last. */
const downsample = <T>(rows: T[], max: number): T[] => {
  if (rows.length <= max) return rows;
  const step = rows.length / max;
  const out: T[] = [];
  for (let i = 0; i < max; i++) out.push(rows[Math.floor(i * step)]);
  if (out[out.length - 1] !== rows[rows.length - 1]) out.push(rows[rows.length - 1]);
  return out;
};

const queryHistory = async (range: HistoryRange): Promise<History | null> => {
  const db = getDb();
  if (!db) return null;
  try {
    const from = new Date(Date.now() - RANGE_MS[range]);
    const [outages, system, [first]] = await Promise.all([
      db
        .select({
          t: outageSnapshots.observedAt,
          without: outageSnapshots.withoutService,
          planned: outageSnapshots.planned,
          loadShed: outageSnapshots.loadShed,
        })
        .from(outageSnapshots)
        .where(gte(outageSnapshots.observedAt, from))
        .orderBy(outageSnapshots.observedAt),
      db
        .select({
          t: systemSnapshots.capturedAt,
          demand: systemSnapshots.demandMw,
          reserve: systemSnapshots.reserveMw,
        })
        .from(systemSnapshots)
        .where(and(gte(systemSnapshots.capturedAt, from)))
        .orderBy(systemSnapshots.capturedAt),
      db
        .select({ min: sql<Date | null>`min(${outageSnapshots.observedAt})` })
        .from(outageSnapshots),
    ]);

    return {
      range,
      outages: downsample(outages, 600).map((r) => ({ ...r, t: r.t.toISOString() })),
      system: downsample(system, 600).map((r) => ({ ...r, t: r.t.toISOString() })),
      since: first?.min ? new Date(first.min).toISOString() : null,
    };
  } catch (e) {
    console.error("getHistory failed:", e);
    return null;
  }
};

/** Cached for 5 minutes (and busted whenever a new snapshot lands). */
export const getHistory = (range: HistoryRange = "7d") =>
  process.env.DATABASE_URL
    ? unstable_cache(() => queryHistory(range), ["history", range], {
        revalidate: 300,
        tags: ["history"],
      })()
    : Promise.resolve(null);
