import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine, MenuItem, MenuVariant, Restaurant } from "@/types";

export interface Promo {
  code: string;
  percent: number;
  maxOff: number;
  minSubtotal: number;
  tagline: string;
}

export const PROMOS: Promo[] = [
  { code: "KADA50", percent: 50, maxOff: 100, minSubtotal: 149, tagline: "50% off up to ₹100 on orders over ₹149" },
  { code: "WELCOME", percent: 20, maxOff: 50, minSubtotal: 99, tagline: "20% off up to ₹50 — perfect for your first order" },
  { code: "FLAT75", percent: 100, maxOff: 75, minSubtotal: 299, tagline: "Flat ₹75 off on orders over ₹299" },
];

export interface CartTotals {
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  total: number;
}

interface CartValue {
  restaurant: Restaurant | null;
  lines: CartLine[];
  count: number;
  promoCode: string | null;
  tip: number;
  isEmpty: boolean;
  conflictsWith: (r: Restaurant) => boolean;
  add: (r: Restaurant, item: MenuItem, opts?: { variant?: MenuVariant; addons?: MenuVariant[]; instructions?: string; qty?: number }) => void;
  increment: (cartId: string) => void;
  decrement: (cartId: string) => void;
  clear: () => void;
  applyPromo: (code: string) => string | null;
  removePromo: () => void;
  setTip: (v: number) => void;
  totals: () => CartTotals;
  qtyOf: (itemId: string) => number;
}

const Ctx = createContext<CartValue>(null as any);

function sameAddons(a: MenuVariant[], b: MenuVariant[]) {
  if (a.length !== b.length) return false;
  const an = a.map((x) => x.name).sort();
  const bn = b.map((x) => x.name).sort();
  return an.every((n, i) => n === bn[i]);
}

function lineUnitPrice(l: CartLine) {
  return (l.variant?.price ?? l.item.price) + l.addons.reduce((s, a) => s + a.price, 0);
}

// The cart survives a refresh or a sign-in round trip, but not a stale day.
const CART_KEY = "kada_web_cart_v1";
const CART_TTL_MS = 12 * 60 * 60 * 1000;

interface StoredCart {
  savedAt: number;
  restaurant: Restaurant | null;
  lines: CartLine[];
  promoCode: string | null;
  tip: number;
}

function loadCart(): StoredCart | null {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as StoredCart;
    if (!c || !Array.isArray(c.lines) || Date.now() - c.savedAt > CART_TTL_MS) return null;
    if (c.restaurant?.pausedUntil) c.restaurant.pausedUntil = new Date(c.restaurant.pausedUntil);
    return c;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [stored] = useState(loadCart);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(stored?.restaurant ?? null);
  const [lines, setLines] = useState<CartLine[]>(stored?.lines ?? []);
  const [promoCode, setPromoCode] = useState<string | null>(stored?.promoCode ?? null);
  const [tip, setTipState] = useState(stored?.tip ?? 0);

  useEffect(() => {
    try {
      if (lines.length === 0) localStorage.removeItem(CART_KEY);
      else {
        const c: StoredCart = { savedAt: Date.now(), restaurant, lines, promoCode, tip };
        localStorage.setItem(CART_KEY, JSON.stringify(c));
      }
    } catch {
      // Storage blocked (private mode): the cart just won't survive a refresh.
    }
  }, [restaurant, lines, promoCode, tip]);

  const value = useMemo<CartValue>(() => {
    const subtotal = lines.reduce((s, l) => s + lineUnitPrice(l) * l.qty, 0);

    const discountFor = (sub: number) => {
      const p = PROMOS.find((x) => x.code === promoCode);
      if (!p || sub < p.minSubtotal) return 0;
      const raw = (sub * p.percent) / 100;
      return Math.min(raw, p.maxOff);
    };

    return {
      restaurant,
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      promoCode,
      tip,
      isEmpty: lines.length === 0,
      conflictsWith: (r) => restaurant != null && restaurant.id !== r.id && lines.length > 0,
      qtyOf: (itemId) => lines.filter((l) => l.item.id === itemId).reduce((s, l) => s + l.qty, 0),
      add: (r, item, opts = {}) => {
        const { variant, addons = [], instructions = "", qty = 1 } = opts;
        setRestaurant((prev) => (prev?.id === r.id ? prev : r));
        setLines((prev) => {
          let next = prev;
          if (restaurant && restaurant.id !== r.id) next = [];
          const idx = next.findIndex(
            (l) =>
              l.item.id === item.id &&
              l.variant?.name === variant?.name &&
              sameAddons(l.addons, addons) &&
              l.instructions === instructions
          );
          if (idx >= 0) {
            const copy = [...next];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
            return copy;
          }
          return [
            ...next,
            { cartId: `${item.id}-${Date.now()}-${Math.random()}`, item, qty, variant, addons, instructions },
          ];
        });
      },
      increment: (cartId) =>
        setLines((prev) => prev.map((l) => (l.cartId === cartId ? { ...l, qty: l.qty + 1 } : l))),
      decrement: (cartId) =>
        setLines((prev) => {
          const next = prev
            .map((l) => (l.cartId === cartId ? { ...l, qty: l.qty - 1 } : l))
            .filter((l) => l.qty > 0);
          if (next.length === 0) setRestaurant(null);
          return next;
        }),
      clear: () => {
        setLines([]);
        setRestaurant(null);
        setPromoCode(null);
        setTipState(0);
      },
      applyPromo: (code) => {
        const c = code.trim().toUpperCase();
        if (!c) return "Enter a promo code.";
        const p = PROMOS.find((x) => x.code === c);
        if (!p) return "Invalid or expired code.";
        if (subtotal < p.minSubtotal) return `Add items worth ₹${p.minSubtotal} to use this code.`;
        setPromoCode(c);
        return null;
      },
      removePromo: () => setPromoCode(null),
      setTip: (v) => setTipState(v < 0 ? 0 : v),
      totals: () => {
        const r = restaurant;
        const rawSubtotal = subtotal;
        const discount = discountFor(rawSubtotal);
        let base = rawSubtotal;
        let taxAmt = 0;
        if (r && r.enableTax) {
          const pct = r.taxPercentage;
          if (r.taxMethod === "inclusive") {
            base = rawSubtotal / (1 + pct / 100);
            taxAmt = rawSubtotal - base;
          } else {
            taxAmt = rawSubtotal * (pct / 100);
          }
        }
        const preDiscount = r && r.enableTax && r.taxMethod === "inclusive" ? rawSubtotal : base + taxAmt;
        const cappedDiscount = Math.min(discount, preDiscount);
        const total = preDiscount - cappedDiscount + tip;
        return {
          subtotal: r && r.enableTax && r.taxMethod === "inclusive" ? base : rawSubtotal,
          tax: taxAmt,
          discount: cappedDiscount,
          tip,
          total,
        };
      },
    };
  }, [restaurant, lines, promoCode, tip]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  return useContext(Ctx);
}
