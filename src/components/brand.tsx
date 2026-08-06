import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5 no-underline" aria-label="Casino Enbandeja, inicio">
      <span className="grid size-9 place-items-center rounded-[0.75rem] bg-[var(--navy)] text-[var(--paper)] shadow-sm transition-transform duration-200 group-hover:-rotate-3">
        <UtensilsCrossed size={18} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="leading-none">
        <span className="display-font block text-[1.05rem] font-bold tracking-[-0.02em] text-[var(--ink)]">
          Casino Enbandeja
        </span>
        {!compact && (
          <span className="mt-0.5 block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[var(--pine)]">
            De la cocina a la mesa
          </span>
        )}
      </span>
    </Link>
  );
}

export function DemoBadge() {
  return <span className="demo-badge">Demo referencial</span>;
}
