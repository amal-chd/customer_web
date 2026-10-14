import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ReceiptText,
  Clock,
  ChevronRight,
  CheckCircle2,
  Bike,
  Repeat,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { CustomerOrder, MenuItem } from "@/types";
import { subscribeMyOrders, getRestaurant } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { Spinner } from "@/components/bits";
import { displayOrderNumber } from "@/lib/orderNumber";
import { toast } from "@/components/Toast";

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
  const cart = useCart();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "delivered" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reorderingId, setReorderingId] = useState<string | null>(null);

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

  async function handleReorder(order: CustomerOrder) {
    setReorderingId(order.id);
    try {
      const rest = await getRestaurant(order.restaurantId);
      if (!rest) {
        toast("Restaurant is currently unavailable.");
        return;
      }

      if (cart.restaurant && cart.restaurant.id !== rest.id && !cart.isEmpty) {
        cart.clear();
      }

      for (let i = 0; i < order.items.length; i++) {
        const it = order.items[i];
        const menuItem: MenuItem = {
          id: it.id || it.menuItemId || `reorder-${i}`,
          restaurantId: order.restaurantId,
          name: it.name || "Item",
          price: it.price || 0,
          category: it.category || "General",
          image: it.image || it.imageUrl,
          isVeg: it.isVeg ?? true,
          isAvailable: true,
          isRecommended: false,
          variants: it.variants || [],
          addons: it.addons || [],
        };
        cart.add(rest, menuItem, {
          variant: it.variant || it.selectedVariant,
          addons: it.addons || it.selectedAddons || [],
          qty: it.qty || 1,
        });
      }

      toast("Items added to your cart!");
      navigate("/cart");
    } catch {
      toast("Could not reorder. Please browse the restaurant menu.");
    } finally {
      setReorderingId(null);
    }
  }

  const activeOrders = useMemo(
    () => orders.filter((o) => ACTIVE.includes(o.status.toLowerCase())),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const isAct = ACTIVE.includes(o.status.toLowerCase());
      const isDel = o.status === "delivered" || o.status === "completed";
      const isCan = ["cancelled", "canceled", "rejected"].includes(o.status.toLowerCase());

      if (filter === "active" && !isAct) return false;
      if (filter === "delivered" && !isDel) return false;
      if (filter === "cancelled" && !isCan) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.restaurantName.toLowerCase().includes(q);
        const matchesItems = o.items.some((i: any) => i.name?.toLowerCase().includes(q));
        const matchesNum = displayOrderNumber(o.orderNumber, o.id).toLowerCase().includes(q);
        if (!matchesName && !matchesItems && !matchesNum) return false;
      }

      return true;
    });
  }, [orders, filter, searchQuery]);

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
        <p className="mt-2 text-xs font-bold text-slate-400">Loading your orders…</p>
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
      {/* Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Your Orders</h1>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Track active deliveries and review previous orders
              </p>
            </div>

            {/* Order Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders or dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-t border-slate-100 mt-5 pt-3 overflow-x-auto no-scrollbar">
            {(
              [
                { id: "all", label: `All (${orders.length})` },
                { id: "active", label: `Active (${activeOrders.length})` },
                {
                  id: "delivered",
                  label: `Delivered (${
                    orders.filter((o) => o.status === "delivered" || o.status === "completed").length
                  })`,
                },
                {
                  id: "cancelled",
                  label: `Cancelled (${
                    orders.filter((o) =>
                      ["cancelled", "canceled", "rejected"].includes(o.status.toLowerCase())
                    ).length
                  })`,
                },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all shrink-0 ${
                  filter === t.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6 space-y-6">
        {/* Active Orders Banner (if any) */}
        {activeOrders.length > 0 && filter !== "delivered" && filter !== "cancelled" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">
                Live Active Orders
              </h2>
            </div>
            {activeOrders.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/5 via-indigo-50 to-primary/10 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 shrink-0">
                    <Bike className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">{o.restaurantName}</h3>
                      <span className="rounded-md bg-white px-2 py-0.5 text-xs font-black text-primary border border-primary/20">
                        {displayOrderNumber(o.orderNumber, o.id)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">
                      Status: <span className="text-primary uppercase">{o.status}</span>
                    </p>
                    <p className="text-xs font-medium text-slate-500 line-clamp-1">
                      {o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="rounded-2xl bg-primary px-5 py-3 text-xs font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Track Live Order</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Orders Listing */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-xs">
            <ReceiptText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No orders match your filter</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">
              Try searching for something else or reset your filter.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o) => {
              const active = ACTIVE.includes(o.status.toLowerCase());
              const isDelivered = o.status === "delivered" || o.status === "completed";
              const isCancelled = ["cancelled", "canceled", "rejected"].includes(
                o.status.toLowerCase()
              );

              return (
                <div
                  key={o.id}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-primary transition-colors">
                          {o.restaurantName || "Restaurant"}
                        </h3>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                          {displayOrderNumber(o.orderNumber, o.id)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {o.timestamp ? new Date(o.timestamp).toLocaleString() : "Recent"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-black ${
                          active
                            ? "bg-primary/10 text-primary animate-pulse"
                            : isDelivered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isCancelled
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {active ? <Bike className="h-3.5 w-3.5" /> : null}
                        {active ? "Live Tracking" : o.status[0]?.toUpperCase() + o.status.slice(1)}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {formatMoney(o.total, o.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <p className="text-xs font-semibold text-slate-600">
                    {o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <span>View Details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => handleReorder(o)}
                      disabled={reorderingId === o.id}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {reorderingId === o.id ? (
                        <>
                          <Spinner className="h-3.5 w-3.5 text-white" />
                          <span>Adding…</span>
                        </>
                      ) : (
                        <>
                          <Repeat className="h-3.5 w-3.5" />
                          <span>1-Click Reorder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
