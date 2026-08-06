"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, X } from "lucide-react";
import { positionNearRect } from "@/lib/float-position";
import type { TourStep } from "@/data/onboarding-content";

const CARD_WIDTH = 320;

export function Tour({
  steps,
  storageKey,
  autoStart = true,
  reopenSignal = 0,
}: {
  steps: TourStep[];
  storageKey: string;
  autoStart?: boolean;
  reopenSignal?: number;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mobile, setMobile] = useState(false);
  const highlightedRef = useRef<HTMLElement | null>(null);
  const anchorRectRef = useRef<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const didAutoStart = useRef(false);

  useEffect(() => {
    if (!autoStart || didAutoStart.current) return;
    didAutoStart.current = true;
    try {
      if (!window.sessionStorage.getItem(storageKey)) {
        setIndex(0);
        setOpen(true);
      }
    } catch {
      // sessionStorage no disponible; no bloquear la demo.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reopenSignal === 0) return;
    setIndex(0);
    setOpen(true);
  }, [reopenSignal]);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Ancla, resalta y posiciona en un solo paso síncrono (antes de pintar) para
  // que la altura real de la tarjeta —ya con el contenido del paso actual—
  // esté disponible al calcular la posición. Hacerlo en dos efectos separados
  // (uno para encontrar el ancla, otro para corregir con la altura real)
  // corría el riesgo de que la corrección se ejecutara con el ancla del paso
  // anterior, dejando "Siguiente" fuera del viewport en textos largos.
  useLayoutEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.classList.remove("tour-highlight");
      highlightedRef.current = null;
    }
    if (!open) return;
    const step = steps[index];
    if (!step?.anchor) {
      anchorRectRef.current = null;
      setPos(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.anchor}"]`);
    if (!el) {
      anchorRectRef.current = null;
      setPos(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const visible = rect.width > 0 || rect.height > 0;
    if (!visible) {
      anchorRectRef.current = null;
      setPos(null);
      return;
    }
    el.classList.add("tour-highlight");
    highlightedRef.current = el;
    if (mobile) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    anchorRectRef.current = rect;
    const estimatedHeight = cardRef.current?.offsetHeight || 220;
    setPos(positionNearRect(rect, CARD_WIDTH, estimatedHeight));
    return () => {
      el.classList.remove("tour-highlight");
    };
  }, [open, index, mobile, steps]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    if (highlightedRef.current) {
      highlightedRef.current.classList.remove("tour-highlight");
      highlightedRef.current = null;
    }
    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // ignore
    }
  };

  const next = () => {
    if (index === steps.length - 1) {
      close();
      return;
    }
    setIndex((value) => value + 1);
  };
  const back = () => setIndex((value) => Math.max(0, value - 1));

  if (!open) return null;
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const style: React.CSSProperties = mobile
    ? { position: "fixed", left: "1rem", right: "1rem", bottom: "max(1rem, env(safe-area-inset-bottom))" }
    : pos
      ? { position: "fixed", top: pos.top, left: pos.left, width: CARD_WIDTH }
      : { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: CARD_WIDTH };

  return createPortal(
    <div
      ref={cardRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="tour-title"
      style={style}
      className="z-[85] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-lg)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.08em] text-[var(--navy)]">
          {index + 1} de {steps.length}
        </span>
        <button
          type="button"
          className="grid size-7 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--navy-soft)]"
          onClick={close}
          aria-label="Cerrar recorrido"
        >
          <X size={15} />
        </button>
      </div>
      <h3 id="tour-title" className="display-font mt-2 mb-1 text-base font-bold">
        {step.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="btn-quiet px-2 text-xs" onClick={close}>
          Saltar
        </button>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button type="button" className="btn-secondary px-3 text-xs" onClick={back}>
              Atrás
            </button>
          )}
          <button type="button" className="btn-primary px-3 text-xs" onClick={next}>
            {isLast ? "Entendido" : <>Siguiente <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
