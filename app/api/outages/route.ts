import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.miluma.lumapr.com/miluma-outage-api/outage/regionsWithoutService",
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `LUMA API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Failed to fetch from LUMA API:", e);
    return NextResponse.json(
      { error: "Failed to fetch outage data" },
      { status: 502 }
    );
  }
}
