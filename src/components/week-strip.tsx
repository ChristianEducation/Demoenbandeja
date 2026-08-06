import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MenuDay, MenuWeek } from "@/types";

const dayAbbreviations: Record<string, string> = {
  Lunes: "LUN",
  Martes: "MAR",
  Miércoles: "MIÉ",
  Jueves: "JUE",
};

export function WeekStrip({
  weeks,
  weekIndex,
  onWeekChange,
  selectedDate,
  onSelectDate,
  renderIndicator,
  disabledLabel,
}: {
  weeks: MenuWeek[];
  weekIndex: number;
  onWeekChange: (index: number) => void;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  renderIndicator?: (day: MenuDay) => React.ReactNode;
  disabledLabel?: (day: MenuDay) => string | null;
}) {
  const week = weeks[weekIndex];

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn-quiet px-2.5"
          disabled={weekIndex === 0}
          onClick={() => onWeekChange(weekIndex - 1)}
          aria-label="Semana anterior"
        >
          <ArrowLeft size={17} />
        </button>
        <strong className="text-sm">{week.shortLabel}</strong>
        <button
          type="button"
          className="btn-quiet px-2.5"
          disabled={weekIndex === weeks.length - 1}
          onClick={() => onWeekChange(weekIndex + 1)}
          aria-label="Semana siguiente"
        >
          <ArrowRight size={17} />
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2" role="group" aria-label="Días de la semana">
        {week.days.map((day) => {
          const blockedLabel = disabledLabel?.(day) ?? null;
          const disabled = Boolean(blockedLabel);
          const active = selectedDate === day.date;
          return (
            <button
              key={day.date}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => onSelectDate(day.date)}
              className={`flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center transition-colors duration-150 ${
                active
                  ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--paper)]"
                  : disabled
                    ? "border-[var(--line)] bg-[oklch(96%_0.008_100)] text-[var(--muted)] opacity-70"
                    : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--line-accent)]"
              }`}
            >
              <span className={`text-[0.65rem] font-extrabold uppercase tracking-[0.08em] ${active ? "text-[color:var(--paper)]/75" : "text-[var(--muted)]"}`}>
                {dayAbbreviations[day.dayName] ?? day.dayName.slice(0, 3).toUpperCase()}
              </span>
              <span className="text-base font-bold tabular-nums leading-none">{Number(day.date.slice(-2))}</span>
              <span className="min-h-[0.95rem] text-[0.62rem] font-bold leading-tight">
                {blockedLabel ? (
                  <span className={active ? "text-[color:var(--paper)]/85" : "text-[var(--terra)]"}>{blockedLabel}</span>
                ) : (
                  renderIndicator?.(day)
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
