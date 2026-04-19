"use client";

import { Cookie, IceCreamCone } from "lucide-react";
import type { Mode } from "@/lib/types";

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-mission-border bg-mission-panel p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onChange("crepe")}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          mode === "crepe"
            ? "bg-mission-crepe/15 text-mission-crepe ring-1 ring-mission-crepe/40"
            : "text-mission-muted hover:text-mission-ink"
        }`}
        aria-pressed={mode === "crepe"}
      >
        <Cookie className="h-4 w-4" /> Crepe
      </button>
      <button
        type="button"
        onClick={() => onChange("glace")}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
          mode === "glace"
            ? "bg-mission-glace/15 text-mission-glace ring-1 ring-mission-glace/40"
            : "text-mission-muted hover:text-mission-ink"
        }`}
        aria-pressed={mode === "glace"}
      >
        <IceCreamCone className="h-4 w-4" /> Glace
      </button>
    </div>
  );
}
