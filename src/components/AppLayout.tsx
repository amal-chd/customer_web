import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Search, ReceiptText, User, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/SupportChat";
import { DesktopHeader } from "@/components/DesktopHeader";

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
    <div className="flex min-h-[100dvh] w-full flex-col bg-slate-50 antialiased">
      {/* Responsive Desktop Header */}
      <DesktopHeader />

      {/* Main Content Area: Responsive container */}
      <main className="flex-1 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Floating Cart Bar */}
      {!cart.isEmpty && pathname !== "/cart" && (
        <div className="md:hidden fixed inset-x-0 bottom-[68px] z-40 mx-auto max-w-lg px-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-3.5 text-white shadow-xl shadow-primary/30 transition-transform active:scale-[0.99]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate text-sm font-black">
                {cart.count} item{cart.count === 1 ? "" : "s"}
                {cart.restaurant ? ` · ${cart.restaurant.name}` : ""}
              </p>
              <p className="text-xs font-bold text-white/80">
                {formatMoney(totals.total, cart.restaurant?.currency)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm font-black bg-white/20 px-3 py-1.5 rounded-xl">
              <span>View Cart</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 mx-auto border-t border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="flex h-[68px] items-center">
          {TABS.map((t) => {
            const active = pathname === t.to || (t.to === "/order" && pathname === "/");
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    active && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={cn("text-[11px]", active ? "font-black" : "font-semibold")}>
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
