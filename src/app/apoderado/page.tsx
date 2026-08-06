"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeDollarSign, Check, GraduationCap, UserRound } from "lucide-react";
import { PortalShell } from "@/components/portal-shell";
import { demoStudentId, students } from "@/data/demo-data";
import { formatCLP } from "@/lib/format";
import { useDemo } from "@/store/demo-store";

export default function StudentSelectionPage() {
  const router = useRouter();
  const { config, selectStudent } = useDemo();
  const [course, setCourse] = useState("");
  const [studentId, setStudentId] = useState("");
  const filteredStudents = useMemo(
    () => students.filter((student) => student.course === course),
    [course],
  );
  const student = students.find((item) => item.id === studentId);

  const chooseDemoStudent = () => {
    const demoStudent = students.find((item) => item.id === demoStudentId)!;
    setCourse(demoStudent.course);
    setStudentId(demoStudent.id);
  };

  const continueFlow = () => {
    if (!studentId) return;
    selectStudent(studentId);
    router.push("/apoderado/reserva");
  };

  return (
    <PortalShell step={1}>
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
        <section className="lg:sticky lg:top-8">
          <span className="eyebrow"><UserRound size={14} /> Nueva reserva</span>
          <h1 className="display-font mt-3 max-w-md text-[1.55rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[1.75rem]">
            ¿Quién utilizará el servicio?
          </h1>
          <p className="mt-3 max-w-sm text-[var(--muted)]">
            Selecciona el curso y el estudiante. Te mostraremos el valor demo del almuerzo automáticamente.
          </p>
          <button type="button" className="btn-quiet mt-3 -ml-3" onClick={chooseDemoStudent}>
            Completar con Martina para la demo <ArrowRight size={16} />
          </button>
        </section>

        <section className="surface rounded-2xl p-5 sm:p-7" aria-label="Selección del estudiante">
          <div className="grid grid-cols-1 gap-5">
            <label className="grid grid-cols-1 gap-2">
              <span className="flex items-center justify-between text-sm font-extrabold">
                <span><span className="mr-2 text-[var(--terra)]">01</span>Curso</span>
                {course && <Check size={16} className="text-[var(--pine)]" aria-label="Completado" />}
              </span>
              <select
                className="field"
                value={course}
                onChange={(event) => {
                  setCourse(event.target.value);
                  setStudentId("");
                }}
              >
                <option value="">Selecciona un curso</option>
                {[...new Set(students.map((item) => item.course))].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="grid grid-cols-1 gap-2">
              <span className="flex items-center justify-between text-sm font-extrabold">
                <span><span className="mr-2 text-[var(--terra)]">02</span>Estudiante</span>
                {studentId && <Check size={16} className="text-[var(--pine)]" aria-label="Completado" />}
              </span>
              <select
                className="field"
                value={studentId}
                disabled={!course}
                onChange={(event) => setStudentId(event.target.value)}
              >
                <option value="">{course ? "Selecciona un estudiante" : "Primero selecciona el curso"}</option>
                {filteredStudents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>

          <div className={`grid transition-[grid-template-rows,opacity] duration-300 ${student ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              {student && (
                <div className="rounded-xl bg-[var(--navy-soft)] p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--navy)] text-[var(--paper)]">
                      <GraduationCap size={18} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="mb-0.5 truncate font-extrabold text-[var(--navy-dark)]">{student.name}</p>
                      <p className="mb-0 text-sm text-[var(--navy)]">{student.course}</p>
                    </div>
                    <div className="ml-auto hidden text-right sm:block">
                      <p className="mb-0.5 text-xs font-bold text-[var(--navy)]">Valor demo</p>
                      <p className="mb-0 font-extrabold tabular-nums text-[var(--navy-dark)]">{formatCLP(config.dailyLunchPrice)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[color:var(--navy)]/12 pt-3 sm:hidden">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--navy)]"><BadgeDollarSign size={16} /> Valor demo</span>
                    <strong className="tabular-nums">{formatCLP(config.dailyLunchPrice)}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="button" className="btn-primary mt-6 w-full" disabled={!student} onClick={continueFlow}>
            Continuar a Mi semana <ArrowRight size={17} aria-hidden="true" />
          </button>
        </section>
      </div>
    </PortalShell>
  );
}
