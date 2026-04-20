import type { LucideIcon } from "lucide-react";

type Tone = "default" | "accent" | "warn" | "danger" | "ok" | "peach" | "sage" | "rose" | "cream";

const TONE_HEADER: Record<Tone, string> = {
  default: "bg-seine-header text-seine-headerInk",
  accent: "bg-seine-header text-seine-headerInk",
  warn: "bg-seine-peach text-seine-peachInk",
  danger: "bg-seine-rose text-seine-roseInk",
  ok: "bg-seine-chip text-seine-chipInk",
  peach: "bg-seine-peach text-seine-peachInk",
  sage: "bg-seine-sage text-seine-sageInk",
  rose: "bg-seine-rose text-seine-roseInk",
  cream: "bg-seine-cream text-seine-creamInk"
};

export function Card({
  title,
  subtitle,
  icon: Icon,
  tone = "default",
  children,
  footer,
  className = ""
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  tone?: Tone;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-2xl border border-seine-border bg-seine-card shadow-card ${className}`}
    >
      <header className={`flex items-center gap-2 px-4 py-2.5 ${TONE_HEADER[tone]}`}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        {subtitle ? (
          <span className="ml-auto text-xs font-medium opacity-80">{subtitle}</span>
        ) : null}
      </header>
      <div className="flex-1 px-4 py-4">{children}</div>
      {footer ? (
        <footer className="border-t border-seine-border bg-seine-bg/50 px-4 py-2 text-xs text-seine-muted">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

export function Chip({
  children,
  tone = "default"
}: {
  children: React.ReactNode;
  tone?: "default" | "ok" | "warn" | "danger" | "accent";
}) {
  const cls: Record<string, string> = {
    default: "bg-seine-bg text-seine-ink border-seine-border",
    ok: "bg-seine-chip text-seine-chipInk border-seine-chip",
    warn: "bg-[#f7e6cc] text-[#7a4b10] border-[#f0d9ad]",
    danger: "bg-[#f7d5d5] text-[#7a2a2a] border-[#f0b9b9]",
    accent: "bg-seine-header text-seine-headerInk border-seine-header"
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${cls[tone]}`}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  unit,
  hint
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-seine-muted">
        {label}
      </span>
      <span className="flex items-baseline gap-1 font-mono text-xl font-semibold text-seine-ink">
        {value}
        {unit ? <span className="text-xs font-normal text-seine-muted">{unit}</span> : null}
      </span>
      {hint ? <span className="text-xs text-seine-muted">{hint}</span> : null}
    </div>
  );
}
