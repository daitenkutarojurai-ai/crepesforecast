import { CircleDot } from "lucide-react";
import type { SourceStatus } from "@/lib/types";

const DOT: Record<SourceStatus["confidence"], string> = {
  live: "text-mission-ok",
  cached: "text-mission-accent",
  simulated: "text-mission-warn",
  unavailable: "text-mission-danger"
};

export function SourcesPanel({ sources }: { sources: SourceStatus[] }) {
  return (
    <section className="rounded-xl border border-mission-border bg-mission-panel/60 p-4">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-mission-muted">Data Sources · Confiance</h2>
      <ul className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2 xl:grid-cols-3">
        {sources.map((s) => (
          <li key={s.id} className="flex items-start gap-2 rounded-md border border-mission-border/60 bg-mission-panel2 px-2 py-1.5">
            <CircleDot className={`mt-0.5 h-3 w-3 ${DOT[s.confidence]}`} />
            <div className="flex flex-col">
              <span className="font-medium text-mission-ink">
                {s.label} <span className={`ml-1 uppercase tracking-[0.15em] ${DOT[s.confidence]}`}>{s.confidence}</span>
              </span>
              {s.note ? <span className="text-mission-muted">{s.note}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
