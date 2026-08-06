"use client";

import Link from "next/link";
import { ArrowRight, Check, House, PartyPopper, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { PortalShell } from "@/components/portal-shell";
import { students } from "@/data/demo-data";
import { formatCLP, formatLongDate } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

export default function ConfirmationPage() {
  const { lastOrderId, orders } = useDemo();
  const order = orders.find((item) => item.id === lastOrderId);
  const student = students.find((item) => item.id === order?.studentId);

  if (!order || !student) {
    return <PortalShell step={4}><FlowGuard title="No hay una compra reciente" description="Completa un pedido para ver su confirmación." /></PortalShell>;
  }

  const lunchDates = [...new Set(order.lunchItems.map((item) => item.date))].sort();
  const cafeteriaByDate = [...new Set(order.cafeteriaItems.map((item) => item.date))]
    .sort()
    .map((date) => ({ date, items: order.cafeteriaItems.filter((item) => item.date === date) }));

  return (
    <PortalShell step={4}>
      <div className="mx-auto max-w-2xl text-center">
        <div className="relative mx-auto grid size-16 place-items-center rounded-full bg-[var(--navy)] text-[var(--paper)] shadow-[0_12px_32px_oklch(33%_0.06_258/0.28)]">
          <Check size={30} strokeWidth={2.4} aria-hidden="true" />
          <PartyPopper className="absolute -right-3 -top-1.5 text-[var(--terra)]" size={20} aria-hidden="true" />
        </div>
        <span className="eyebrow mt-5">✓ Pedido confirmado</span>
        <h1 className="display-font mt-2 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">Pago confirmado</h1>
        <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">El pedido de <strong className="text-[var(--ink)]">{student.name}</strong> quedó confirmado correctamente.</p>

        <section className="surface mt-7 rounded-2xl p-4 text-left sm:p-6" aria-label="Detalle del pedido">
          <div className="flex flex-col gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="mb-0.5 text-base font-extrabold">{student.name}</h2><p className="mb-0 text-sm text-[var(--muted)]">{student.course}</p></div>
            <div className="sm:text-right"><p className="mb-0.5 text-xs font-bold text-[var(--muted)]">Total pagado</p><strong className="text-lg tabular-nums">{formatCLP(order.total)}</strong></div>
          </div>

          {lunchDates.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><UtensilsCrossed size={13} /> Almuerzos</p>
              <ul className="grid grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                {lunchDates.map((date) => (
                  <li key={date} className="flex items-center gap-2.5 rounded-lg bg-[var(--navy-soft)] px-3 py-2.5 text-sm font-bold">
                    <Check size={16} className="text-[var(--navy)]" /> {formatLongDate(date)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cafeteriaByDate.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><ShoppingBag size={13} /> Cafetería</p>
              <div className="grid grid-cols-1 gap-2">
                {cafeteriaByDate.map(({ date, items }) => (
                  <div key={date} className="rounded-lg bg-[var(--terra-soft)] px-3 py-2.5">
                    <p className="mb-1 text-xs font-bold text-[var(--terra)]">{formatLongDate(date)}</p>
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between gap-3 text-sm font-bold">
                        <span>{item.productName} ×{item.quantity}</span>
                        <span className="tabular-nums">{formatCLP(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link href="/panel" className="btn-primary">Ver operación en Casino <ArrowRight size={17} /></Link>
          <Link href="/" className="btn-secondary"><House size={17} /> Volver al inicio</Link>
        </div>
        <p className="mt-4 text-sm text-[var(--muted)]">El pedido ya está disponible para el equipo del casino.</p>
      </div>
    </PortalShell>
  );
}
