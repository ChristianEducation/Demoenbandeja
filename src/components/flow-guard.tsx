import Link from "next/link";
import { ArrowLeft, UserRoundSearch } from "lucide-react";

export function FlowGuard({
  title = "Primero selecciona un estudiante",
  description = "Necesitamos saber quién utilizará el servicio antes de continuar.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="surface mx-auto max-w-xl rounded-2xl p-6 text-center sm:p-9">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--navy-soft)] text-[var(--navy)]">
        <UserRoundSearch size={20} aria-hidden="true" />
      </span>
      <h1 className="display-font mt-4 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mx-auto max-w-md text-[var(--muted)]">{description}</p>
      <Link href="/apoderado" className="btn-primary mt-4">
        <ArrowLeft size={17} aria-hidden="true" /> Seleccionar estudiante
      </Link>
    </div>
  );
}
