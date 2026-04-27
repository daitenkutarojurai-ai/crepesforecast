import { NextResponse } from "next/server";
import { buildBriefing } from "@/lib/briefing";
import { sendBriefingEmail } from "@/lib/email";
import { nextWorkingDayOfKind, type WorkingDayKind } from "@/lib/schedule";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const KINDS: readonly WorkingDayKind[] = ["saturday", "sunday", "holiday"] as const;

function authorized(req: Request): boolean {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Manual triggers
  // can pass ?secret=... so the user can hit it from a browser to test.
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // no secret configured → open (local dev)
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  if (url.searchParams.get("secret") === secret) return true;
  return false;
}

async function handle(req: Request): Promise<Response> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dayParam = url.searchParams.get("day");
  const dryRun = url.searchParams.get("dry") === "1";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const now = new Date();
    let target;
    if (dayParam) {
      if (!KINDS.includes(dayParam as WorkingDayKind)) {
        return NextResponse.json({ error: "invalid_day" }, { status: 400 });
      }
      target = nextWorkingDayOfKind(now, dayParam as WorkingDayKind);
      if (!target) {
        return NextResponse.json({ error: "no_day_available", kind: dayParam }, { status: 404 });
      }
    }

    const briefing = await buildBriefing(now, target);

    if (dryRun) {
      const { renderBriefingEmail } = await import("@/lib/email");
      const rendered = renderBriefingEmail(briefing, siteUrl);
      return new Response(rendered.html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    const result = await sendBriefingEmail(briefing, siteUrl);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, reason: result.reason, target: briefing.targetDate, kind: briefing.targetKind },
        { status: 500 }
      );
    }
    return NextResponse.json({
      ok: true,
      messageId: result.messageId,
      target: briefing.targetDate,
      kind: briefing.targetKind
    });
  } catch (err) {
    console.error("email-briefing failed", err);
    return NextResponse.json(
      { error: "email_failed", message: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}

export const GET = handle;
export const POST = handle;
