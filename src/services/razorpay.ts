import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Razorpay's checkout script, loaded once and shared by every pay button.
 *
 * Checkout and the wallet each used to inject the script only after the tap
 * and then wait for it before even asking the server for an order, so the
 * customer sat through the script download and the server call one after the
 * other. Pages now call this as they open; the tap finds it ready. A failed
 * load is forgotten so the next attempt retries instead of failing forever.
 */
let script: Promise<boolean> | null = null;
export function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  if (!script) {
    script = new Promise<boolean>((resolve) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => {
        s.remove();
        script = null;
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }
  return script;
}

/**
 * Boots the Cloud Functions the next tap needs while the customer is still on
 * the page — a cold one takes seconds to start. The server answers
 * `{__warm: true}` before auth and primes its database connection
 * (functions/src/warmup.ts). Only warm the NEXT step: each warm instance holds
 * a vCPU of the region's small quota (same rule as the app's PaymentWarmup).
 */
const warmedAt = new Map<string, number>();
export function warmPayments(callables: string[]): void {
  const now = Date.now();
  for (const name of callables) {
    if (now - (warmedAt.get(name) ?? 0) < 4 * 60_000) continue;
    warmedAt.set(name, now);
    void httpsCallable(functions, name)({ __warm: true }).catch(() => undefined);
  }
}
