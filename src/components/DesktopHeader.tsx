import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Search,
  ShoppingBag,
  User,
  Bike,
  Store,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import {
  getDiscoveryLocation,
  onLocationChange,
  type DeliveryLocation,
} from "@/services/location";
import { subscribeMyOrders } from "@/services/orders";
import type { CustomerOrder } from "@/types";
import { LocationPickerSheet } from "@/components/LocationPickerSheet";

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

export function DesktopHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useCart();
  const totals = cart.totals();

  const [loc, setLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [showPicker, setShowPicker] = useState(false);
  const [query, setQuery] = useState("");
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    return onLocationChange((newLoc) => {
      setLoc(newLoc);
    });
  }, []);

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

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  }

  const isAccount = pathname === "/account";

  return (
    <>
      <header className="hidden md:block sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
          {/* Logo & Location */}
          <div className="flex items-center gap-8">
            <Link to="/order" className="flex items-center gap-2.5 group hover:opacity-95 transition-opacity">
              <img
                src="/the-kada-logo.png"
                alt="The Kada - Food Delivery & Dining"
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </Link>

            {/* Location Selector Pill */}
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/80 px-4 py-2.5 text-left transition-all hover:border-primary/40 group max-w-xs"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="truncate text-sm font-black text-slate-800">
                    {loc.label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                </div>
                <p className="truncate text-[11px] font-semibold text-slate-500">
                  {loc.isGps ? "Current GPS location" : "Click to change area"}
                </p>
              </div>
            </button>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for restaurants or dishes..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </form>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            {/* Active Live Order Pill */}
            {activeOrder && (
              <Link
                to={`/orders/${activeOrder.id}`}
                className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 text-xs font-black text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors animate-pulse"
              >
                <Bike className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[130px]">
                  Tracking Order · {activeOrder.status.replace(/_/g, " ")}
                </span>
              </Link>
            )}

            <Link
              to="/add-restaurant"
              className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-primary transition-colors border border-slate-200/80 hover:border-primary/40 rounded-xl px-3 py-1.5 bg-slate-50 hover:bg-primary/5"
            >
              <Store className="h-3.5 w-3.5 text-primary" />
              <span>Add restaurant</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 transition-all text-slate-800 font-bold"
            >
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span className="text-sm">
                Cart {cart.count > 0 && `(${cart.count})`}
              </span>
              {cart.count > 0 && (
                <span className="ml-1 rounded-lg bg-primary px-2 py-0.5 text-xs font-black text-white">
                  {formatMoney(totals.total, cart.restaurant?.currency)}
                </span>
              )}
            </Link>

            {/* User Profile / Account */}
            <Link
              to="/account"
              className={`flex items-center gap-2.5 rounded-2xl border p-1.5 pr-3.5 transition-all ${
                isAccount
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-xs font-black text-white shadow-xs">
                {user ? (user.displayName?.[0] ?? user.email?.[0] ?? "U").toUpperCase() : <User className="h-4 w-4" />}
              </div>
              <span className="max-w-[100px] truncate text-xs font-black">
                {user?.displayName || "Account"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Location Picker Sheet Modal */}
      <LocationPickerSheet
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onLocationSelected={(selected) => setLoc(selected)}
      />
    </>
  );
}
