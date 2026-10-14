import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadCheckoutScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
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
export async function payForOrder(opts: {
  orderId: string;
  amountRupees: number;
  name: string;
  email: string;
  contact: string;
}): Promise<"paid" | "pending" | "cancelled"> {
  const loaded = await loadCheckoutScript();
  if (!loaded) throw new Error("Could not load the payment gateway. Check your connection.");

  // 1. Create the Razorpay order server-side.
  const createFn = httpsCallable(functions, "createRazorpayOrder");
  // Only the order id: the server prices the order itself.
  let create;
  try {
    create = await createFn({ orderId: opts.orderId });
  } catch (e: any) {
    // A payment for this order already reached the gateway (e.g. an earlier
    // tab): don't open a second checkout.
    if (e?.details?.reason === "payment_confirming" || e?.details?.reason === "already_paid") return "pending";
    throw e;
  }
  const data = create.data as { razorpayOrderId: string; amount: number; currency: string; keyId: string };

  // 2. Open checkout and await the result.
  const result = await new Promise<{ paymentId: string; orderId: string; signature: string } | null>(
    (resolve) => {
      const rzp = new window.Razorpay({
        key: data.keyId,
        order_id: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency,
        name: "The Kada",
        description: `Order ${opts.orderId}`,
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
