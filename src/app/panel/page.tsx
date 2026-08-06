"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Coffee,
  Plus,
  Search,
  UserRoundPlus,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { PanelHeader } from "@/components/panel-ui";
import { WeekStrip } from "@/components/week-strip";
import { DEMO_TODAY, cafeteriaCategoryLabels, courses, students } from "@/data/demo-data";
import { formatLongDate, matchesSearch } from "@/lib/format";
import { aggregateCafeteria, cafeteriaItemCountForDate, lunchCountForDate, packagesForDate, type DeliveryPackage } from "@/lib/operations";
import { deliveryKey, useDemo } from "@/store/demo-store";
import type { CafeteriaCategory, CutoffMode, Order } from "@/types";

type Tab = "preparacion" | "entregas";
type PrepFilter = "todo" | "almuerzos" | "cafeteria";
type StatusFilter = "pending" | "delivered" | "all";
type ContentFilter = "all" | "lunch" | "cafeteria";

const cutoffModes: { id: CutoffMode; label: string }[] = [
  { id: "automatico", label: "Automático" },
  { id: "abierto", label: "Abierto" },
  { id: "cerrado", label: "Cerrado" },
];

export default function CasinoPage() {
  const { orders, deliveries, menus, config, confirmDelivery, addManualLunch, updateCutoffMode } = useDemo();
  const [tab, setTab] = useState<Tab>("preparacion");
  const [weekIndex, setWeekIndex] = useState(0);
  const [date, setDate] = useState(DEMO_TODAY);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  const activeMenuDay = menus.flatMap((item) => item.days).find((day) => day.date === date);
  const packages = useMemo(() => packagesForDate(orders, date), [orders, date]);
  const pendingCount = packages.filter((pkg) => !deliveries[deliveryKey(pkg.studentId, date)]).length;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <PanelHeader
        eyebrow="Casino Enbandeja"
        title="Operación del día"
        description="Preparación de cocina y entregas por alumno, en un mismo lugar."
        actions={
          <button type="button" className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={17} /> Agregar almuerzo manual
          </button>
        }
      />

      <div className="surface mb-5 rounded-2xl p-4">
        <WeekStrip
          weeks={menus}
          weekIndex={weekIndex}
          onWeekChange={setWeekIndex}
          selectedDate={date}
          onSelectDate={setDate}
          renderIndicator={(day) => {
            const count = packagesForDate(orders, day.date).length;
            return count > 0 ? <span>{count} {count === 1 ? "pedido" : "pedidos"}</span> : null;
          }}
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-h-11 rounded-xl bg-[oklch(94%_0.014_110)] p-1" role="tablist" aria-label="Vista operativa">
          <button type="button" role="tab" aria-selected={tab === "preparacion"} className={`rounded-lg px-4 text-sm font-extrabold transition-colors ${tab === "preparacion" ? "bg-[var(--paper)] text-[var(--navy-dark)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("preparacion")}>
            Preparación
          </button>
          <button type="button" role="tab" aria-selected={tab === "entregas"} className={`rounded-lg px-4 text-sm font-extrabold transition-colors ${tab === "entregas" ? "bg-[var(--paper)] text-[var(--navy-dark)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setTab("entregas")}>
            Entregas
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--paper)] px-2 py-1.5">
          <span className="hidden text-xs font-bold text-[var(--muted)] sm:inline">Corte {config.bookingCutoff}</span>
          <div className="flex rounded-lg bg-[oklch(94%_0.014_110)] p-0.5" role="group" aria-label="Modo de corte (demo)">
            {cutoffModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`min-h-8 rounded-md px-2 text-[0.65rem] font-extrabold transition-colors ${config.cutoffMode === mode.id ? "bg-[var(--paper)] text-[var(--navy-dark)] shadow-sm" : "text-[var(--muted)]"}`}
                onClick={() => updateCutoffMode(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="surface grid grid-cols-2 divide-x divide-y divide-[var(--line)] overflow-hidden rounded-xl sm:grid-cols-4 sm:divide-y-0" aria-label="Métricas del día">
        {[
          { label: "Almuerzos", value: lunchCountForDate(orders, date), icon: UtensilsCrossed },
          { label: "Cafetería", value: `${cafeteriaItemCountForDate(orders, date)} ítems`, icon: Coffee },
          { label: "Pedidos", value: packages.length, icon: ClipboardList },
          { label: "Pendientes", value: pendingCount, icon: Clock3 },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.label} className="min-w-0 px-3 py-3 sm:flex sm:items-center sm:gap-3 sm:px-4">
              <Icon size={16} className="mb-2 text-[var(--navy)] sm:mb-0" />
              <div className="min-w-0">
                <p className="mb-0.5 truncate text-[0.6rem] font-extrabold uppercase tracking-[0.07em] text-[var(--muted)]">{metric.label}</p>
                <strong className="display-font text-xl font-bold leading-none tabular-nums sm:text-2xl">{metric.value}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-5">
        {tab === "preparacion" ? (
          <PreparationView orders={orders} date={date} menuMain={activeMenuDay?.main} />
        ) : (
          <DeliveriesView
            packages={packages}
            date={date}
            deliveries={deliveries}
            onDeliver={(studentId) => {
              confirmDelivery(studentId, date);
              const student = students.find((item) => item.id === studentId);
              if (student) setToast(`Entregado a ${student.name}`);
            }}
          />
        )}
      </div>

      {showAdd && (
        <AddManualLunchModal
          allDates={menus.flatMap((item) => item.days.map((day) => day.date))}
          currentDate={date}
          onClose={() => setShowAdd(false)}
          onCreated={(name) => setToast(`Almuerzo manual agregado para ${name}`)}
          addManualLunch={addManualLunch}
        />
      )}

      {toast && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-[var(--navy-dark)] px-4 py-3.5 text-sm font-bold text-[var(--paper)] shadow-[var(--shadow-lg)]" role="status">
          <CheckCircle2 size={17} className="text-[var(--pine-soft)]" /> {toast}
        </div>
      )}
    </>
  );
}

function PreparationView({ orders, date, menuMain }: { orders: Order[]; date: string; menuMain?: string }) {
  const [filter, setFilter] = useState<PrepFilter>("todo");
  const [category, setCategory] = useState<CafeteriaCategory | "all">("all");
  const lunchCount = lunchCountForDate(orders, date);
  const cafeteriaAggregate = useMemo(() => aggregateCafeteria(orders, date), [orders, date]);
  const filteredCafeteria = category === "all" ? cafeteriaAggregate : cafeteriaAggregate.filter((item) => item.category === category);

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar preparación">
        {(["todo", "almuerzos", "cafeteria"] as PrepFilter[]).map((item) => {
          const labels = { todo: "Todo", almuerzos: "Almuerzos", cafeteria: "Cafetería" };
          return (
            <button
              key={item}
              type="button"
              className={`shrink-0 rounded-lg px-3.5 py-2 text-xs font-extrabold transition-colors ${filter === item ? "bg-[var(--navy)] text-[var(--paper)]" : "bg-[oklch(94%_0.014_110)] text-[var(--muted)] hover:text-[var(--ink)]"}`}
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
            >
              {labels[item]}
            </button>
          );
        })}
      </div>

      {(filter === "todo" || filter === "almuerzos") && (
        <section className="surface rounded-2xl p-4 sm:p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><UtensilsCrossed size={14} /> Almuerzos</p>
          <div className="flex items-end gap-3">
            <strong className="display-font text-3xl font-bold tabular-nums">{lunchCount}</strong>
            <span className="mb-1 text-sm font-bold text-[var(--muted)]">reservas</span>
          </div>
          <div className="mt-3 border-t border-[var(--line)] pt-3">
            <p className="mb-1 text-xs font-bold text-[var(--muted)]">Menú del día</p>
            <p className="mb-0 font-bold">{menuMain ?? "Sin menú definido"}</p>
            <p className="mt-1 mb-0 text-xs text-[var(--pine)]">Alternativa vegetariana disponible</p>
          </div>
        </section>
      )}

      {(filter === "todo" || filter === "cafeteria") && (
        <section className="surface rounded-2xl p-4 sm:p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--muted)]"><Coffee size={14} /> Cafetería — preparar</p>
          {filter === "cafeteria" && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar por categoría">
              {(["all", "sandwiches", "snacks", "horneados", "bebestibles"] as (CafeteriaCategory | "all")[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-extrabold transition-colors ${category === item ? "bg-[var(--terra)] text-[var(--paper)]" : "bg-[oklch(94%_0.014_110)] text-[var(--muted)] hover:text-[var(--ink)]"}`}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item === "all" ? "Todo" : cafeteriaCategoryLabels[item]}
                </button>
              ))}
            </div>
          )}
          {filteredCafeteria.length === 0 ? (
            <p className="mb-0 text-sm text-[var(--muted)]">Sin productos de cafetería para este día.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredCafeteria.map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-2 last:border-0 last:pb-0">
                  <span className="font-bold">{item.productName}</span>
                  <strong className="display-font text-xl font-bold tabular-nums">{item.quantity}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function DeliveriesView({
  packages,
  date,
  deliveries,
  onDeliver,
}: {
  packages: DeliveryPackage[];
  date: string;
  deliveries: Record<string, string>;
  onDeliver: (studentId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [course, setCourse] = useState("all");
  const [content, setContent] = useState<ContentFilter>("all");

  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const student = students.find((item) => item.id === pkg.studentId);
      if (!student) return false;
      const deliveredAt = deliveries[deliveryKey(pkg.studentId, date)];
      const matchesTerm = matchesSearch(`${student.name} ${student.course}`, search);
      const matchesStatus = status === "all" || (status === "delivered" ? Boolean(deliveredAt) : !deliveredAt);
      const matchesCourse = course === "all" || student.course === course;
      const matchesContent = content === "all" || (content === "lunch" ? pkg.hasLunch : pkg.cafeteriaItems.length > 0);
      return matchesTerm && matchesStatus && matchesCourse && matchesContent;
    });
  }, [content, course, date, deliveries, packages, search, status]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <section className="surface rounded-2xl p-3.5 sm:p-4">
        <label className="relative block">
          <span className="sr-only">Buscar alumno o curso</span>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--navy)]" size={18} aria-hidden="true" />
          <input className="field min-h-12 !pl-10 !pr-10 text-sm font-semibold" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar alumno o curso..." />
          {search && <button type="button" className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--navy-soft)]" onClick={() => setSearch("")} aria-label="Limpiar búsqueda"><X size={17} /></button>}
        </label>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="flex min-h-11 rounded-lg bg-[oklch(94%_0.014_110)] p-1" role="group" aria-label="Filtrar por estado">
            {(["pending", "delivered", "all"] as StatusFilter[]).map((item) => {
              const labels = { pending: "Pendientes", delivered: "Entregados", all: "Todos" };
              return <button key={item} type="button" className={`flex-1 rounded-md px-2 text-xs font-extrabold transition-colors ${status === item ? "bg-[var(--paper)] text-[var(--navy-dark)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setStatus(item)}>{labels[item]}</button>;
            })}
          </div>
          <div className="flex min-h-11 rounded-lg bg-[oklch(94%_0.014_110)] p-1" role="group" aria-label="Filtrar por contenido">
            {(["all", "lunch", "cafeteria"] as ContentFilter[]).map((item) => {
              const labels = { all: "Todos", lunch: "Con almuerzo", cafeteria: "Con cafetería" };
              return <button key={item} type="button" className={`flex-1 rounded-md px-2 text-xs font-extrabold transition-colors ${content === item ? "bg-[var(--paper)] text-[var(--navy-dark)] shadow-sm" : "text-[var(--muted)]"}`} onClick={() => setContent(item)}>{labels[item]}</button>;
            })}
          </div>
          <label><span className="sr-only">Curso</span><select className="field" value={course} onChange={(event) => setCourse(event.target.value)}><option value="all">Todos los cursos</option>{courses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>
      </section>

      <section aria-live="polite">
        <p className="mb-2 px-1 text-sm font-bold text-[var(--muted)]">{filtered.length} {filtered.length === 1 ? "estudiante" : "estudiantes"}</p>
        {filtered.length === 0 ? (
          <div className="surface rounded-2xl p-8 text-center"><Search className="mx-auto text-[var(--line-accent)]" size={32} /><h2 className="display-font mt-3 mb-1 text-lg font-bold">No encontramos estudiantes</h2><p className="mb-0 text-sm text-[var(--muted)]">Prueba otra búsqueda, filtro o fecha.</p></div>
        ) : (
          <div className="surface overflow-hidden rounded-xl">
            {filtered.map((pkg) => {
              const student = students.find((item) => item.id === pkg.studentId)!;
              const deliveredAt = deliveries[deliveryKey(pkg.studentId, date)];
              const deliveredTime = deliveredAt
                ? new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" }).format(new Date(deliveredAt))
                : null;
              return (
                <article key={pkg.studentId} className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3.5 last:border-0 hover:bg-[oklch(98%_0.008_100)] sm:px-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[0.65rem] font-extrabold ${deliveredAt ? "bg-[var(--pine-soft)] text-[var(--pine)]" : "bg-[var(--terra-soft)] text-[var(--terra)]"}`}>
                      {student.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}
                    </span>
                    <div className="min-w-0">
                      <h2 className="mb-0 flex min-w-0 items-center gap-1.5 text-sm font-extrabold">
                        <span className="truncate">{student.name}</span>
                        {pkg.lunchSource === "manual" && <span className="shrink-0 rounded-full bg-[var(--navy-soft)] px-1.5 py-0.5 text-[0.58rem] font-extrabold uppercase tracking-wide text-[var(--navy)]">Manual</span>}
                      </h2>
                      <p className="mb-1.5 mt-0.5 truncate text-xs text-[var(--muted)]">{student.course}</p>
                      <div className="grid min-w-0 gap-0.5 text-sm">
                        {pkg.hasLunch && <span className="truncate font-bold">Almuerzo</span>}
                        {pkg.cafeteriaItems.map((item, index) => (
                          <span key={index} className="truncate text-[var(--muted)]">{item.productName} ×{item.quantity}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {deliveredAt ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--pine)]"><Check size={13} /> Entregado · {deliveredTime}</span>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[var(--terra)]"><Clock3 size={13} /> Pendiente</span>
                        <button type="button" className="btn-primary min-h-9 px-3.5 text-xs" onClick={() => onDeliver(pkg.studentId)}>Entregar</button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function AddManualLunchModal({
  allDates,
  currentDate,
  onClose,
  onCreated,
  addManualLunch,
}: {
  allDates: string[];
  currentDate: string;
  onClose: () => void;
  onCreated: (name: string) => void;
  addManualLunch: (studentId: string, date: string) => Order | null;
}) {
  const [course, setCourse] = useState("");
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState(currentDate);
  const [error, setError] = useState("");
  const filteredStudents = students.filter((student) => student.course === course);
  const student = students.find((item) => item.id === studentId);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  const submit = () => {
    if (!studentId || !student) return;
    const order = addManualLunch(studentId, date);
    if (!order) {
      setError(`${student.name} ya tiene un almuerzo reservado para esa fecha.`);
      return;
    }
    onCreated(student.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-title">
      <div className="page-enter w-full max-w-sm rounded-2xl bg-[var(--paper)] p-5 shadow-[var(--shadow-lg)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--navy-soft)] text-[var(--navy)]"><UserRoundPlus size={19} /></span>
          <button type="button" className="btn-quiet px-2" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <h2 id="add-title" className="display-font mt-4 mb-1 text-xl font-bold">Agregar almuerzo manual</h2>
        <p className="mb-4 text-sm text-[var(--muted)]">Excepción operativa para un caso puntual, fuera del flujo online.</p>

        <div className="grid grid-cols-1 gap-3">
          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold">Curso</span>
            <select className="field" value={course} onChange={(event) => { setCourse(event.target.value); setStudentId(""); setError(""); }}>
              <option value="">Selecciona un curso</option>
              {courses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold">Alumno</span>
            <select className="field" value={studentId} disabled={!course} onChange={(event) => { setStudentId(event.target.value); setError(""); }}>
              <option value="">{course ? "Selecciona un alumno" : "Primero selecciona el curso"}</option>
              {filteredStudents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="grid grid-cols-1 gap-1.5">
            <span className="text-xs font-extrabold">Fecha</span>
            <select className="field" value={date} onChange={(event) => { setDate(event.target.value); setError(""); }}>
              {allDates.map((item) => <option key={item} value={item}>{formatLongDate(item)}</option>)}
            </select>
          </label>
        </div>

        {error && <p className="mt-3 mb-0 rounded-lg bg-[var(--terra-soft)] px-3 py-2 text-xs font-bold text-[var(--terra)]">{error}</p>}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-primary" disabled={!studentId} onClick={submit}><Plus size={16} /> Confirmar</button>
        </div>
      </div>
    </div>
  );
}
