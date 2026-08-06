import { Brand, DemoBadge } from "@/components/brand";

const steps = ["Alumno", "Mi semana", "Pago", "Confirmación"];

export function PortalShell({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh pb-[max(2rem,env(safe-area-inset-bottom))]">
      <header className="border-b border-[var(--line)] bg-[color:var(--cream)]/90 px-4 py-3.5 backdrop-blur-sm sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Brand />
          <DemoBadge />
        </div>
      </header>
      <div className="border-b border-[var(--line)] bg-[var(--paper)] px-4 sm:px-6">
        <ol className="mx-auto flex max-w-2xl items-center justify-between py-2.5" aria-label="Progreso de reserva">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = number === step;
            const completed = number < step;
            return (
              <li key={label} className="flex items-center gap-2 text-xs font-bold" aria-current={active ? "step" : undefined}>
                <span
                  className={`grid size-6 place-items-center rounded-full border text-[0.65rem] tabular-nums ${
                    active
                      ? "border-[var(--navy)] bg-[var(--navy)] text-[var(--paper)]"
                      : completed
                        ? "border-[var(--pine)] bg-[var(--pine-soft)] text-[var(--pine)]"
                        : "border-[var(--line)] text-[var(--muted)]"
                  }`}
                >
                  {number}
                </span>
                <span className={`${active ? "text-[var(--ink)]" : "text-[var(--muted)]"} hidden sm:inline`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
      <main id="contenido-principal" className="page-enter mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        {children}
      </main>
    </div>
  );
}
