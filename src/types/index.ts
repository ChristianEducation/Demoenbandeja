export type CutoffMode = "automatico" | "abierto" | "cerrado";
export type LunchPricingMode = "daily" | "weekly";
export type LunchSource = "online" | "manual";
export type CafeteriaCategory = "sandwiches" | "snacks" | "horneados" | "bebestibles";

export interface Student {
  id: string;
  name: string;
  course: string;
  guardianName: string;
}

export interface MenuDay {
  date: string;
  dayName: string;
  main: string;
  vegetarian: string;
  sides: string[];
  dessert: string;
}

export interface MenuWeek {
  id: string;
  label: string;
  shortLabel: string;
  startDate: string;
  endDate: string;
  days: MenuDay[];
}

export interface CafeteriaProduct {
  id: string;
  name: string;
  description: string;
  category: CafeteriaCategory;
  price: number;
}

export interface LunchItem {
  studentId: string;
  date: string;
  weekId: string;
  unitPriceApplied: number;
  pricingMode: LunchPricingMode;
  source: LunchSource;
}

export interface CafeteriaItem {
  studentId: string;
  date: string;
  productId: string;
  productName: string;
  category: CafeteriaCategory;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  studentId: string;
  purchasedAt: string;
  lunchItems: LunchItem[];
  cafeteriaItems: CafeteriaItem[];
  lunchSubtotal: number;
  cafeteriaSubtotal: number;
  total: number;
}

export interface CartCafeteriaLine {
  date: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  lunchDates: string[];
  cafeteria: CartCafeteriaLine[];
}

export interface DemoConfig {
  dailyLunchPrice: number;
  weeklyLunchUnitPrice: number;
  bookingCutoff: string;
  cutoffMode: CutoffMode;
}
