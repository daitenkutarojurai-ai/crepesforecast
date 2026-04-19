import type { LucideIcon } from "lucide-react";

export function ArcGauge({
  value,
  min = 0,
  max = 25,
  segments,
  label,
  sublabel,
  icon: Icon
}: {
  value: number;
  min?: number;
  max?: number;
  segments: Array<{ to: number; color: string }>;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
}) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min);
  const angle = -180 + ratio * 180;
  const cx = 60;
  const cy = 56;
  const r = 44;
  const polar = (a: number) => {
    const rad = (a * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arcs = buildArcs(segments, min, max, cx, cy, r);
  const needleEnd = polar(angle);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="h-20 w-32">
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.d}
            stroke={a.color}
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <line
          x1={cx}
          y1={cy}
          x2={needleEnd.x}
          y2={needleEnd.y}
          stroke="#1f2a3a"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={3.5} fill="#1f2a3a" />
      </svg>
      <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-seine-ink">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </div>
      {sublabel ? (
        <div className="text-[11px] text-seine-muted">{sublabel}</div>
      ) : null}
    </div>
  );
}

function buildArcs(
  segments: Array<{ to: number; color: string }>,
  min: number,
  max: number,
  cx: number,
  cy: number,
  r: number
) {
  const range = max - min;
  let prev = min;
  return segments.map((seg) => {
    const startA = -180 + ((prev - min) / range) * 180;
    const endA = -180 + ((seg.to - min) / range) * 180;
    prev = seg.to;
    const start = polar(startA, cx, cy, r);
    const end = polar(endA, cx, cy, r);
    const largeArc = endA - startA > 180 ? 1 : 0;
    return {
      color: seg.color,
      d: `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
    };
  });
}

function polar(a: number, cx: number, cy: number, r: number) {
  const rad = (a * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function LinearGauge({
  value,
  max = 100,
  color = "bg-seine-accent",
  label,
  sublabel
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <div className="flex items-center justify-between text-[11px] font-medium text-seine-muted">
          <span>{label}</span>
          {sublabel ? <span className="text-seine-ink">{sublabel}</span> : null}
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-seine-bg">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PivotSlider({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, ((value + 3) / 6) * 100));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-seine-muted">
        <span>🥞 Crêpe</span>
        <span>Glace 🍦</span>
      </div>
      <div className="relative mt-1 h-2 rounded-full bg-gradient-to-r from-seine-crepe via-seine-bg to-seine-glace">
        <div
          className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-seine-accent shadow"
          style={{ left: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
