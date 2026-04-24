import { CalendarHeart, ChefHat, ExternalLink, Flower2, Sparkles, Stars, Waves } from "lucide-react";
import { Banner } from "./Banner";
import { Card, Chip } from "./Card";
import { describeSky, pickWeatherIcon } from "@/lib/weather-icon";
import type { Briefing, LocalEvent } from "@/lib/types";

function weatherMood(precip: number, temp: number, isSunny: boolean): string {
  if (precip > 60) return "Temps maussade, clientèle clairsemée";
  if (precip > 35) return "Risque d'averses, prévois l'abri";
  if (isSunny && temp >= 24) return "Belle journée ensoleillée, terrasse pleine";
  if (isSunny) return "Soleil doux, ambiance balade";
  if (temp < 12) return "Frais, grands-parents en cardigan";
  return "Ciel mitigé, affluence stable";
}

function topEvent(events: LocalEvent[]): LocalEvent | undefined {
  return events.slice().sort((a, b) => b.expectedBump - a.expectedBump)[0];
}

function crowdMood(top: LocalEvent | undefined, eventsCount: number): string {
  if (!top) return "Journée calme, rythme habituel";
  if (top.expectedBump >= 25) return "Gros pic attendu sur le quai";
  if (eventsCount >= 3) return "Quai animé, plusieurs événements";
  return "Petit bonus d'affluence prévu";
}

const POLLEN_STYLES = {
  low: { tint: "bg-seine-chip/50", dot: "bg-seine-ok", label: "bas" },
  moderate: { tint: "bg-[#f7e6cc]/60", dot: "bg-seine-warn", label: "modéré" },
  high: { tint: "bg-[#f7d5d5]/60", dot: "bg-seine-danger", label: "élevé" }
} as const;

export function QuickView({ briefing }: { briefing: Briefing }) {
  const { weather, hourly, events, horoscope, seineLevel, pollen, recommendation, targetLabel, targetHolidayName } = briefing;
  const pollenStyle = POLLEN_STYLES[pollen.level];
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);
  const vibe = weatherMood(weather.precipProbPct, weather.tempC, weather.isSunny);
  const headline = topEvent(events);
  const crowd = crowdMood(headline, events.length);
  const displayLabel = targetLabel
    ? targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)
    : "Aperçu";
  const shiftTemps = hourly
    .filter((h) => {
      const hr = new Date(h.time).getHours();
      return hr >= 14 && hr < 19;
    })
    .map((h) => h.tempC);
  const minT = shiftTemps.length ? Math.min(...shiftTemps) : weather.tempC;
  const maxT = shiftTemps.length ? Math.max(...shiftTemps) : weather.tempC;
  const tempDisplay =
    Math.round(minT) === Math.round(maxT)
      ? `${weather.tempC.toFixed(1).replace(".", ",")}°`
      : `${Math.round(minT)}–${Math.round(maxT)}°`;

  return (
    <Card
      title={`Aperçu · ${displayLabel}`}
      subtitle={targetHolidayName ? `Férié · service 14h–19h` : "Service 14h–19h"}
      icon={Sparkles}
      tone="accent"
    >
      <Banner className="mb-4 aspect-[16/6] w-full" />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-peach/70 via-seine-peach/30 to-transparent p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/60 shadow-sm">
            <Icon className="h-7 w-7 text-seine-accent" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              Météo
            </div>
            <div className="text-lg font-extrabold text-seine-ink">
              {tempDisplay} · {sky}
            </div>
            <div className="text-xs font-medium text-seine-muted">{vibe}</div>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-sage/50 via-seine-sage/20 to-transparent p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/60 shadow-sm">
            <CalendarHeart className="h-6 w-6 text-seine-crepe" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              Événement phare
            </div>
            <div className="truncate text-base font-extrabold text-seine-ink">
              {headline ? headline.title : "Pas d'événement majeur ce jour"}
            </div>
            <div className="text-xs font-medium text-seine-muted">{crowd}</div>
            {headline ? (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip tone="ok">+{headline.expectedBump}% affluence</Chip>
                <Chip>{headline.distanceKm} km</Chip>
                {headline.sourceUrl ? (
                  <a
                    href={headline.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[32px] cursor-pointer items-center gap-1 rounded-full border border-seine-accent/40 bg-seine-header px-2.5 py-1 text-xs font-semibold text-seine-headerInk transition-colors duration-150 hover:bg-seine-accent/90 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {headline.sourceLabel ?? "Voir la source"}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-chip/50 via-seine-chip/20 to-transparent p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 shadow-sm text-seine-crepe">
            <ChefHat className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              Carte du jour · à mettre en avant
            </div>
            <p className="text-sm font-bold text-seine-ink">
              {recommendation.menuSpotlight.hero}
            </p>
            <p className="text-xs text-seine-muted">{recommendation.menuSpotlight.combo}</p>
            {recommendation.menuSpotlight.avoid ? (
              <p className="mt-1 text-[11px] italic text-seine-muted">
                À retirer : {recommendation.menuSpotlight.avoid}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-peach/40 to-seine-bg/20 p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-seine-peach shadow-sm text-seine-peachInk">
            <Stars className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              Horoscope · clientèle
            </div>
            <p className="text-sm font-bold text-seine-ink">{horoscope.headline}</p>
            <p className="text-xs text-seine-muted">{horoscope.body}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-sage/40 to-seine-bg/20 p-3.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-seine-sage shadow-sm text-seine-sageInk">
            <Waves className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              La Seine
            </div>
            {seineLevel ? (
              <>
                <p className="text-sm font-bold text-seine-ink">
                  {seineLevel.heightM.toFixed(2)} m ·{" "}
                  {seineLevel.mood === "haut"
                    ? "haute"
                    : seineLevel.mood === "surveillé"
                      ? "surveillée"
                      : "calme"}
                </p>
                <p className="text-xs text-seine-muted">{seineLevel.note}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-seine-ink">Niveau indisponible</p>
                <p className="text-xs text-seine-muted">Hubeau injoignable pour l'instant.</p>
              </>
            )}
          </div>
        </div>

        <div className={`flex items-start gap-3 rounded-2xl border border-seine-border ${pollenStyle.tint} p-3.5`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/70 shadow-sm text-seine-crepe">
            <Flower2 className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-seine-muted">
              Pollen · serviettes
            </div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-seine-ink">
              <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${pollenStyle.dot}`} aria-hidden />
              {pollen.dominant} · {pollenStyle.label}
            </p>
            <p className="text-xs text-seine-muted">{pollen.note}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
