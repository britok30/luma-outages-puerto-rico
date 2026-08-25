import { NextResponse, after } from "next/server";
import { fetchSystemOverview } from "@/lib/stats";
import { recordSystemSnapshot } from "@/lib/db/snapshots";

export async function GET() {
  try {
    const data = await fetchSystemOverview();
    after(() => recordSystemSnapshot(data));
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e) {
    console.error("Failed to fetch LUMA System Overview:", e);
    return NextResponse.json(
      { error: "Failed to fetch system overview" },
      { status: 502 }
    );
  }
}
