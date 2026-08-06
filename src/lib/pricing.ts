import { formatCLP, formatDayLabel } from "@/lib/format";
import type {
  CafeteriaItem,
  CafeteriaProduct,
  CartCafeteriaLine,
  DemoConfig,
  LunchItem,
  LunchPricingMode,
  LunchSource,
  MenuWeek,
  Order,
} from "@/types";

export interface LunchGroup {
  weekId: string;
  weekLabel: string;
  dates: string[];
  pricingMode: LunchPricingMode;
  unitPrice: number;
  subtotal: number;
}

export function weekForDate(date: string, menus: MenuWeek[]): MenuWeek | undefined {
  return menus.find((week) => week.days.some((day) => day.date === date));
}

/** Agrupa las fechas de almuerzo del carrito por semana y determina tarifa diaria o semanal por semana real. */
export function computeLunchGroups(dates: string[], menus: MenuWeek[], config: DemoConfig): LunchGroup[] {
  const byWeek = new Map<string, string[]>();
  for (const date of dates) {
    const week = weekForDate(date, menus);
    if (!week) continue;
    const list = byWeek.get(week.id) ?? [];
    list.push(date);
    byWeek.set(week.id, list);
  }

  const groups: LunchGroup[] = [];
  for (const [weekId, weekDates] of byWeek) {
    const week = menus.find((item) => item.id === weekId)!;
    const sortedDates = [...weekDates].sort();
    const isFullWeek = week.days.length > 0 && week.days.every((day) => sortedDates.includes(day.date));
    const pricingMode: LunchPricingMode = isFullWeek ? "weekly" : "daily";
    const unitPrice = pricingMode === "weekly" ? config.weeklyLunchUnitPrice : config.dailyLunchPrice;
    groups.push({
      weekId,
      weekLabel: week.shortLabel,
      dates: sortedDates,
      pricingMode,
      unitPrice,
      subtotal: unitPrice * sortedDates.length,
    });
  }
  return groups.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
}

export const lunchGroupsTotal = (groups: LunchGroup[]) =>
  groups.reduce((sum, group) => sum + group.subtotal, 0);

export function buildLunchItems(groups: LunchGroup[], source: LunchSource): Omit<LunchItem, "studentId">[] {
  return groups.flatMap((group) =>
    group.dates.map((date) => ({
      date,
      weekId: group.weekId,
      unitPriceApplied: group.unitPrice,
      pricingMode: group.pricingMode,
      source,
    })),
  );
}

export function computeCafeteriaSubtotal(lines: CartCafeteriaLine[], products: CafeteriaProduct[]): number {
  return lines.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product ? product.price * line.quantity : 0);
  }, 0);
}

export function buildCafeteriaItems(
  lines: CartCafeteriaLine[],
  products: CafeteriaProduct[],
): Omit<CafeteriaItem, "studentId">[] {
  return lines
    .filter((line) => line.quantity > 0)
    .map((line) => {
      const product = products.find((item) => item.id === line.productId)!;
      return {
        date: line.date,
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity: line.quantity,
        unitPrice: product.price,
      };
    });
}

export interface SummaryLine {
  label: string;
  amount: number;
}

export interface SummaryDateBlock {
  date: string;
  dayLabel: string;
  lines: SummaryLine[];
}

export interface SummaryWeekBlock {
  weekId: string;
  weekLabel: string;
  weeklyLine?: SummaryLine;
  dateBlocks: SummaryDateBlock[];
  subtotal: number;
}

type SummaryLunchItem = Pick<LunchItem, "date" | "weekId" | "unitPriceApplied" | "pricingMode">;
type SummaryCafeteriaItem = Pick<CafeteriaItem, "date" | "productName" | "quantity" | "unitPrice">;

/** Agrupa Semana → Día → Ítems para el resumen del carrito, el pago y la confirmación. */
export function buildOrderSummary(
  lunchItems: SummaryLunchItem[],
  cafeteriaItems: SummaryCafeteriaItem[],
  menus: MenuWeek[],
): SummaryWeekBlock[] {
  const activeWeekIds = new Set<string>([
    ...lunchItems.map((item) => item.weekId),
    ...cafeteriaItems
      .map((item) => weekForDate(item.date, menus)?.id)
      .filter((id): id is string => Boolean(id)),
  ]);

  const blocks: SummaryWeekBlock[] = [];
  for (const week of menus) {
    if (!activeWeekIds.has(week.id)) continue;
    const weekLunchItems = lunchItems.filter((item) => item.weekId === week.id);
    const isWeekly = weekLunchItems.length > 0 && weekLunchItems[0].pricingMode === "weekly";
    const dateBlocks: SummaryDateBlock[] = [];
    let weeklyLine: SummaryLine | undefined;
    let subtotal = 0;

    if (isWeekly) {
      const unitPrice = weekLunchItems[0].unitPriceApplied;
      const amount = unitPrice * weekLunchItems.length;
      weeklyLine = { label: `Almuerzos LUN–JUE · ✓ Tarifa semanal · ${weekLunchItems.length} × ${formatCLP(unitPrice)}`, amount };
      subtotal += amount;
    }

    for (const day of week.days) {
      const lines: SummaryLine[] = [];
      if (!isWeekly) {
        const item = weekLunchItems.find((lunchItem) => lunchItem.date === day.date);
        if (item) {
          lines.push({ label: "Almuerzo", amount: item.unitPriceApplied });
          subtotal += item.unitPriceApplied;
        }
      }
      for (const item of cafeteriaItems.filter((cafeItem) => cafeItem.date === day.date)) {
        const amount = item.unitPrice * item.quantity;
        lines.push({ label: `${item.productName} ×${item.quantity}`, amount });
        subtotal += amount;
      }
      if (lines.length > 0) {
        dateBlocks.push({ date: day.date, dayLabel: formatDayLabel(day.date, day.dayName), lines });
      }
    }

    blocks.push({ weekId: week.id, weekLabel: week.shortLabel, weeklyLine, dateBlocks, subtotal });
  }
  return blocks;
}

export const summaryTotal = (blocks: SummaryWeekBlock[]) => blocks.reduce((sum, block) => sum + block.subtotal, 0);

/** Fechas en las que el estudiante ya tiene un almuerzo pagado (historial de órdenes previas). */
export function historicalLunchDates(orders: Order[], studentId: string): Set<string> {
  const dates = new Set<string>();
  for (const order of orders) {
    if (order.studentId !== studentId) continue;
    for (const item of order.lunchItems) dates.add(item.date);
  }
  return dates;
}
