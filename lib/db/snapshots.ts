import { desc, gte, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { revalidateTag, unstable_cache } from "next/cache";
import type { Outage, SystemOverview } from "../types";
import { parseLumaTimestamp } from "../time";
import { getDb, schema } from "./index";
import { notifyAlerts } from "../alerts";

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

    const regions = outage.regions.map((r) => ({
      name: r.name,
      total_clients: r.totalClients,
      without_service: r.totalClientsWithoutService,
      planned: r.totalClientsAffectedByPlannedOutage ?? 0,
      load_shed: r.totalClientsAffectedByLoadShed ?? 0,
      pct_without: r.percentageClientsWithoutService ?? 0,
    }));

    // One statement so the snapshot and its regions land together or not at
    // all: a failed region insert can't leave a snapshot that later calls skip.
    const { rows } = await db.execute<{ id: number }>(sql`
      with s as (
        insert into ${outageSnapshots}
          (luma_timestamp, observed_at, total_clients, without_service, with_service, planned, load_shed, pct_without)
        values (
          ${outage.timestamp}, ${observedAt.toISOString()}::timestamptz, ${t.totalClients},
          ${t.totalClientsWithoutService}, ${t.totalClientsWithService},
          ${t.totalClientsAffectedByPlannedOutage ?? 0}, ${t.totalClientsAffectedByLoadShed ?? 0},
          ${t.totalPercentageWithoutService ?? 0}
        )
        on conflict (luma_timestamp) do nothing
        returning id
      ), r as (
        insert into ${regionSnapshots}
          (snapshot_id, name, total_clients, without_service, planned, load_shed, pct_without)
        select s.id, r.name, r.total_clients, r.without_service, r.planned, r.load_shed, r.pct_without
        from s cross join json_to_recordset(${JSON.stringify(regions)}::json)
          as r(name text, total_clients int, without_service int, planned int, load_shed int, pct_without numeric)
      )
      select id from s
    `);

    if (!rows[0]) return false; // already recorded
    revalidateTag("history", "max");
    // Exactly one caller gets here per LUMA update, so alerts go out once.
    await notifyAlerts(outage);
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

/** Max points per series; history is bucketed in SQL to stay under it. */
const MAX_POINTS = 600;

/** Latest row per `date_bin` bucket, so long ranges don't ship every 5-min row. */
const bucketOf = (column: AnyPgColumn, range: HistoryRange) => {
  // Inlined (not a bind param) so DISTINCT ON and ORDER BY are the same expression.
  const seconds = sql.raw(String(Math.ceil(RANGE_MS[range] / MAX_POINTS / 1000)));
  return sql`date_bin(interval '${seconds} seconds', ${column}, timestamptz '2000-01-01')`;
};

const queryHistory = async (range: HistoryRange): Promise<History | null> => {
  const db = getDb();
  if (!db) return null;
  try {
    const from = new Date(Date.now() - RANGE_MS[range]);
    const outageBucket = bucketOf(outageSnapshots.observedAt, range);
    const systemBucket = bucketOf(systemSnapshots.capturedAt, range);
    const [outages, system, [first]] = await Promise.all([
      db
        .selectDistinctOn([outageBucket], {
          t: outageSnapshots.observedAt,
          without: outageSnapshots.withoutService,
          planned: outageSnapshots.planned,
          loadShed: outageSnapshots.loadShed,
        })
        .from(outageSnapshots)
        .where(gte(outageSnapshots.observedAt, from))
        .orderBy(outageBucket, desc(outageSnapshots.observedAt)),
      db
        .selectDistinctOn([systemBucket], {
          t: systemSnapshots.capturedAt,
          demand: systemSnapshots.demandMw,
          reserve: systemSnapshots.reserveMw,
        })
        .from(systemSnapshots)
        .where(gte(systemSnapshots.capturedAt, from))
        .orderBy(systemBucket, desc(systemSnapshots.capturedAt)),
      db
        .select({ min: sql<Date | null>`min(${outageSnapshots.observedAt})` })
        .from(outageSnapshots),
    ]);

    return {
      range,
      outages: outages.map((r) => ({ ...r, t: r.t.toISOString() })),
      system: system.map((r) => ({ ...r, t: r.t.toISOString() })),
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
