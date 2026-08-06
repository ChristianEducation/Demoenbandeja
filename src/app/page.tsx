import Link from "next/link";
import { ArrowRight, UsersRound, UtensilsCrossed } from "lucide-react";
import { Brand, DemoBadge } from "@/components/brand";

const access = [
  {
    id: "apoderados",
    label: "APODERADOS",
    title: "Reservar almuerzo",
    icon: UsersRound,
    href: "/apoderado",
  },
  {
    id: "casino",
    label: "CASINO",
    title: "Gestión diaria",
    icon: UtensilsCrossed,
    href: "/panel",
  },
];

export default function HomePage() {
  return (
    <main id="contenido-principal" className="grid min-h-dvh place-items-center bg-[var(--paper)] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <header className="flex items-center justify-between gap-4">
          <Brand />
          <DemoBadge />
        </header>

        <h1 className="display-font mt-9 text-[1.85rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[2.05rem]">
          Una forma más simple de gestionar los almuerzos
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Reservas, pagos y listado diario reunidos en un mismo flujo.
        </p>

        <nav className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]" aria-label="Acceso a la plataforma">
          {access.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group grid grid-cols-[2.5rem_1fr_1.25rem] items-center gap-4 py-5 text-[var(--ink)] no-underline transition-colors hover:text-[var(--navy)]"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--navy-soft)] text-[var(--navy)] transition-transform duration-200 group-hover:-rotate-3">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span>
                  <small className="mb-0.5 block text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-[var(--terra)]">
                    {item.label}
                  </small>
                  <strong className="block text-base font-extrabold">{item.title}</strong>
                </span>
                <ArrowRight size={18} className="text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--navy)]" aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <p className="mt-7 text-center text-xs font-semibold text-[var(--muted)]">
          Reserva · Pago · Listado diario
        </p>
      </div>
    </main>
  );
}
