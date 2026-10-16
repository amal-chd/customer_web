import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "@/lib/firebase";
import { orderFromDoc, restaurantFromDoc, type CartLine, type CustomerOrder, type DeliveryAddress, type Restaurant } from "@/types";

export interface BillRow {
  key: string;
  label: string;
  amountPaise: number;
  originalPaise?: number;
  free?: boolean;
  note?: string;
  info?: string;
  children?: BillRow[];
}

/** A server quote: the compact bill (functions/src/pricing/bill.ts) and the plain rows. */
export interface OrderQuote {
  quoteId: string;
  totalPaise: number;
  bill: { rows: BillRow[]; totalPaise: number; savingsPaise: number } | null;
  display: BillRow[];
  problems: string[];
}

export interface QuoteRequest {
  restaurantId: string;
  lines: CartLine[];
  drop: { lat: number; lng: number } | null;
  couponCode: string | null;
  tipRupees: number;
}

/** Price the cart on the server. The browser never computes what is charged. */
export async function quoteOrder(req: QuoteRequest): Promise<OrderQuote> {
  const quoted = await httpsCallable(functions, "quoteFoodOrder")({
    restaurantId: req.restaurantId,
    fulfilment: "delivery",
    drop: req.drop,
    couponCode: req.couponCode,
    tipPaise: Math.round(req.tipRupees * 100),
    donationPaise: 0,
    items: req.lines.map((l) => ({
      menuItemId: l.item.id,
      qty: l.qty,
      selectedVariant: l.variant ? { name: l.variant.name } : null,
      selectedAddons: l.addons.map((a) => ({ name: a.name })),
    })),
  });
  const q = quoted.data as {
    quoteId?: string;
    problems?: string[];
    couponProblem?: string | null;
    totals?: { totalPaise?: number };
    bill?: OrderQuote["bill"];
    display?: BillRow[];
  };
  if (!q.quoteId) throw new Error("Couldn't work out your total. Please try again.");
  return {
    quoteId: q.quoteId,
    totalPaise: q.totals?.totalPaise ?? 0,
    bill: q.bill ?? null,
    display: q.display ?? [],
    problems: [...(q.problems ?? []), ...(q.couponProblem ? [q.couponProblem] : [])],
  };
}

/** Create the order from the exact quote the customer saw. */
export async function placeQuotedOrder(opts: {
  quote: OrderQuote;
  paymentMethod: "cod" | "razorpay" | "wallet";
  customerName: string;
  customerPhone: string;
  instructions: string;
  scheduledFor?: Date;
  address: DeliveryAddress;
  idempotencyKey: string;
}): Promise<{ orderId: string; totalPaise: number }> {
  if (opts.quote.problems.length > 0) throw new Error(opts.quote.problems[0]);
  const placed = await httpsCallable(functions, "placeFoodOrder")({
    quoteId: opts.quote.quoteId,
    idempotencyKey: opts.idempotencyKey,
    paymentMethod: opts.paymentMethod,
    customerName: opts.customerName,
    customerPhone: opts.customerPhone,
    instructions: opts.instructions,
    scheduledFor: opts.scheduledFor ? opts.scheduledFor.getTime() : null,
    address: {
      line1: opts.address.line1,
      area: opts.address.area,
      landmark: opts.address.landmark,
      pincode: opts.address.pincode,
      lat: opts.address.lat,
      lng: opts.address.lng,
      text: [opts.address.line1, opts.address.area, opts.address.landmark, opts.address.pincode]
        .filter((s) => s && s.trim())
        .join(", "),
    },
  });
  const data = placed.data as { orderId?: string; totalPaise?: number };
  if (!data.orderId) throw new Error("Couldn't place the order. Please try again.");
  return { orderId: data.orderId, totalPaise: data.totalPaise ?? opts.quote.totalPaise };
}

export function subscribeMyOrders(cb: (orders: CustomerOrder[]) => void): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    cb([]);
    return () => {};
  }
  const q = query(collection(db, "orders"), where("customerUid", "==", uid));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(orderFromDoc);
    list.sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
    cb(list);
  });
}

export function subscribeOrder(
  orderId: string,
  cb: (order: CustomerOrder) => void,
  onMissing?: () => void
): () => void {
  return onSnapshot(
    doc(db, "orders", orderId),
    (snap) => (snap.exists() ? cb(orderFromDoc(snap)) : onMissing?.()),
    () => onMissing?.()
  );
}

export async function getRestaurant(id: string): Promise<Restaurant | null> {
  const snap = await getDoc(doc(db, "restaurants", id));
  if (!snap.exists()) return null;
  return restaurantFromDoc(snap);
}

export async function submitReview(opts: {
  restaurantId: string;
  orderId: string;
  foodRating: number;
  deliveryRating: number;
  text?: string;
  customerName?: string;
}) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Please sign in to leave a review.");
  const overall = [opts.foodRating, opts.deliveryRating].filter((s) => s > 0);
  const rating = overall.length ? overall.reduce((a, b) => a + b, 0) / overall.length : 0;
  await setDoc(
    doc(db, "restaurants", opts.restaurantId, "reviews", uid),
    {
      customerUid: uid,
      restaurantId: opts.restaurantId,
      orderId: opts.orderId,
      foodRating: opts.foodRating,
      deliveryRating: opts.deliveryRating,
      rating,
      text: (opts.text ?? "").trim(),
      customerName: (opts.customerName ?? "").trim(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
  await setDoc(
    doc(db, "orders", opts.orderId),
    { foodRating: opts.foodRating, deliveryRating: opts.deliveryRating, ratedAt: serverTimestamp() },
    { merge: true }
  );
}
