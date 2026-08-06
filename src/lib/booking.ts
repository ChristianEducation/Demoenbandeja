import { isBeforeCutoff } from "@/lib/format";
import type { DemoConfig } from "@/types";

export type BookingBlockReason = "past" | "cutoff" | null;

/** Determina si una fecha ya no admite reserva online (el corte es solo para "hoy"). */
export function bookingBlockReason(date: string, today: string, config: DemoConfig): BookingBlockReason {
  if (date < today) return "past";
  if (date === today) {
    if (config.cutoffMode === "cerrado") return "cutoff";
    if (config.cutoffMode === "automatico" && !isBeforeCutoff(config.bookingCutoff)) return "cutoff";
  }
  return null;
}
