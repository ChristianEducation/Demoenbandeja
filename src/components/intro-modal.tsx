"use client";

import { useEffect, useState } from "react";
import { Leaf, Monitor, SlidersHorizontal, Tag } from "lucide-react";

const SESSION_KEY = "terravida-intro-seen";

const points = [
  {
    icon: Monitor,
    text: "Esta demo fue preparada para mostrar una idea de cómo podría digitalizarse la operación del casino TerraVida.",
  },
  {
    icon: Tag,
    text: "Los datos, precios y menús son referenciales y se utilizan solo para visualizar la propuesta.",
  },
  {
    icon: SlidersHorizontal,
    text: "La versión final se ajustaría según la forma de trabajo y necesidades del casino.",
  },
];

export function IntroModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(SESSION_KEY)) setOpen(true);
    } catch {
      // sessionStorage no disponible; no bloquear la demo.
    }
  }, []);

  const close = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[color:var(--ink)]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="page-enter w-full max-w-md rounded-[1.75rem] bg-[var(--paper)] p-7 text-center shadow-[var(--shadow-lg)] sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--pine-soft)] px-4 py-2 text-sm font-bold text-[var(--pine)]">
          <Leaf size={16} aria-hidden="true" /> Demo referencial
        </span>

        <h2 id="intro-title" className="display-font mt-5 text-2xl font-extrabold leading-tight text-[var(--navy-dark)] sm:text-3xl">
          Así podría verse TerraVida
        </h2>

        <div className="my-6 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-10 bg-[var(--line)]" />
          <Leaf size={14} className="text-[var(--pine)]" />
          <span className="h-px w-10 bg-[var(--line)]" />
        </div>

        <div className="grid gap-6 text-left">
          {points.map(({ icon: Icon, text }, index) => (
            <div key={index} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[oklch(96%_0.012_150)] text-[var(--pine)]">
                <Icon size={19} aria-hidden="true" />
              </span>
              <p className="mb-0 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{text}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-8 min-h-14 w-full rounded-2xl bg-[var(--navy-dark)] px-4 font-extrabold text-[var(--paper)] transition-transform hover:-translate-y-0.5"
          onClick={close}
        >
          Ver demo
        </button>
      </div>
    </div>
  );
}
