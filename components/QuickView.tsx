import { CalendarHeart, Sparkles, Waves } from "lucide-react";
import { Card, Chip } from "./Card";
import { CrepeDot, GlaceDot, SeineIllustration, SparkleFleurs } from "./Illustration";
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
  if (!top) return "Dimanche calme, rythme habituel";
  if (top.expectedBump >= 25) return "Gros pic attendu sur le quai";
  if (eventsCount >= 3) return "Quai animé, plusieurs événements";
  return "Petit bonus d'affluence prévu";
}

export function QuickView({ briefing }: { briefing: Briefing }) {
  const { weather, pivot, events, horoscope, seineLevel } = briefing;
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);
  const vibe = weatherMood(weather.precipProbPct, weather.tempC, weather.isSunny);
  const headline = topEvent(events);
  const crowd = crowdMood(headline, events.length);

  return (
    <Card
      title="Aperçu · Dimanche"
      subtitle="L'essentiel en un coup d'œil"
      icon={Sparkles}
      tone="accent"
    >
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-seine-border">
        <SeineIllustration className="h-20 w-full" />
        <SparkleFleurs className="absolute right-3 top-2 h-6 w-14" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-header/40 to-transparent p-4">
          <Icon className="h-10 w-10 text-seine-accent" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Météo
            </div>
            <div className="text-lg font-semibold text-seine-ink">
              {Math.round(weather.tempC)}° · {sky}
            </div>
            <div className="text-xs text-seine-muted">{vibe}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-chip/30 to-transparent p-4">
          {pivot.mode === "glace" ? (
            <GlaceDot className="h-12 w-12" />
          ) : (
            <CrepeDot className="h-12 w-12" />
          )}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Mode recommandé
            </div>
            <div className="text-lg font-semibold text-seine-ink">
              {pivot.mode === "glace" ? "Mode Glace" : "Mode Crêpe"}
            </div>
            <div className="text-xs text-seine-muted">
              {pivot.heatAlert ? "Sorbets et boissons fraîches en avant" : pivot.description}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-gradient-to-br from-[#f5d8b8]/50 to-transparent p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-seine-card">
            <CalendarHeart className="h-6 w-6 text-seine-crepe" />
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Événement phare
            </div>
            <div className="truncate text-lg font-semibold text-seine-ink">
              {headline ? headline.title : "Aucun événement majeur"}
            </div>
            <div className="text-xs text-seine-muted">{crowd}</div>
            {headline ? (
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Chip tone="ok">+{headline.expectedBump}% affluence</Chip>
                <Chip>{headline.distanceKm} km</Chip>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-seine-bg/40 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-seine-header text-seine-headerInk">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Ambiance de la semaine
            </div>
            <p className="text-sm font-semibold text-seine-ink">{horoscope.headline}</p>
            <p className="text-xs text-seine-muted">{horoscope.body}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-seine-border bg-seine-bg/40 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dceff7] text-[#1a3a52]">
            <Waves className="h-4 w-4" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              La Seine
            </div>
            {seineLevel ? (
              <>
                <p className="text-sm font-semibold text-seine-ink">
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
                <p className="text-sm font-semibold text-seine-ink">Niveau indisponible</p>
                <p className="text-xs text-seine-muted">Hubeau injoignable pour l'instant.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
