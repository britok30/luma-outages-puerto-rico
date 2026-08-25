import { NextResponse } from "next/server";
import { fetchOutages, fetchSystemOverview } from "@/lib/stats";
import { recordOutageSnapshot, recordSystemSnapshot } from "@/lib/db/snapshots";

export const dynamic = "force-dynamic";

/**
 * Records a snapshot of LUMA's current state. Meant to be hit every ~5 min
 * by a scheduler (GitHub Actions workflow in .github/workflows/snapshot.yml,
 * or Vercel Cron). Protected by CRON_SECRET.
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
