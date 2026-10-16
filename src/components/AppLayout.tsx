import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bike, UtensilsCrossed, Search, ReceiptText, User, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/SupportChat";
import { DesktopHeader } from "@/components/DesktopHeader";
import { subscribeMyOrders } from "@/services/orders";
import type { CustomerOrder } from "@/types";

const ACTIVE_ORDER_STATUSES = [
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

const TABS = [
  {
    to: "/order",
    label: "Delivery",
    icon: Bike,
    match: (path: string) =>
      (path === "/order" || path === "/" || (path.startsWith("/order") && !path.includes("dining"))),
  },
  {
    to: "/order?vertical=dining",
    label: "Dining",
    icon: UtensilsCrossed,
    match: (path: string) => path.includes("dining"),
  },
  {
    to: "/search",
    label: "Search",
    icon: Search,
    match: (path: string) => path.startsWith("/search"),
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ReceiptText,
    match: (path: string) => path.startsWith("/orders"),
    badge: true,
  },
  {
    to: "/account",
    label: "Account",
    icon: User,
    match: (path: string) => path.startsWith("/account") || path.startsWith("/login"),
  },
];

export function AppLayout() {
  const location = useLocation();
  const currentPath = location.pathname + location.search;
  const { user } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const totals = cart.totals();
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveOrder(null);
      return;
    }
    const unsub = subscribeMyOrders((orders) => {
      const active = orders.find((o) =>
        ACTIVE_ORDER_STATUSES.includes(o.status.toLowerCase())
      );
      setActiveOrder(active || null);
    });
    return unsub;
  }, [user]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-slate-50 antialiased">
      {/* Responsive Desktop Header */}
      <DesktopHeader />

      {/* Main Content Area: Responsive container with generous bottom clearance for floating dock */}
      <main className="flex-1 pb-28 sm:pb-32 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Floating Cart Bar (Floats right above the nav capsule like in mobile app) */}
      {!cart.isEmpty && location.pathname !== "/cart" && (
        <div className="md:hidden fixed inset-x-3 bottom-[82px] z-40 mx-auto max-w-md animate-in slide-in-from-bottom-3 duration-200">
          <button
            onClick={() => navigate("/cart")}
            className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-4 py-3 text-white shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shrink-0">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate text-xs font-black">
                {cart.count} item{cart.count === 1 ? "" : "s"}
                {cart.restaurant ? ` · ${cart.restaurant.name}` : ""}
              </p>
              <p className="text-xs font-extrabold text-white/90">
                {formatMoney(totals.total, cart.restaurant?.currency)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-black bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors shrink-0">
              <span>View Cart</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Floating Modern Capsule Nav (Matching The Kada White & Royal Blue Style) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto select-none"
      >
        <div className="relative flex items-center justify-around h-[64px] px-2 rounded-[24px] bg-white/95 text-slate-700 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.16),0_4px_12px_rgba(15,23,42,0.06)] pb-[env(safe-area-inset-bottom)]">
          {TABS.map((t) => {
            const active = t.match(currentPath);
            const Icon = t.icon;
            const showActiveOrderBadge = t.badge && Boolean(activeOrder);

            return (
              <Link
                key={t.label}
                to={t.to}
                className={cn(
                  "relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 active:scale-90",
                  active
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {active && (
                  <span className="absolute inset-x-1.5 inset-y-1 rounded-xl bg-gradient-to-r from-primary to-blue-600 shadow-md shadow-primary/30 -z-10 animate-in fade-in zoom-in-95 duration-200" />
                )}
                <div className="relative flex items-center justify-center">
                  <Icon className={cn("h-5 w-5 transition-transform", active ? "scale-105 text-white" : "text-slate-500")} strokeWidth={active ? 2.5 : 2} />
                  {showActiveOrderBadge && (
                    <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white" />
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] mt-1 tracking-tight leading-none", active ? "font-black text-white" : "font-bold text-slate-600")}>
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <SupportChat />
    </div>
  );
}
