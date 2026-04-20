import { NextResponse } from "next/server";
import { buildBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const briefing = await buildBriefing(new Date());
    return NextResponse.json(briefing, {
      headers: {
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (err) {
    console.error("buildBriefing failed", err);
    return NextResponse.json(
      { error: "briefing_unavailable", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
