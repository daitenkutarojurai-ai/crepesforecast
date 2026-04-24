import { NextResponse } from "next/server";
import { buildBriefing } from "@/lib/briefing";
import { nextWorkingDayOfKind, type WorkingDayKind } from "@/lib/schedule";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const KINDS: readonly WorkingDayKind[] = ["saturday", "sunday", "holiday"] as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dayParam = url.searchParams.get("day");

  try {
    const now = new Date();

    if (dayParam) {
      if (!KINDS.includes(dayParam as WorkingDayKind)) {
        return NextResponse.json({ error: "invalid_day" }, { status: 400 });
      }
      const target = nextWorkingDayOfKind(now, dayParam as WorkingDayKind);
      if (!target) {
        return NextResponse.json(
          { error: "no_day_available", kind: dayParam },
          { status: 404 }
        );
      }
      const briefing = await buildBriefing(now, target);
      return NextResponse.json(briefing, {
        headers: { "Cache-Control": "no-store, max-age=0" }
      });
    }

    const briefing = await buildBriefing(now);
    return NextResponse.json(briefing, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (err) {
    console.error("buildBriefing failed", err);
    return NextResponse.json(
      { error: "briefing_unavailable" },
      { status: 500 }
    );
  }
}
