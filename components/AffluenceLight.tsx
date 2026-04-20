import type { Briefing } from "@/lib/types";

type Tier = { emoji: string; label: string; chip: string; text: string; dot: string };

const TIERS = {
  peak: {
    emoji: "🔥",
    label: "Pic d'affluence",
    chip: "bg-[#f7d5d5] border-[#f0b9b9]",
    text: "text-[#7a2a2a]",
    dot: "bg-seine-danger"
  },
  high: {
    emoji: "😀",
    label: "Forte affluence",
    chip: "bg-[#f7e6cc] border-[#f0d9ad]",
    text: "text-[#7a4b10]",
    dot: "bg-seine-warn"
  },
  steady: {
    emoji: "🙂",
    label: "Affluence stable",
    chip: "bg-seine-chip border-seine-chip",
    text: "text-seine-chipInk",
    dot: "bg-seine-ok"
  },
  quiet: {
    emoji: "😌",
    label: "Quai calme",
    chip: "bg-seine-bg border-seine-border",
    text: "text-seine-ink",
    dot: "bg-seine-muted"
  }
} as const satisfies Record<string, Tier>;

function scoreOf(briefing: Briefing): number {
  const topBump = briefing.events.reduce((m, e) => Math.max(m, e.expectedBump), 0);
  const { tempC, isSunny, precipProbPct, windKmh } = briefing.weather;
  let weather = 0;
  if (isSunny && tempC >= 22) weather += 15;
  else if (isSunny && tempC >= 18) weather += 8;
  if (precipProbPct > 60) weather -= 20;
  else if (precipProbPct > 35) weather -= 8;
  if (windKmh > 30) weather -= 5;
  return topBump + weather;
}

function tierOf(score: number): Tier {
  if (score >= 25) return TIERS.peak;
  if (score >= 12) return TIERS.high;
  if (score >= 0) return TIERS.steady;
  return TIERS.quiet;
}

export function AffluenceLight({ briefing }: { briefing: Briefing }) {
  const tier = tierOf(scoreOf(briefing));
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${tier.chip}`}
      title={`Indicateur d'affluence attendue — ${tier.label}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${tier.dot}`} aria-hidden />
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${tier.text}`}>
        <span aria-hidden>{tier.emoji}</span>
        {tier.label}
      </span>
    </div>
  );
}
