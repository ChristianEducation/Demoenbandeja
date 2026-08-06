import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  quantity,
  onChange,
  label,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-1">
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md text-[var(--navy)] transition-colors hover:bg-[var(--navy-soft)]"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        aria-label={`Quitar ${label}`}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-5 text-center text-sm font-extrabold tabular-nums">{quantity}</span>
      <button
        type="button"
        className="grid size-7 place-items-center rounded-md text-[var(--navy)] transition-colors hover:bg-[var(--navy-soft)]"
        onClick={() => onChange(quantity + 1)}
        aria-label={`Agregar ${label}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
