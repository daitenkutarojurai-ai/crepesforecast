"use client";

import { Cookie, IceCreamCone } from "lucide-react";
import type { Mode } from "@/lib/types";

export function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-seine-border bg-seine-card p-1 shadow-inner">
      <button
        type="button"
        onClick={() => onChange("crepe")}
        aria-pressed={mode === "crepe"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
          mode === "crepe"
            ? "bg-seine-accent text-white shadow"
            : "text-seine-muted hover:text-seine-ink"
        }`}
      >
        <Cookie className="h-3.5 w-3.5" />
        Crêpe
      </button>
      <button
        type="button"
        onClick={() => onChange("glace")}
        aria-pressed={mode === "glace"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
          mode === "glace"
            ? "bg-seine-accent text-white shadow"
            : "text-seine-muted hover:text-seine-ink"
        }`}
      >
        <IceCreamCone className="h-3.5 w-3.5" />
        Glace
      </button>
    </div>
  );
}
