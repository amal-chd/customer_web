import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { loadRazorpay, warmPayments } from "./razorpay";

/** The Razorpay order placeFoodOrder creates alongside an online order. */
export interface GatewayOrder {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

/**
 * Full Razorpay pay → verify flow for an existing Firestore order, mirroring
 * the Flutter PaymentService. The Cloud Function creates the Razorpay order
 * (so the amount can't be tampered with) and verifies the signature server-side
 * before the order is marked paid.
 *
 *   "paid"      — verified server-side.
 *   "pending"   — money was taken but confirmation hasn't landed yet; the
 *                 webhook / 5-minute sweep will confirm it. Never shown as a
 *                 failure (that invites paying twice).
 *   "cancelled" — the customer closed checkout; nothing was charged.
 * A refused payment (order closed, paid twice) throws with the server's
 * explanation, which already says the money is on its way back.
 */
/**
 * Loads Razorpay's script and boots the order function while the bill is on
 * screen, so "Place order" opens checkout at once. placeFoodOrder now returns
 * the Razorpay order itself, so createRazorpayOrder is only a fallback and is
 * not worth holding a vCPU warm for; verify is warmed once checkout opens.
 */
export function warmCheckout(): void {
  void loadRazorpay();
  warmPayments(["placeFoodOrder"]);
}

export async function payForOrder(opts: {
  orderId: string;
  amountRupees: number;
  name: string;
  email: string;
  contact: string;
  /** placeFoodOrder's gateway order, when it made one: skips a server call. */
  gateway?: GatewayOrder;
}): Promise<"paid" | "pending" | "cancelled"> {
  // 1. The Razorpay order: normally created by placeFoodOrder in the same
  // call; otherwise ask for it now (only the order id — the server prices it).
  // The script loads in parallel; checkout started it when the page opened.
  const scriptReady = loadRazorpay();
  let data = opts.gateway;
  if (!data) {
    try {
      const create = await httpsCallable(functions, "createRazorpayOrder")({ orderId: opts.orderId });
      data = create.data as GatewayOrder;
    } catch (e: any) {
      // A payment for this order already reached the gateway (e.g. an earlier
      // tab): don't open a second checkout.
      if (e?.details?.reason === "payment_confirming" || e?.details?.reason === "already_paid") return "pending";
      throw e;
    }
  }
  if (!(await scriptReady)) throw new Error("Could not load the payment gateway. Check your connection.");
  const gw = data;

  // 2. Open checkout and await the result.
  const result = await new Promise<{ paymentId: string; orderId: string; signature: string } | null>(
    (resolve) => {
      const rzp = new window.Razorpay({
        key: gw.keyId,
        order_id: gw.razorpayOrderId,
        amount: gw.amount,
        currency: gw.currency,
        name: "The Kada",
        description: "Food order",
        prefill: { name: opts.name, email: opts.email, contact: opts.contact },
        theme: { color: "#2563EB" },
        handler: (r: any) =>
          resolve({
            paymentId: r.razorpay_payment_id,
            orderId: r.razorpay_order_id,
            signature: r.razorpay_signature,
          }),
        modal: { ondismiss: () => resolve(null) },
      });
      rzp.open();
      // Boot verification while the customer enters payment details.
      warmPayments(["verifyRazorpayPayment"]);
    }
  );

  if (!result) return "cancelled"; // customer closed the checkout

  // 3. Verify the signature server-side before trusting success.
  const verifyFn = httpsCallable(functions, "verifyRazorpayPayment");
  try {
    await verifyFn({
      orderId: opts.orderId,
      razorpayOrderId: result.orderId,
      razorpayPaymentId: result.paymentId,
      razorpaySignature: result.signature,
    });
  } catch (e: any) {
    // Refused payments carry details.reason === "refunded" and a message
    // that explains the refund — surface those. Anything else (network,
    // gateway slow) means the money is taken and confirmation will follow.
    if (e?.details?.reason === "refunded" || e?.code === "functions/permission-denied") throw e;
    return "pending";
  }
  return "paid";
}
