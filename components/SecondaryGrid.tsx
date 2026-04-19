import { Bike, Calendar, Droplets, Flower2, Hash, Leaf, Sparkles, Store, TrendingUp } from "lucide-react";
import { Panel } from "./Panel";
import type { Briefing } from "@/lib/types";

export function SecondaryGrid({ briefing }: { briefing: Briefing }) {
  const { horoscope, napkinForecast, lycraCoefficient, poussetteFactor, nutellaIndex, socialSentiment, competitorProxy, events } = briefing;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Panel title="Celestial Sales" subtitle={horoscope.headline} icon={<Sparkles className="h-4 w-4" />} tone={horoscope.roadblock ? "warn" : "default"}>
        <p className="text-sm text-mission-ink">{horoscope.body}</p>
      </Panel>

      <Panel title="Agenda local" subtitle={`${events.length} événement(s) dans le rayon 2 km`} icon={<Calendar className="h-4 w-4" />}>
        <ul className="space-y-1 text-sm">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-2">
              <span className="truncate">
                <span className="font-medium text-mission-ink">{e.title}</span>
                <span className="ml-2 text-xs text-mission-muted">{e.distanceKm} km</span>
              </span>
              <span className="font-mono text-xs text-mission-ok">+{e.expectedBump}%</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Social · #QuaiDeSeine" subtitle={`Spike +${socialSentiment.spikePct}%`} icon={<Hash className="h-4 w-4" />}>
        <p className="text-sm">{socialSentiment.note}</p>
      </Panel>

      <Panel title="Concurrence proche" subtitle={competitorProxy.status === "busier" ? "Busier than usual" : competitorProxy.status} icon={<Store className="h-4 w-4" />} tone={competitorProxy.status === "busier" ? "warn" : "default"}>
        <p className="text-sm">{competitorProxy.note}</p>
      </Panel>

      <Panel title="Nutella Index" subtitle={nutellaIndex.level} icon={<TrendingUp className="h-4 w-4" />}>
        <p className="text-sm">{nutellaIndex.note}</p>
      </Panel>

      <Panel title="Lycra Coefficient" subtitle={`${lycraCoefficient.coefficient} · EuroVelo 3`} icon={<Bike className="h-4 w-4" />}>
        <p className="text-sm">{lycraCoefficient.note}</p>
      </Panel>

      <Panel title="Poussette Factor" subtitle={`Densité ${poussetteFactor.density}`} icon={<Flower2 className="h-4 w-4" />}>
        <p className="text-sm">{poussetteFactor.note}</p>
        <p className="mt-1 text-xs text-mission-muted">Fenêtre : {poussetteFactor.window}</p>
      </Panel>

      <Panel title="Napkin Forecast" subtitle={`Pollen ${napkinForecast.risk}`} icon={<Leaf className="h-4 w-4" />}>
        <p className="text-sm">{napkinForecast.recommendation}</p>
      </Panel>

      <Panel title="Vigicrues · Seine" subtitle={briefing.sources.find((s) => s.id === "vigicrues")?.confidence === "live" ? "Débit mesuré" : "Débit estimé"} icon={<Droplets className="h-4 w-4" />}>
        <p className="text-sm">
          Flux élevé → trafic piéton rebasculé sur la route haute (devant la caravane). Surveille les mariniers qui descendent acheter.
        </p>
      </Panel>
    </div>
  );
}
