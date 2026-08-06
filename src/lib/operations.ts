import type { CafeteriaCategory, LunchSource, Order } from "@/types";

export interface DeliveryPackage {
  studentId: string;
  date: string;
  hasLunch: boolean;
  lunchSource?: LunchSource;
  cafeteriaItems: { productName: string; quantity: number }[];
}

/** Agrupa todos los ítems (almuerzo + cafetería) de un alumno para una fecha como un paquete de entrega diario. */
export function packagesForDate(orders: Order[], date: string): DeliveryPackage[] {
  const map = new Map<string, DeliveryPackage>();
  const get = (studentId: string) => {
    const existing = map.get(studentId);
    if (existing) return existing;
    const created: DeliveryPackage = { studentId, date, hasLunch: false, cafeteriaItems: [] };
    map.set(studentId, created);
    return created;
  };

  for (const order of orders) {
    for (const item of order.lunchItems) {
      if (item.date !== date) continue;
      const pkg = get(item.studentId);
      pkg.hasLunch = true;
      pkg.lunchSource = item.source;
    }
    for (const item of order.cafeteriaItems) {
      if (item.date !== date) continue;
      const pkg = get(item.studentId);
      const line = pkg.cafeteriaItems.find((existing) => existing.productName === item.productName);
      if (line) line.quantity += item.quantity;
      else pkg.cafeteriaItems.push({ productName: item.productName, quantity: item.quantity });
    }
  }
  return Array.from(map.values());
}

export interface CafeteriaAggregate {
  productId: string;
  productName: string;
  category: CafeteriaCategory;
  quantity: number;
}

/** Suma cantidades del mismo producto entre todos los pedidos del día, para que Preparación muestre un solo total por producto. */
export function aggregateCafeteria(orders: Order[], date: string): CafeteriaAggregate[] {
  const map = new Map<string, CafeteriaAggregate>();
  for (const order of orders) {
    for (const item of order.cafeteriaItems) {
      if (item.date !== date) continue;
      const existing = map.get(item.productId);
      if (existing) existing.quantity += item.quantity;
      else map.set(item.productId, { productId: item.productId, productName: item.productName, category: item.category, quantity: item.quantity });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.quantity - a.quantity);
}

export const lunchCountForDate = (orders: Order[], date: string) =>
  orders.reduce((sum, order) => sum + order.lunchItems.filter((item) => item.date === date).length, 0);

export const cafeteriaItemCountForDate = (orders: Order[], date: string) =>
  orders.reduce(
    (sum, order) =>
      sum + order.cafeteriaItems.filter((item) => item.date === date).reduce((lineSum, item) => lineSum + item.quantity, 0),
    0,
  );
