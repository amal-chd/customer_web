import type { BillRow } from "@/services/orders";
import type { DocumentSnapshot } from "firebase/firestore";

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
  geohash?: string;
  enableTax: boolean;
  taxPercentage: number;
  taxMethod: "inclusive" | "exclusive";
  taxLabel: string;
  currency: string;
  hours?: string;
  cuisine?: string;
  enableReservations: boolean;
  ratingAvg?: number;
  ratingCount: number;
  distanceKm: number;
  acceptingOrders: boolean;
  pausedUntil?: Date;
}

export function restaurantFromDoc(doc: DocumentSnapshot): Restaurant {
  const d = (doc.data() ?? {}) as any;
  const loc = d.location;
  return {
    id: doc.id,
    name: String(d.name ?? "Restaurant"),
    address: String(d.address ?? ""),
    logoUrl: d.logoUrl ? String(d.logoUrl) : undefined,
    lat: loc?.lat != null ? Number(loc.lat) : undefined,
    lng: loc?.lng != null ? Number(loc.lng) : undefined,
    geohash: d.geohash ? String(d.geohash) : undefined,
    enableTax: d.enableTax === true,
    taxPercentage: Number(d.taxPercentage ?? 5),
    taxMethod: (d.taxMethod ?? "exclusive") as "inclusive" | "exclusive",
    taxLabel: String(d.taxLabel ?? "Tax"),
    currency: String(d.currency ?? "Indian Rupee (INR)"),
    hours: d.hours ? String(d.hours) : undefined,
    cuisine: d.cuisine ? String(d.cuisine) : undefined,
    enableReservations: d.enableReservations === true,
    ratingAvg: d.ratingAvg != null ? Number(d.ratingAvg) : undefined,
    ratingCount: Number(d.ratingCount ?? 0),
    distanceKm: 0,
    acceptingOrders: d.acceptingOrders !== false,
    pausedUntil: d.pausedUntil?.toDate?.() instanceof Date ? d.pausedUntil.toDate() : undefined,
  };
}

export interface MenuVariant {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  isVeg: boolean;
  isAvailable: boolean;
  isRecommended: boolean;
  variants: MenuVariant[];
  addons: MenuVariant[];
}

export function menuItemFromDoc(doc: DocumentSnapshot): MenuItem {
  const d = (doc.data() ?? {}) as any;
  const parse = (v: any): MenuVariant[] =>
    Array.isArray(v)
      ? v
          .filter((e) => e && typeof e === "object")
          .map((e) => ({ name: String(e.name ?? ""), price: Number(e.price ?? 0) }))
      : [];
  return {
    id: doc.id,
    restaurantId: String(d.restaurantId ?? ""),
    name: String(d.name ?? "Item"),
    price: Number(d.price ?? 0),
    category: String(d.category ?? "Other"),
    image: d.imageUrl ?? d.image,
    description: d.description ? String(d.description) : undefined,
    isVeg: d.isVeg !== false,
    isAvailable: (d.isAvailable ?? d.available ?? true) !== false,
    isRecommended: d.isRecommended === true || d.isFeatured === true,
    variants: parse(d.variants),
    addons: parse(d.addons),
  };
}

export interface CartLine {
  cartId: string;
  item: MenuItem;
  qty: number;
  variant?: MenuVariant;
  addons: MenuVariant[];
  instructions: string;
}

export interface DeliveryAddress {
  label: string;
  line1: string;
  area: string;
  landmark: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  restaurantId: string;
  status: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  items: any[];
  timestamp?: Date;
  currency?: string;
  restaurantName: string;
  restaurantLogo: string;
  foodRating: number;
  deliveryRating: number;
  scheduledFor?: Date;
  fulfillmentType?: "now" | "scheduled";
  /** The bill as the customer saw it at checkout (functions/src/pricing/bill.ts), or the plain rows of older orders. */
  bill?: { rows: BillRow[]; totalPaise: number; savingsPaise: number };
}

export function orderFromDoc(doc: DocumentSnapshot): CustomerOrder {
  const d = (doc.data() ?? {}) as any;
  const ts = d.timestamp;
  const sched = d.scheduledFor;
  return {
    id: doc.id,
    // The real number only; displayOrderNumber falls back to a short code.
    orderNumber: String(d.orderNumber ?? ""),
    restaurantId: String(d.restaurantId ?? ""),
    status: String(d.status ?? "new"),
    total: Number(d.total ?? 0),
    paymentMethod: String(d.paymentMethod ?? ""),
    paymentStatus: String(d.paymentStatus ?? "pending"),
    items: Array.isArray(d.items) ? d.items : [],
    timestamp: ts?.toDate ? ts.toDate() : undefined,
    currency: d.currency ? String(d.currency) : undefined,
    restaurantName: String(d.restaurantName ?? ""),
    restaurantLogo: String(d.restaurantLogo ?? ""),
    foodRating: Number(d.foodRating ?? 0),
    deliveryRating: Number(d.deliveryRating ?? 0),
    scheduledFor: sched?.toDate ? sched.toDate() : undefined,
    fulfillmentType: d.fulfillmentType as any,
    bill: billOf(d),
  };
}

function billOf(d: any): CustomerOrder["bill"] {
  if (d.bill && Array.isArray(d.bill.rows) && typeof d.bill.totalPaise === "number") {
    return { rows: d.bill.rows, totalPaise: d.bill.totalPaise, savingsPaise: Number(d.bill.savingsPaise ?? 0) };
  }
  const display = d.pricing?.display;
  if (Array.isArray(display) && display.length > 1) {
    return { rows: display.slice(0, -1), totalPaise: Number(display[display.length - 1].amountPaise ?? 0), savingsPaise: 0 };
  }
  return undefined;
}

/**
 * The restaurant's real average rating, or null when nobody has rated it yet.
 * This used to invent 4.3–4.8 from a hash of the name for unrated places.
 */
export function displayRating(r: Restaurant): number | null {
  return r.ratingAvg != null && r.ratingCount > 0 ? r.ratingAvg : null;
}
