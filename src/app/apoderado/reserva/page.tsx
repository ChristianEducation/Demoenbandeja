"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Leaf } from "lucide-react";
import { FlowGuard } from "@/components/flow-guard";
import { PortalShell } from "@/components/portal-shell";
import { QuantityStepper } from "@/components/quantity-stepper";
import { WeekStrip } from "@/components/week-strip";
import { DEMO_TODAY, cafeteriaCategoryLabels, students } from "@/data/demo-data";
import { bookingBlockReason } from "@/lib/booking";
import { formatCLP, formatLongDate } from "@/lib/format";
import {
  buildCafeteriaItems,
  buildLunchItems,
  buildOrderSummary,
  computeLunchGroups,
  historicalLunchDates,
  summaryTotal,
} from "@/lib/pricing";
import { useDemo } from "@/store/demo-store";
import type { CafeteriaCategory } from "@/types";

const categories: (CafeteriaCategory | "all")[] = ["all", "sandwiches", "snacks", "horneados", "bebestibles"];

export default function WeekAgendaPage() {
  const {
    selectedStudentId,
    selectedWeekIndex,
    cart,
    orders,
    menus,
    config,
    cafeteriaProducts,
    selectWeek,
    toggleLunch,
    reserveFullWeek,
    setCafeteriaQuantity,
  } = useDemo();
  const student = students.find((item) => item.id === selectedStudentId);
  const week = menus[selectedWeekIndex];
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [category, setCategory] = useState<CafeteriaCategory | "all">("all");

  useEffect(() => {
    setSelectedDate(week.days[0]?.date ?? null);
  }, [week]);

  if (!student) return <PortalShell step={2}><FlowGuard /></PortalShell>;

  const reservedDates = historicalLunchDates(orders, student.id);
  const tileBlock = (date: string) => bookingBlockReason(date, DEMO_TODAY, config);
  const day = week.days.find((item) => item.date === selectedDate) ?? week.days[0];

  const weekDates = week.days.map((item) => item.date);
  const weekBlockedAny = weekDates.some((date) => tileBlock(date) !== null);
  const weekHistoricalAny = weekDates.some((date) => reservedDates.has(date));
  const selectedInWeekCount = weekDates.filter((date) => cart.lunchDates.includes(date)).length;
  const showFullWeekButton = !weekBlockedAny && !weekHistoricalAny && selectedInWeekCount < 4;
  const isFullWeek = selectedInWeekCount === 4;

  const lunchGroups = computeLunchGroups(cart.lunchDates, menus, config);
  const lunchItemsPreview = buildLunchItems(lunchGroups, "online");
  const cafeteriaItemsPreview = buildCafeteriaItems(cart.cafeteria, cafeteriaProducts);
  const summaryBlocks = buildOrderSummary(lunchItemsPreview, cafeteriaItemsPreview, menus);
  const total = summaryTotal(summaryBlocks);
  const itemCount = cart.lunchDates.length + cart.cafeteria.reduce((sum, line) => sum + line.quantity, 0);

  const dayBlock = tileBlock(day.date);
  const hasHistoricalLunch = reservedDates.has(day.date);
  const lunchInCart = cart.lunchDates.includes(day.date);

  return (
    <PortalShell step={2}>
      <div className={itemCount > 0 ? "pb-24 lg:pb-0" : ""}>
        <div className="mb-5">
          <span className="eyebrow">Mi semana</span>
          <h1 className="display-font mt-2 text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">
            ¿Qué necesita {student.name.split(" ")[0]} esta semana?
          </h1>
          <p className="mt-2 mb-0 text-sm text-[var(--muted)]">{student.name} · {student.course}</p>
        </div>

        <div className="surface mb-5 rounded-2xl p-4">
          <WeekStrip
            weeks={menus}
            weekIndex={selectedWeekIndex}
            onWeekChange={selectWeek}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            disabledLabel={(item) => (tileBlock(item.date) ? "Cerrado" : null)}
            renderIndicator={(item) => {
              const hasLunch = cart.lunchDates.includes(item.date) || reservedDates.has(item.date);
              const cafeCount = cart.cafeteria
                .filter((line) => line.date === item.date)
                .reduce((sum, line) => sum + line.quantity, 0);
              if (!hasLunch && cafeCount === 0) return null;
              return (
                <span className="flex flex-col items-center gap-0.5">
                  {hasLunch && (
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[var(--pine)]" aria-hidden="true" /> Almuerzo
                    </span>
                  )}
                  {cafeCount > 0 && <span>{cafeCount} café</span>}
                </span>
              );
            }}
          />

          {showFullWeekButton && (
            <div className="mt-3 rounded-xl bg-[var(--navy-soft)] p-3.5">
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => reserveFullWeek(weekDates)}>
                Reservar semana completa
              </button>
              <p className="mt-2 mb-0 text-xs text-[var(--navy-dark)]">
                Agrega los almuerzos de lunes a jueves y aplica automáticamente la tarifa semanal.
              </p>
            </div>
          )}
          {!weekBlockedAny && !weekHistoricalAny && selectedInWeekCount === 3 && (
            <p className="mt-3 mb-0 text-xs font-bold text-[var(--terra)]" aria-live="polite">
              Agrega 1 almuerzo más y se aplicará la tarifa semanal.
            </p>
          )}
          {isFullWeek && (
            <p className="mt-3 mb-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--pine)]" aria-live="polite">
              <Check size={14} /> Tarifa semanal aplicada
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_20rem]">
          <section>
            <div className="surface rounded-2xl p-4 sm:p-5">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
                Almuerzo de {formatLongDate(day.date)}
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-bold text-[var(--muted)]">Principal</p>
                  <p className="mb-0 font-bold">{day.main}</p>
                </div>
                <div>
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[var(--pine)]"><Leaf size={13} aria-hidden="true" /> Alternativa vegetariana</p>
                  <p className="mb-0 font-bold">{day.vegetarian}</p>
                </div>
              </div>
              <p className="mt-3 mb-0 text-sm text-[var(--muted)]">Incluye {[...day.sides, day.dessert].join(" · ")}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
                <strong className="tabular-nums">{formatCLP(config.dailyLunchPrice)}</strong>
                {hasHistoricalLunch ? (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[var(--pine-soft)] px-3 text-sm font-extrabold text-[var(--pine)]">
                    <Check size={16} /> Ya reservado
                  </span>
                ) : dayBlock ? (
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[oklch(96%_0.008_100)] px-3 text-sm font-extrabold text-[var(--muted)]">
                    <Clock3 size={16} /> Cerrado
                  </span>
                ) : (
                  <button type="button" className={lunchInCart ? "btn-secondary" : "btn-primary"} onClick={() => toggleLunch(day.date)} aria-pressed={lunchInCart}>
                    {lunchInCart ? <><Check size={16} /> Almuerzo agregado</> : "+ Agregar almuerzo"}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">
                Cafetería de {formatLongDate(day.date)}
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Categorías de cafetería">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold transition-colors ${category === item ? "bg-[var(--navy)] text-[var(--paper)]" : "bg-[oklch(94%_0.014_110)] text-[var(--muted)] hover:text-[var(--ink)]"}`}
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                  >
                    {item === "all" ? "Todos" : cafeteriaCategoryLabels[item]}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {cafeteriaProducts
                  .filter((product) => category === "all" || product.category === category)
                  .map((product) => {
                    const line = cart.cafeteria.find((item) => item.date === day.date && item.productId === product.id);
                    const quantity = line?.quantity ?? 0;
                    return (
                      <div key={product.id} className="surface flex items-center justify-between gap-3 rounded-xl p-3">
                        <div className="min-w-0">
                          <p className="mb-0.5 truncate font-bold">{product.name}</p>
                          <p className="mb-0 truncate text-xs text-[var(--muted)]">{product.description}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <strong className="text-sm tabular-nums">{formatCLP(product.price)}</strong>
                          {dayBlock ? (
                            <span className="text-xs font-bold text-[var(--muted)]">Cerrado</span>
                          ) : quantity === 0 ? (
                            <button type="button" className="btn-secondary px-3 text-xs" onClick={() => setCafeteriaQuantity(day.date, product.id, 1)}>
                              Agregar
                            </button>
                          ) : (
                            <QuantityStepper quantity={quantity} onChange={(next) => setCafeteriaQuantity(day.date, product.id, next)} label={product.name} />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>

          <aside className="surface hidden rounded-2xl p-4 lg:sticky lg:top-5 lg:block" aria-label="Resumen del pedido">
            <p className="eyebrow mb-2">Tu pedido</p>
            <h2 className="display-font mb-0.5 text-lg font-bold">{student.name}</h2>
            <p className="text-sm text-[var(--muted)]">{student.course}</p>
            <div className="my-4 border-y border-[var(--line)] py-3">
              {summaryBlocks.length === 0 ? (
                <p className="mb-0 text-sm leading-relaxed text-[var(--muted)]">Agrega almuerzo o cafetería para continuar.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {summaryBlocks.map((block) => (
                    <div key={block.weekId}>
                      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]">{block.weekLabel}</p>
                      {block.weeklyLine && (
                        <div className="mb-2 flex items-center justify-between gap-3 rounded-lg bg-[var(--pine-soft)] px-2.5 py-2 text-xs">
                          <span className="font-bold text-[var(--pine)]">{block.weeklyLine.label}</span>
                          <span className="tabular-nums font-bold">{formatCLP(block.weeklyLine.amount)}</span>
                        </div>
                      )}
                      {block.dateBlocks.map((dateBlock) => (
                        <div key={dateBlock.date} className="mb-2 last:mb-0">
                          <p className="mb-1 text-xs font-bold text-[var(--muted)]">{dateBlock.dayLabel}</p>
                          {dateBlock.lines.map((line, index) => (
                            <div key={index} className="flex items-center justify-between gap-3 text-sm">
                              <span className="truncate">{line.label}</span>
                              <span className="shrink-0 tabular-nums">{formatCLP(line.amount)}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-end justify-between gap-3">
              <strong>Total</strong>
              <strong className="display-font text-xl font-bold tabular-nums" aria-live="polite">{formatCLP(total)}</strong>
            </div>
            {itemCount > 0 ? (
              <Link href="/apoderado/pago" className="btn-primary mt-4 w-full">Continuar al pago <ArrowRight size={17} /></Link>
            ) : (
              <button type="button" className="btn-primary mt-4 w-full" disabled>Agrega algo a tu pedido</button>
            )}
            <Link href="/apoderado" className="btn-quiet mt-2 w-full"><ArrowLeft size={16} /> Cambiar estudiante</Link>
          </aside>
        </div>
      </div>

      {itemCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[color:var(--paper)]/97 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
          <Link href="/apoderado/pago" className="btn-primary flex w-full items-center justify-between">
            <span>{itemCount} {itemCount === 1 ? "ítem" : "ítems"} · {formatCLP(total)}</span>
            <span className="inline-flex items-center gap-1">Continuar <ArrowRight size={17} /></span>
          </Link>
        </div>
      )}
    </PortalShell>
  );
}
