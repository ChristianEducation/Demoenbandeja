"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, CreditCard, LoaderCircle, LockKeyhole } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { PortalShell } from "@/components/portal-shell";
import { students } from "@/data/demo-data";
import { formatCLP } from "@/lib/format";
import { buildCafeteriaItems, buildLunchItems, buildOrderSummary, computeLunchGroups, summaryTotal } from "@/lib/pricing";
import { useDemo } from "@/store/demo-store";

export default function PaymentPage() {
  const router = useRouter();
  const { selectedStudentId, cart, menus, config, cafeteriaProducts, confirmPurchase } = useDemo();
  const [processing, setProcessing] = useState(false);
  const student = students.find((item) => item.id === selectedStudentId);
  const itemCount = cart.lunchDates.length + cart.cafeteria.reduce((sum, line) => sum + line.quantity, 0);

  if (!student || itemCount === 0) {
    return (
      <PortalShell step={3}>
        <FlowGuard title="Tu pedido aún está vacío" description="Selecciona un estudiante y agrega almuerzo o cafetería antes de pagar." />
      </PortalShell>
    );
  }

  const lunchGroups = computeLunchGroups(cart.lunchDates, menus, config);
  const lunchItemsPreview = buildLunchItems(lunchGroups, "online");
  const cafeteriaItemsPreview = buildCafeteriaItems(cart.cafeteria, cafeteriaProducts);
  const summaryBlocks = buildOrderSummary(lunchItemsPreview, cafeteriaItemsPreview, menus);
  const total = summaryTotal(summaryBlocks);

  const pay = () => {
    if (processing) return;
    setProcessing(true);
    window.setTimeout(() => {
      confirmPurchase(student.id);
      router.push("/apoderado/confirmacion");
    }, 1100);
  };

  return (
    <PortalShell step={3}>
      <div className="mx-auto grid grid-cols-1 max-w-4xl items-start gap-6 lg:grid-cols-[1fr_21rem]">
        <section>
          <span className="eyebrow"><CreditCard size={14} /> Pago simulado</span>
          <h1 className="display-font mt-2 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">Revisa tu pedido</h1>
          <p className="mt-3 max-w-lg text-[var(--muted)]">Confirma que los datos estén correctos. Esta demostración no solicita información bancaria ni utiliza una pasarela real.</p>

          <div className="surface mt-6 overflow-hidden rounded-2xl">
            <div className="flex items-start gap-3 border-b border-[var(--line)] p-4 sm:p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--navy-soft)] text-[var(--navy)]"><CheckCircle2 size={19} /></span>
              <div><p className="mb-0.5 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">Estudiante</p><h2 className="mb-0.5 text-base font-extrabold">{student.name}</h2><p className="mb-0 text-sm text-[var(--muted)]">{student.course}</p></div>
            </div>
            <div className="grid grid-cols-1 gap-5 p-4 sm:p-5">
              {summaryBlocks.map((block) => (
                <div key={block.weekId}>
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--muted)]">{block.weekLabel}</p>
                  {block.weeklyLine && (
                    <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-[var(--pine-soft)] px-3 py-2 text-sm">
                      <span className="font-bold text-[var(--pine)]">{block.weeklyLine.label}</span>
                      <span className="tabular-nums font-bold">{formatCLP(block.weeklyLine.amount)}</span>
                    </div>
                  )}
                  {block.dateBlocks.map((dateBlock) => (
                    <div key={dateBlock.date} className="mb-2 border-b border-[var(--line)] pb-2 last:mb-0 last:border-0 last:pb-0">
                      <p className="mb-1 text-xs font-bold text-[var(--muted)]">{dateBlock.dayLabel}</p>
                      {dateBlock.lines.map((line, index) => (
                        <div key={index} className="flex items-center justify-between gap-4 text-sm">
                          <span className="font-bold">{line.label}</span>
                          <span className="tabular-nums text-[var(--muted)]">{formatCLP(line.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Link href="/apoderado/reserva" className="btn-quiet mt-3 -ml-3"><ArrowLeft size={16} /> Editar pedido</Link>
        </section>

        <aside className="rounded-2xl bg-[var(--navy-dark)] p-5 text-[var(--paper)] shadow-[var(--shadow-lg)] lg:sticky lg:top-5">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[color:var(--paper)]/60">Resumen del pago</p>
          <div className="my-1 h-px bg-[color:var(--paper)]/15" />
          <div className="mt-4 flex items-end justify-between gap-4"><span className="font-bold">Total</span><strong className="display-font text-2xl font-bold tabular-nums">{formatCLP(total)}</strong></div>
          <button type="button" className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--paper)] px-4 font-extrabold text-[var(--navy-dark)] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-85" disabled={processing} onClick={pay}>
            {processing ? <><LoaderCircle size={19} className="animate-spin" /> Confirmando pedido...</> : <><LockKeyhole size={17} /> Pagar {formatCLP(total)}</>}
          </button>
          <p className="mt-3 mb-0 flex items-center justify-center gap-2 text-center text-xs text-[color:var(--paper)]/60"><CreditCard size={13} /> Simulación segura · Sin cobro real</p>
        </aside>
      </div>
    </PortalShell>
  );
}
