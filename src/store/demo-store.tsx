"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  cafeteriaProducts,
  initialConfig,
  initialDeliveries,
  initialMenus,
  initialOrders,
} from "@/data/demo-data";
import {
  buildCafeteriaItems,
  buildLunchItems,
  computeCafeteriaSubtotal,
  computeLunchGroups,
  historicalLunchDates,
  lunchGroupsTotal,
} from "@/lib/pricing";
import type { Cart, CutoffMode, DemoConfig, MenuWeek, Order } from "@/types";

interface DemoState {
  selectedStudentId: string | null;
  selectedWeekIndex: number;
  cart: Cart;
  lastOrderId: string | null;
  orders: Order[];
  deliveries: Record<string, string>;
  menus: MenuWeek[];
  config: DemoConfig;
}

const emptyCart: Cart = { lunchDates: [], cafeteria: [] };

type Action =
  | { type: "hydrate"; payload: DemoState }
  | { type: "select-student"; studentId: string }
  | { type: "select-week"; index: number }
  | { type: "toggle-lunch"; date: string }
  | { type: "add-lunch-dates"; dates: string[] }
  | { type: "set-cafeteria-quantity"; date: string; productId: string; quantity: number }
  | { type: "purchase"; order: Order }
  | { type: "add-manual-lunch"; order: Order }
  | { type: "deliver"; key: string; deliveredAt: string }
  | { type: "update-cutoff-mode"; mode: CutoffMode }
  | { type: "reset" };

const createInitialState = (): DemoState => ({
  selectedStudentId: null,
  selectedWeekIndex: 0,
  cart: emptyCart,
  lastOrderId: null,
  orders: initialOrders,
  deliveries: initialDeliveries,
  menus: initialMenus,
  config: initialConfig,
});

export const deliveryKey = (studentId: string, date: string) => `${studentId}__${date}`;

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "select-student":
      return { ...state, selectedStudentId: action.studentId, cart: emptyCart, lastOrderId: null };
    case "select-week":
      return { ...state, selectedWeekIndex: action.index };
    case "toggle-lunch":
      return {
        ...state,
        cart: {
          ...state.cart,
          lunchDates: state.cart.lunchDates.includes(action.date)
            ? state.cart.lunchDates.filter((date) => date !== action.date)
            : [...state.cart.lunchDates, action.date].sort(),
        },
      };
    case "add-lunch-dates":
      return {
        ...state,
        cart: {
          ...state.cart,
          lunchDates: Array.from(new Set([...state.cart.lunchDates, ...action.dates])).sort(),
        },
      };
    case "set-cafeteria-quantity": {
      const existing = state.cart.cafeteria.filter(
        (line) => !(line.date === action.date && line.productId === action.productId),
      );
      const cafeteria =
        action.quantity > 0
          ? [...existing, { date: action.date, productId: action.productId, quantity: action.quantity }]
          : existing;
      return { ...state, cart: { ...state.cart, cafeteria } };
    }
    case "purchase":
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: emptyCart,
        lastOrderId: action.order.id,
      };
    case "add-manual-lunch":
      return { ...state, orders: [action.order, ...state.orders] };
    case "deliver":
      return { ...state, deliveries: { ...state.deliveries, [action.key]: action.deliveredAt } };
    case "update-cutoff-mode":
      return { ...state, config: { ...state.config, cutoffMode: action.mode } };
    case "reset":
      return createInitialState();
  }
}

interface DemoContextValue extends DemoState {
  hydrated: boolean;
  cafeteriaProducts: typeof cafeteriaProducts;
  selectStudent: (studentId: string) => void;
  selectWeek: (index: number) => void;
  toggleLunch: (date: string) => void;
  reserveFullWeek: (dates: string[]) => void;
  setCafeteriaQuantity: (date: string, productId: string, quantity: number) => void;
  confirmPurchase: (studentId: string) => Order;
  addManualLunch: (studentId: string, date: string) => Order | null;
  confirmDelivery: (studentId: string, date: string) => void;
  updateCutoffMode: (mode: CutoffMode) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);
const STORAGE_KEY = "enbandeja-demo-state-v1";

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "hydrate", payload: JSON.parse(saved) as DemoState });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const confirmPurchase = useCallback(
    (studentId: string) => {
      const lunchGroups = computeLunchGroups(state.cart.lunchDates, state.menus, state.config);
      const lunchItems = buildLunchItems(lunchGroups, "online").map((item) => ({ ...item, studentId }));
      const cafeteriaItems = buildCafeteriaItems(state.cart.cafeteria, cafeteriaProducts).map((item) => ({
        ...item,
        studentId,
      }));
      const lunchSubtotal = lunchGroupsTotal(lunchGroups);
      const cafeteriaSubtotal = computeCafeteriaSubtotal(state.cart.cafeteria, cafeteriaProducts);
      const order: Order = {
        id: `order-${Date.now()}`,
        studentId,
        purchasedAt: new Date().toISOString(),
        lunchItems,
        cafeteriaItems,
        lunchSubtotal,
        cafeteriaSubtotal,
        total: lunchSubtotal + cafeteriaSubtotal,
      };
      dispatch({ type: "purchase", order });
      return order;
    },
    [state.cart, state.config, state.menus],
  );

  const addManualLunch = useCallback(
    (studentId: string, date: string) => {
      const reserved = historicalLunchDates(state.orders, studentId);
      if (reserved.has(date)) return null;
      const week = state.menus.find((item) => item.days.some((day) => day.date === date));
      if (!week) return null;
      const unitPrice = state.config.dailyLunchPrice;
      const order: Order = {
        id: `order-manual-${Date.now()}`,
        studentId,
        purchasedAt: new Date().toISOString(),
        lunchItems: [
          { studentId, date, weekId: week.id, unitPriceApplied: unitPrice, pricingMode: "daily", source: "manual" },
        ],
        cafeteriaItems: [],
        lunchSubtotal: unitPrice,
        cafeteriaSubtotal: 0,
        total: unitPrice,
      };
      dispatch({ type: "add-manual-lunch", order });
      return order;
    },
    [state.config.dailyLunchPrice, state.menus, state.orders],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      hydrated,
      cafeteriaProducts,
      selectStudent: (studentId) => dispatch({ type: "select-student", studentId }),
      selectWeek: (index) => dispatch({ type: "select-week", index }),
      toggleLunch: (date) => dispatch({ type: "toggle-lunch", date }),
      reserveFullWeek: (dates) => dispatch({ type: "add-lunch-dates", dates }),
      setCafeteriaQuantity: (date, productId, quantity) =>
        dispatch({ type: "set-cafeteria-quantity", date, productId, quantity }),
      confirmPurchase,
      addManualLunch,
      confirmDelivery: (studentId, date) =>
        dispatch({ type: "deliver", key: deliveryKey(studentId, date), deliveredAt: new Date().toISOString() }),
      updateCutoffMode: (mode) => dispatch({ type: "update-cutoff-mode", mode }),
      resetDemo: () => {
        window.localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: "reset" });
      },
    }),
    [addManualLunch, confirmPurchase, hydrated, state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}
