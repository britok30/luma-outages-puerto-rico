import { NextResponse } from "next/server";
import { getHistory, isHistoryRange } from "@/lib/db/snapshots";

export async function GET(request: Request) {
  const range = new URL(request.url).searchParams.get("range");
  const data = await getHistory(isHistoryRange(range) ? range : "7d");
  if (!data) {
    return NextResponse.json({ error: "History not available" }, { status: 503 });
  }
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
