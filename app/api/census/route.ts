import { NextResponse } from "next/server";
import { getCensusData } from "@/lib/stats";

export async function GET() {
  const data = await getCensusData();
  if (!data) {
    return NextResponse.json(
      { error: "Failed to fetch census data" },
      { status: 502 }
    );
  }
  return NextResponse.json(data);
}
