import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Utensils,
  BellRing,
  PhoneOff,
  DoorClosed,
  Building,
} from "lucide-react";
import { useCart, PROMOS } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { toast } from "@/components/Toast";
import { VegDot } from "@/components/bits";

const TIPS = [10, 20, 30, 50];

const INSTRUCTIONS = [
  { id: "door", label: "Leave at door", icon: DoorClosed },
  { id: "nocall", label: "Avoid calling", icon: PhoneOff },
  { id: "nobell", label: "Do not ring bell", icon: BellRing },
  { id: "guard", label: "Leave with security", icon: Building },
];

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [noCutlery, setNoCutlery] = useState(false);
  const [selectedInstructions, setSelectedInstructions] = useState<string[]>([]);
  // The free-delivery threshold the server prices with (0 / missing = no such offer).
  const [freeAbove, setFreeAbove] = useState(0);
  useEffect(() => {
    getDoc(doc(db, "config", "platform"))
      .then((snap) => setFreeAbove(Number(snap.data()?.freeDeliveryAbove) || 0))
      .catch(() => {});
  }, []);

  const totals = cart.totals();
  const cur = cart.restaurant?.currency;

  function toggleInstruction(label: string) {
    setSelectedInstructions((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  }

  if (cart.isEmpty) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center animate-in fade-in duration-200">
        <div className="relative mb-6 w-24 h-24 sm:w-28 sm:h-28 mx-auto">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img
            src="/logo.png"
            alt="The Kada"
            className="relative w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
        <p className="mt-2 text-sm font-medium text-slate-500 max-w-sm">
          Good food is always cooking! Add delicious dishes from nearby restaurants or stores to get started.
        </p>
        <Link
          to="/order"
          className="mt-8 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-8 py-4 text-sm font-black text-white shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <span>Explore Restaurants & Stores</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const freeDeliveryDiff = Math.max(0, freeAbove - totals.subtotal);
  const freeDeliveryPercent = freeAbove > 0 ? Math.min(100, Math.round((totals.subtotal / freeAbove) * 100)) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-200 antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <div className="border-b border-slate-100 bg-white shadow-xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Your Cart</h1>
              {cart.restaurant && (
                <Link
                  to={`/restaurant/${cart.restaurant.id}`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {cart.restaurant.name} &bull; View Menu
                </Link>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your cart?")) {
                cart.clear();
                toast("Cart cleared");
              }
            }}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Free Delivery Goal Tracker */}
        {freeAbove > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Sparkles className="h-4 w-4 text-primary" />
              {freeDeliveryDiff === 0
                ? "🎉 You have unlocked FREE Delivery!"
                : `Add ${formatMoney(freeDeliveryDiff, cur)} more for FREE Delivery`}
            </span>
            <span className="text-primary">{freeDeliveryPercent}%</span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items, Cutlery, Instructions, Tip (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Added Items Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-slate-900">Items Added</h2>
                <span className="text-xs font-bold text-slate-400">
                  {cart.count} item{cart.count === 1 ? "" : "s"}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {cart.lines.map((l) => {
                  const unit =
                    (l.variant?.price ?? l.item.price) +
                    l.addons.reduce((s, a) => s + a.price, 0);
                  return (
                    <div key={l.cartId} className="flex items-start justify-between gap-4 py-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <VegDot veg={l.item.isVeg} />
                          <p className="text-sm font-black text-slate-900">
                            {l.item.name}
                            {l.variant ? ` (${l.variant.name})` : ""}
                          </p>
                        </div>
                        {l.addons.length > 0 && (
                          <p className="text-xs font-medium text-slate-400 mt-0.5 pl-4">
                            + {l.addons.map((a) => a.name).join(", ")}
                          </p>
                        )}
                        <p className="mt-1 text-sm font-black text-primary pl-4">
                          {formatMoney(unit * l.qty, cur)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-2.5 py-1.5 shrink-0">
                        <button
                          onClick={() => cart.decrement(l.cartId)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-black text-primary min-w-[16px] text-center">
                          {l.qty}
                        </span>
                        <button
                          onClick={() => cart.increment(l.cartId)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add more items prompt */}
              {cart.restaurant && (
                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={`/restaurant/${cart.restaurant.id}`}
                    className="flex items-center justify-center gap-2 text-xs font-black text-primary hover:underline py-1"
                  >
                    <span>+ Add more items from {cart.restaurant.name}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Cutlery / Green Earth Option */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={noCutlery}
                  onChange={(e) => setNoCutlery(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-black text-slate-900">
                      Don&apos;t send cutlery
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                    Help reduce plastic waste. Spoons and forks will not be included.
                  </p>
                </div>
              </label>
            </div>

            {/* Delivery Instructions Quick Tags */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <p className="text-base font-black tracking-tight text-slate-900">Delivery Instructions</p>
              <p className="text-xs font-medium text-slate-500">
                Let your delivery partner know any preferences for hand-off.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {INSTRUCTIONS.map((inst) => {
                  const Icon = inst.icon;
                  const selected = selectedInstructions.includes(inst.label);
                  return (
                    <button
                      key={inst.id}
                      onClick={() => toggleInstruction(inst.label)}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary font-black shadow-2xs"
                          : "border-slate-200 bg-slate-50/70 text-slate-600 font-semibold hover:border-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px] leading-tight">{inst.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tip your rider */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-black tracking-tight text-slate-900">Tip your delivery partner</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    100% of your tip goes directly to the rider.
                  </p>
                </div>
                {cart.tip > 0 && (
                  <button
                    onClick={() => cart.setTip(0)}
                    className="text-xs font-bold text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {TIPS.map((t) => (
                  <button
                    key={t}
                    onClick={() => cart.setTip(cart.tip === t ? 0 : t)}
                    className={`rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all ${
                      cart.tip === t
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {formatMoney(t, cur)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Promo, Bill & Checkout CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Promo Code Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Coupons & Offers
              </h3>
              {cart.promoCode ? (
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-800">
                  <span className="flex items-center gap-2 text-xs font-black">
                    <Tag className="h-4 w-4" /> &apos;{cart.promoCode}&apos; applied
                  </span>
                  <button onClick={cart.removePromo} className="text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="Enter coupon code (e.g. KADA50)"
                      className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase outline-none focus:border-primary focus:bg-white"
                    />
                    <button
                      onClick={() => {
                        const err = cart.applyPromo(promo);
                        if (err) toast(err);
                        else {
                          toast("Promo applied!");
                          setPromo("");
                        }
                      }}
                      className="rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary-dark transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Available Coupons Strip */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Available Coupons
                    </p>
                    {PROMOS.map((p) => (
                      <div
                        key={p.code}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-100"
                      >
                        <div>
                          <span className="font-black text-primary">{p.code}</span>
                          <p className="text-[10px] text-slate-500">{p.tagline}</p>
                        </div>
                        <button
                          onClick={() => {
                            const err = cart.applyPromo(p.code);
                            if (err) toast(err);
                            else toast(`Coupon ${p.code} applied!`);
                          }}
                          className="text-xs font-black text-primary hover:underline ml-2"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h2 className="text-base font-black tracking-tight text-slate-900">Bill Details</h2>
              <div className="space-y-2.5 text-xs font-bold">
                <Row l="Item total" r={formatMoney(totals.subtotal, cur)} />
                {totals.tax > 0 && <Row l="Taxes & charges" r={formatMoney(totals.tax, cur)} />}
                {totals.discount > 0 && (
                  <Row l="Promo discount" r={`-${formatMoney(totals.discount, cur)}`} green />
                )}
                {totals.tip > 0 && <Row l="Rider tip" r={formatMoney(totals.tip, cur)} />}
                <Row l="Delivery fee" r="At checkout" />
                <div className="my-2 border-t border-slate-100" />
                <div className="flex items-center justify-between text-base font-black text-slate-900 pt-1">
                  <span>Estimated total</span>
                  <span>{formatMoney(totals.total, cur)}</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  Your final bill, with delivery for your address, is confirmed at checkout.
                </p>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate("/checkout", { state: { instructions: selectedInstructions, noCutlery } })
                }
                className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-4 text-base font-black text-white shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Safe & Contactless Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ l, r, green }: { l: string; r: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{l}</span>
      <span className={green ? "text-emerald-600 font-black" : "text-slate-800"}>{r}</span>
    </div>
  );
}
