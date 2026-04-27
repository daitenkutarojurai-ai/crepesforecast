import { Flame, Leaf, type LucideIcon, Smile, TrendingUp } from "lucide-react";
import type { Briefing } from "@/lib/types";

type Tier = { Icon: LucideIcon; label: string; chip: string; text: string; dot: string };

const TIERS = {
  peak: {
    Icon: Flame,
    label: "Pic d'affluence",
    chip: "bg-[#f7d5d5] border-[#f0b9b9]",
    text: "text-[#7a2a2a]",
    dot: "bg-seine-danger"
  },
  high: {
    Icon: TrendingUp,
    label: "Forte affluence",
    chip: "bg-[#f7e6cc] border-[#f0d9ad]",
    text: "text-[#7a4b10]",
    dot: "bg-seine-warn"
  },
  steady: {
    Icon: Smile,
    label: "Affluence stable",
    chip: "bg-seine-chip border-seine-chip",
    text: "text-seine-chipInk",
    dot: "bg-seine-ok"
  },
  quiet: {
    Icon: Leaf,
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
  const Icon = tier.Icon;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${tier.chip}`}
      title={`Indicateur d'affluence attendue — ${tier.label}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${tier.dot}`} aria-hidden />
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${tier.text}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {tier.label}
      </span>
    </div>
  );
}
