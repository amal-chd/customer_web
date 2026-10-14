import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ReceiptText, User, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/SupportChat";

const TABS = [
  { to: "/order", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/orders", label: "Orders", icon: ReceiptText },
  { to: "/account", label: "Account", icon: User },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const cart = useCart();
  const navigate = useNavigate();
  const totals = cart.totals();

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col bg-canvas">
      <main className="flex-1 pb-32">
        <Outlet />
      </main>

      {/* Cart bar */}
      {!cart.isEmpty && pathname !== "/cart" && (
        <div className="fixed inset-x-0 bottom-[68px] z-40 mx-auto max-w-2xl px-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex w-full items-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-white shadow-lift transition-transform active:scale-[0.99]"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="flex-1 truncate text-left text-sm font-bold">
              {cart.count} item{cart.count === 1 ? "" : "s"}
              {cart.restaurant ? ` · ${cart.restaurant.name}` : ""}
            </span>
            <span className="text-sm font-black">
              View cart {formatMoney(totals.total, cart.restaurant?.currency)}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-2xl border-t border-line bg-white">
        <div className="flex h-[68px] items-center">
          {TABS.map((t) => {
            const active = pathname === t.to || (t.to === "/order" && pathname === "/order");
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1",
                  active ? "text-primary" : "text-sub"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
                <span className={cn("text-[11px]", active ? "font-extrabold" : "font-semibold")}>
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
