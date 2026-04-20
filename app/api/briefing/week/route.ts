import { NextResponse } from "next/server";
import { buildWeekBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const week = await buildWeekBriefing(new Date());
    return NextResponse.json(week, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (err) {
    console.error("buildWeekBriefing failed", err);
    return NextResponse.json(
      { error: "week_unavailable", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
