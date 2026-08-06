"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HelpCircle } from "lucide-react";
import { positionNearRect } from "@/lib/float-position";

export function InfoTip({ text, label = "Más información" }: { text: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const reposition = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - 32);
    const height = cardRef.current?.offsetHeight || 140;
    setPos(positionNearRect(rect, width, height));
  };

  // La tarjeta se renderiza en cuanto "open" es true, sin esperar a "pos"
  // (ver más abajo), así que en este paso síncrono previo a pintar ya está
  // montada y su altura real está disponible para la primera posición.
  useLayoutEffect(() => {
    if (!open) return;
    reposition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (cardRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="inline-grid size-5 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--muted)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)]"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        <HelpCircle size={13} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div
            ref={cardRef}
            id={id}
            role="tooltip"
            style={{
              position: "fixed",
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: Math.min(280, window.innerWidth - 32),
            }}
            className="z-[80] rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-xs leading-relaxed text-[var(--ink)] shadow-[var(--shadow-lg)]"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
