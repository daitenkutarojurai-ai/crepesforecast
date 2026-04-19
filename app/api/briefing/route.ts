import { NextResponse } from "next/server";
import { buildBriefing } from "@/lib/briefing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const briefing = await buildBriefing(new Date());
  return NextResponse.json(briefing, {
    headers: {
      "Cache-Control": "no-store, max-age=0"
    }
  });
}
