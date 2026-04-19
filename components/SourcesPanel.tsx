import { CircleDot } from "lucide-react";
import type { SourceStatus } from "@/lib/types";

const DOT: Record<SourceStatus["confidence"], string> = {
  live: "text-seine-ok",
  cached: "text-seine-accent",
  simulated: "text-seine-warn",
  unavailable: "text-seine-danger"
};

const LABEL: Record<SourceStatus["confidence"], string> = {
  live: "live",
  cached: "cache",
  simulated: "simulé",
  unavailable: "indispo."
};

export function SourcesPanel({ sources }: { sources: SourceStatus[] }) {
  return (
    <section className="rounded-2xl border border-seine-border bg-seine-card p-4 shadow-card">
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-seine-muted">
        Sources · Confiance des données
      </h2>
      <ul className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2 xl:grid-cols-3">
        {sources.map((s) => (
          <li
            key={s.id}
            className="flex items-start gap-2 rounded-xl border border-seine-border bg-seine-bg/40 px-2.5 py-2"
          >
            <CircleDot className={`mt-0.5 h-3 w-3 ${DOT[s.confidence]}`} />
            <div className="flex flex-col">
              <span className="font-medium text-seine-ink">
                {s.label}
                <span className={`ml-1.5 text-[10px] uppercase tracking-[0.14em] ${DOT[s.confidence]}`}>
                  {LABEL[s.confidence]}
                </span>
              </span>
              {s.note ? <span className="text-seine-muted">{s.note}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
