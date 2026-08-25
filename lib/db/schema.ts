import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/** One row per distinct LUMA update (deduplicated on LUMA's own timestamp). */
export const outageSnapshots = pgTable(
  "outage_snapshots",
  {
    id: serial("id").primaryKey(),
    /** LUMA's "MM/DD/YYYY hh:mm AM" string, unique per update. */
    lumaTimestamp: text("luma_timestamp").notNull().unique(),
    /** Same instant parsed as UTC (LUMA reports in AST, UTC-4). */
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
    totalClients: integer("total_clients").notNull(),
    withoutService: integer("without_service").notNull(),
    withService: integer("with_service").notNull(),
    planned: integer("planned").notNull().default(0),
    loadShed: integer("load_shed").notNull().default(0),
    pctWithout: numeric("pct_without", { precision: 6, scale: 2 }).notNull(),
  },
  (t) => [index("outage_snapshots_observed_at_idx").on(t.observedAt)]
);

export const regionSnapshots = pgTable(
  "region_snapshots",
  {
    id: serial("id").primaryKey(),
    snapshotId: integer("snapshot_id")
      .notNull()
      .references(() => outageSnapshots.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    totalClients: integer("total_clients").notNull(),
    withoutService: integer("without_service").notNull(),
    planned: integer("planned").notNull().default(0),
    loadShed: integer("load_shed").notNull().default(0),
    pctWithout: numeric("pct_without", { precision: 6, scale: 2 }).notNull(),
  },
  (t) => [index("region_snapshots_name_snapshot_idx").on(t.name, t.snapshotId)]
);

/** Grid readings scraped from LUMA's System Overview (no LUMA timestamp; we bucket by capture time). */
export const systemSnapshots = pgTable(
  "system_snapshots",
  {
    id: serial("id").primaryKey(),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
    demandMw: integer("demand_mw").notNull(),
    nextHourDemandMw: integer("next_hour_demand_mw").notNull(),
    reserveMw: integer("reserve_mw").notNull(),
    peakDemandMw: integer("peak_demand_mw"),
    peakReserveMw: integer("peak_reserve_mw"),
    generationMw: numeric("generation_mw", { precision: 8, scale: 2 }).notNull(),
    plants: jsonb("plants").$type<Array<{ name: string; mw: number; maxMw: number | null }>>().notNull(),
  },
  (t) => [index("system_snapshots_captured_at_idx").on(t.capturedAt)]
);
