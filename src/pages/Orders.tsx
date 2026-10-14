import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import type { CustomerOrder } from "@/types";
import { subscribeMyOrders } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/currency";
import { Spinner } from "@/components/bits";
import { displayOrderNumber } from "@/lib/orderNumber";

const ACTIVE = ["new", "pending", "preparing", "cooking", "accepted", "in_progress", "ready", "out_for_delivery", "dispatched"];

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    const unsub = subscribeMyOrders((list) => { setOrders(list); setLoading(false); });
    return unsub;
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <Centered>
        <ReceiptText className="h-12 w-12 text-sub" />
        <p className="mt-3 text-lg font-black">Sign in to see your orders</p>
        <Link to="/login?next=/orders" className="btn-primary mt-5">Sign in</Link>
      </Centered>
    );
  }

  if (loading) return <Centered><Spinner className="h-8 w-8" /></Centered>;

  if (orders.length === 0) {
    return (
      <Centered>
        <div className="relative mb-6 w-24 h-24">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
          <img src="/character-1.jpg" alt="No Orders" className="relative w-full h-full object-cover rounded-full mix-blend-multiply" />
        </div>
        <p className="mt-4 text-2xl font-black text-slate-900 tracking-tight">No orders yet</p>
        <p className="mt-2 text-sm font-medium text-slate-500">Looks like you haven't ordered anything.</p>
        <Link to="/order" className="btn-primary mt-6">Browse restaurants</Link>
      </Centered>
    );
  }

  return (
    <div className="px-4 pt-6 bg-slate-50 min-h-[100dvh]">
      <h1 className="text-xl font-black">Your orders</h1>
      <div className="mt-4 space-y-3">
        {orders.map((o) => {
          const active = ACTIVE.includes(o.status.toLowerCase());
          return (
            <Link key={o.id} to={`/orders/${o.id}`} className="card block p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{o.restaurantName || "Restaurant"}</p>
                  <p className="text-xs font-bold text-sub">{displayOrderNumber(o.orderNumber, o.id)}</p>
                  <p className="mt-1 truncate text-xs font-medium text-sub">
                    {o.items.map((i: any) => i.name).join(", ")}
                  </p>
                </div>
                <span className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-black ${o.status === 'scheduled' ? 'bg-purple-100 text-purple-600' : (active ? "bg-primary/10 text-primary" : "bg-canvas text-sub")}`}>
                  {o.status === 'scheduled' ? "Scheduled" : (active ? "Track" : o.status[0]?.toUpperCase() + o.status.slice(1))}
                </span>
              </div>
              <div className="mt-2 text-sm font-black text-primary">{formatMoney(o.total, o.currency)}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">{children}</div>;
}
