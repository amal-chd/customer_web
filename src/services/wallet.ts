import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import { loadRazorpay, warmPayments } from "./razorpay";

/** Call as the wallet screen opens, so "Add money" opens Razorpay at once. */
export function warmWalletTopup(): void {
  void loadRazorpay();
  warmPayments(["createWalletTopupOrder"]);
}

/** Razorpay top-up. The server prices the order and credits the wallet only after capture. */
export async function topUpWallet(opts: {
  amountRupees: number;
  name: string;
  email: string;
  contact: string;
}): Promise<number | null> {
  // Script and gateway order load side by side; they used to run in turn.
  const scriptReady = loadRazorpay();
  const create = await httpsCallable(functions, "createWalletTopupOrder")({ amount: opts.amountRupees });
  const data = create.data as { razorpayOrderId: string; amount: number; currency: string; keyId: string };
  if (!(await scriptReady)) throw new Error("Could not load Razorpay. Check your connection.");
  warmPayments(["verifyWalletTopup"]);

  const result = await new Promise<{ paymentId: string; orderId: string; signature: string } | null>((resolve) => {
    const rzp = new window.Razorpay({
      key: data.keyId,
      order_id: data.razorpayOrderId,
      amount: data.amount,
      currency: data.currency,
      name: "The Kada",
      description: "Wallet top-up",
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
    rzp.on("payment.failed", () => resolve(null));
    rzp.open();
  });

  if (!result) return null;

  const verify = await httpsCallable(functions, "verifyWalletTopup")({
    razorpayOrderId: result.orderId,
    razorpayPaymentId: result.paymentId,
    razorpaySignature: result.signature,
  });
  const credited = (verify.data as { newBalance?: number }).newBalance;
  return typeof credited === "number" ? credited : opts.amountRupees;
}

/** Pay for an order using The Kada Wallet balance */
export async function payWithWallet(orderId: string): Promise<{ newBalance: number }> {
  const call = httpsCallable(functions, "payOrderWithWallet");
  const res = await call({ orderId });
  return res.data as { newBalance: number };
}

