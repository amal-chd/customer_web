import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText, Clock, ChevronRight, CheckCircle2, Bike } from "lucide-react";
import type { CustomerOrder } from "@/types";
import { subscribeMyOrders } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/currency";
import { Spinner } from "@/components/bits";
import { displayOrderNumber } from "@/lib/orderNumber";

const ACTIVE = [
  "new",
  "pending",
  "preparing",
  "cooking",
  "accepted",
  "in_progress",
  "ready",
  "out_for_delivery",
  "dispatched",
];

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    const unsub = subscribeMyOrders((list) => {
      setOrders(list);
      setLoading(false);
    });
    return unsub;
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <Centered>
        <ReceiptText className="h-12 w-12 text-slate-300" />
        <p className="mt-3 text-lg font-black text-slate-900">Sign in to see your orders</p>
        <Link to="/login?next=/orders" className="btn-primary mt-5">
          Sign In
        </Link>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <Spinner className="h-8 w-8 text-primary" />
      </Centered>
    );
  }

  if (orders.length === 0) {
    return (
      <Centered>
        <div className="relative mb-6 w-24 h-24">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          <img
            src="/character-1.jpg"
            alt="No Orders"
            className="relative w-full h-full object-cover rounded-full mix-blend-multiply"
          />
        </div>
        <p className="mt-4 text-2xl font-black text-slate-900 tracking-tight">No orders yet</p>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Looks like you haven't ordered anything yet.
        </p>
        <Link to="/order" className="btn-primary mt-6">
          Browse restaurants
        </Link>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Your Orders</h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Track active deliveries and review previous orders
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 space-y-4">
        {orders.map((o) => {
          const active = ACTIVE.includes(o.status.toLowerCase());
          return (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="group block rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-black text-slate-900 group-hover:text-primary transition-colors">
                      {o.restaurantName || "Restaurant"}
                    </h3>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                      {displayOrderNumber(o.orderNumber, o.id)}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-xs font-semibold text-slate-500">
                    {o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">
                      {formatMoney(o.total, o.currency)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-medium text-slate-400">
                      {o.timestamp ? new Date(o.timestamp).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black ${
                      active
                        ? "bg-primary/10 text-primary animate-pulse"
                        : o.status === "delivered" || o.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {active ? <Bike className="h-3.5 w-3.5" /> : null}
                    {active ? "Live Tracking" : o.status[0]?.toUpperCase() + o.status.slice(1)}
                  </span>
                  <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                    <span>View details</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  );
}
