import { NextResponse, after } from "next/server";
import { fetchOutages } from "@/lib/stats";
import { recordOutageSnapshot } from "@/lib/db/snapshots";

export async function GET() {
  try {
    const data = await fetchOutages();
    // Persist history without delaying the response (no-op if no DATABASE_URL).
    after(() => recordOutageSnapshot(data));
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e) {
    console.error("Failed to fetch from LUMA API:", e);
    return NextResponse.json(
      { error: "Failed to fetch outage data" },
      { status: 502 }
    );
  }
}
