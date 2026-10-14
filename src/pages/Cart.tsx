import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Tag, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { toast } from "@/components/Toast";
import { VegDot } from "@/components/bits";

const TIPS = [10, 20, 30, 50];

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const totals = cart.totals();
  const cur = cart.restaurant?.currency;

  if (cart.isEmpty) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center animate-in fade-in duration-200">
        <div className="relative mb-6 w-32 h-32">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img
            src="/character-1.jpg"
            alt="Empty Cart"
            className="relative w-full h-full object-cover rounded-full mix-blend-multiply"
          />
        </div>
        <p className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Your cart is empty</p>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Add items from a restaurant to get started.
        </p>
        <Link to="/order" className="btn-primary mt-8">
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 sm:px-6 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Your Cart</h1>
            {cart.restaurant && (
              <p className="text-xs font-bold text-primary">{cart.restaurant.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items & Tip (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
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
            </div>

            {/* Tip your rider */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <p className="text-base font-black tracking-tight text-slate-900">Tip your rider</p>
              <p className="text-xs font-medium text-slate-500">
                100% of the tip goes directly to your delivery partner.
              </p>
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
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Coupons & Offers
              </h3>
              {cart.promoCode ? (
                <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-800">
                  <span className="flex items-center gap-2 text-xs font-black">
                    <Tag className="h-4 w-4" /> {cart.promoCode} applied
                  </span>
                  <button onClick={cart.removePromo} className="text-slate-400 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
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
                <Row l="Delivery fee" r="FREE" green />
                <div className="my-2 border-t border-slate-100" />
                <div className="flex items-center justify-between text-base font-black text-slate-900 pt-1">
                  <span>To pay</span>
                  <span>{formatMoney(totals.total, cur)}</span>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/checkout")}
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
