import { NextResponse } from "next/server";
import { fetchOutages, fetchSystemOverview } from "@/lib/stats";
import { recordOutageSnapshot, recordSystemSnapshot } from "@/lib/db/snapshots";

export const dynamic = "force-dynamic";

/**
 * Records a snapshot of LUMA's current state. Hit every 5 min by Vercel Cron
 * (vercel.json), which sends `Authorization: Bearer $CRON_SECRET` automatically.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 503 });
  }

  const [outages, system] = await Promise.allSettled([fetchOutages(), fetchSystemOverview()]);
  const result = {
    outage: outages.status === "fulfilled" ? await recordOutageSnapshot(outages.value) : "fetch-failed",
    system: system.status === "fulfilled" ? await recordSystemSnapshot(system.value) : "fetch-failed",
    at: new Date().toISOString(),
  };
  return NextResponse.json(result);
}
