import type { LucideIcon } from "lucide-react";

export function PanelHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="display-font mb-1 text-[1.6rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">{title}</h1>
        {description && <p className="mb-0 max-w-2xl text-[var(--muted)]">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "navy",
  detail,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "navy" | "terra" | "pine" | "neutral";
  detail?: string;
}) {
  const tones = {
    navy: "bg-[var(--navy-soft)] text-[var(--navy)]",
    terra: "bg-[var(--terra-soft)] text-[var(--terra)]",
    pine: "bg-[var(--pine-soft)] text-[var(--pine)]",
    neutral: "bg-[oklch(94%_0.014_110)] text-[var(--muted)]",
  };
  return (
    <article className="surface rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="mb-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">{label}</p><strong className="display-font text-[1.6rem] font-bold leading-none tabular-nums">{value}</strong>{detail && <p className="mt-1.5 mb-0 text-xs text-[var(--muted)]">{detail}</p>}</div>
        <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tones[tone]}`}><Icon size={16} aria-hidden="true" /></span>
      </div>
    </article>
  );
}
