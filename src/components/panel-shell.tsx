import Link from "next/link";
import { House } from "lucide-react";
import { Brand, DemoBadge } from "@/components/brand";

export function PanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--cream)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[color:var(--cream)]/92 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4">
          <Brand compact />
          <div className="flex items-center gap-2">
            <DemoBadge />
            <Link href="/" className="btn-quiet px-3" aria-label="Volver al inicio">
              <House size={17} />
            </Link>
          </div>
        </div>
      </header>
      <main id="contenido-principal" className="page-enter min-h-dvh px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[80rem]">{children}</div>
      </main>
    </div>
  );
}
