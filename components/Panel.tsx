import type { ReactNode } from "react";

export function Panel({
  title,
  subtitle,
  icon,
  tone = "default",
  children,
  footer
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: "default" | "primary" | "warn" | "danger";
  children: ReactNode;
  footer?: ReactNode;
}) {
  const ring =
    tone === "primary"
      ? "border-mission-accent/40 shadow-glow"
      : tone === "warn"
        ? "border-mission-warn/40"
        : tone === "danger"
          ? "border-mission-danger/40 shadow-danger"
          : "border-mission-border";
  return (
    <section className={`relative rounded-xl border ${ring} bg-mission-panel/80 backdrop-blur-sm`}>
      <header className="flex items-start justify-between gap-3 border-b border-mission-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon ? <span className="text-mission-muted">{icon}</span> : null}
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mission-muted">{title}</h2>
            {subtitle ? <p className="text-sm font-medium text-mission-ink">{subtitle}</p> : null}
          </div>
        </div>
      </header>
      <div className="px-4 py-3 text-sm leading-relaxed">{children}</div>
      {footer ? <div className="border-t border-mission-border/60 px-4 py-2 text-xs text-mission-muted">{footer}</div> : null}
    </section>
  );
}

export function Stat({ label, value, unit, hint }: { label: string; value: string | number; unit?: string; hint?: ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-[0.2em] text-mission-muted">{label}</span>
      <span className="font-mono text-2xl font-semibold text-mission-ink">
        {value}
        {unit ? <span className="ml-1 text-sm text-mission-muted">{unit}</span> : null}
      </span>
      {hint ? <span className="text-xs text-mission-muted">{hint}</span> : null}
    </div>
  );
}
