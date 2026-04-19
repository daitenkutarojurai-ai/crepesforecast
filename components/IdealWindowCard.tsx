import { Clock, TrendingUp } from "lucide-react";
import { Card, Chip } from "./Card";
import { describeSky, pickWeatherIcon } from "@/lib/weather-icon";
import type { Briefing, HourlyPoint } from "@/lib/types";

function scoreHour(h: HourlyPoint): number {
  const comfort = Math.max(0, 20 - Math.abs(h.tempC - 20));
  const rain = Math.max(0, 1 - h.precipProbPct / 60);
  const wind = Math.max(0, 1 - h.windKmh / 40);
  return comfort * rain * wind;
}

function bestWindow(hourly: HourlyPoint[]): { start: HourlyPoint; end: HourlyPoint; score: number } | undefined {
  const day = hourly.filter((h) => {
    const hr = new Date(h.time).getHours();
    return hr >= 9 && hr <= 20;
  });
  if (day.length < 3) return undefined;
  let best = { startIdx: 0, score: -Infinity };
  for (let i = 0; i < day.length - 2; i++) {
    const s = (scoreHour(day[i]) + scoreHour(day[i + 1]) + scoreHour(day[i + 2])) / 3;
    if (s > best.score) best = { startIdx: i, score: s };
  }
  return {
    start: day[best.startIdx],
    end: day[best.startIdx + 2],
    score: best.score
  };
}

export function IdealWindowCard({ briefing }: { briefing: Briefing }) {
  const win = bestWindow(briefing.hourly);
  if (!win) {
    return (
      <Card title="Fenêtre idéale" subtitle="Sur la journée" icon={Clock}>
        <p className="text-sm text-seine-muted">Pas assez de données horaires.</p>
      </Card>
    );
  }

  const mid: HourlyPoint = {
    time: win.start.time,
    tempC: (win.start.tempC + win.end.tempC) / 2,
    feelsLikeC: (win.start.feelsLikeC + win.end.feelsLikeC) / 2,
    windKmh: Math.max(win.start.windKmh, win.end.windKmh),
    uvIndex: Math.max(win.start.uvIndex, win.end.uvIndex),
    precipProbPct: Math.max(win.start.precipProbPct, win.end.precipProbPct),
    cloudCoverPct: (win.start.cloudCoverPct + win.end.cloudCoverPct) / 2
  };
  const Icon = pickWeatherIcon(mid.cloudCoverPct, mid.precipProbPct);
  const sky = describeSky(mid.cloudCoverPct, mid.precipProbPct);

  return (
    <Card title="Fenêtre idéale" subtitle="Meilleures 3 heures" icon={Clock}>
      <div className="flex items-center gap-3 rounded-2xl border border-seine-border bg-seine-peach/30 p-4">
        <Icon className="h-10 w-10 text-seine-accent" strokeWidth={1.5} />
        <div className="flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
            Créneau recommandé
          </div>
          <div className="font-mono text-lg font-semibold text-seine-ink">
            {timeOf(win.start.time)} – {endLabel(win.end.time)}
          </div>
          <div className="text-xs text-seine-muted">
            {Math.round(mid.tempC)}° · {sky}
          </div>
        </div>
        <Chip tone="ok">
          <TrendingUp className="h-3 w-3" />
          pic {Math.round(win.score)}
        </Chip>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs">
        <li className="flex justify-between rounded-lg bg-seine-bg/40 px-3 py-1.5">
          <span className="text-seine-muted">Pluie max</span>
          <span className="font-mono text-seine-ink">{Math.round(mid.precipProbPct)}%</span>
        </li>
        <li className="flex justify-between rounded-lg bg-seine-bg/40 px-3 py-1.5">
          <span className="text-seine-muted">Vent max</span>
          <span className="font-mono text-seine-ink">{Math.round(mid.windKmh)} km/h</span>
        </li>
        <li className="flex justify-between rounded-lg bg-seine-bg/40 px-3 py-1.5">
          <span className="text-seine-muted">UV</span>
          <span className="font-mono text-seine-ink">{mid.uvIndex.toFixed(1)}</span>
        </li>
      </ul>

      <p className="mt-3 text-xs text-seine-muted">
        Concentre les promos et les appels à la sœur sur cette fenêtre.
      </p>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function endLabel(iso: string): string {
  const d = new Date(iso);
  d.setHours(d.getHours() + 1);
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
