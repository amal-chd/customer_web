import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Tag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatMoney } from "@/lib/currency";
import { toast } from "@/components/Toast";

const TIPS = [10, 20, 30, 50];

export default function Cart() {
  const cart = useCart();
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const totals = cart.totals();
  const cur = cart.restaurant?.currency;

  if (cart.isEmpty) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-6 w-32 h-32">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img src="/character-1.jpg" alt="Empty Cart" className="relative w-full h-full object-cover rounded-full mix-blend-multiply" />
        </div>
        <p className="mt-4 text-2xl font-black text-slate-900 tracking-tight">Your cart is empty</p>
        <p className="mt-2 text-sm font-medium text-slate-500">Add items from a restaurant to get started.</p>
        <Link to="/order" className="btn-primary mt-8">Browse restaurants</Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 bg-slate-50 min-h-[100dvh] pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"><ArrowLeft className="h-5 w-5 text-slate-700" /></button>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Your cart</h1>
          {cart.restaurant && <p className="text-sm font-bold text-primary">{cart.restaurant.name}</p>}
        </div>
      </div>

      {/* Items */}
      <div className="card mt-4 divide-y divide-slate-100 p-2">
        {cart.lines.map((l) => {
          const unit = (l.variant?.price ?? l.item.price) + l.addons.reduce((s, a) => s + a.price, 0);
          return (
            <div key={l.cartId} className="flex items-start gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold">{l.item.name}{l.variant ? ` (${l.variant.name})` : ""}</p>
                {l.addons.length > 0 && (
                  <p className="text-xs font-medium text-sub">+ {l.addons.map((a) => a.name).join(", ")}</p>
                )}
                <p className="mt-1 text-sm font-bold">{formatMoney(unit * l.qty, cur)}</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary px-2 py-1.5">
                <button onClick={() => cart.decrement(l.cartId)}><Minus className="h-4 w-4 text-primary" /></button>
                <span className="text-sm font-black text-primary">{l.qty}</span>
                <button onClick={() => cart.increment(l.cartId)}><Plus className="h-4 w-4 text-primary" /></button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip */}
      <div className="card mt-4 p-5">
        <p className="text-base font-black tracking-tight text-slate-900">Tip your rider</p>
        <p className="text-xs font-medium text-slate-500">100% goes to the delivery partner.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TIPS.map((t) => (
            <button
              key={t}
              onClick={() => cart.setTip(cart.tip === t ? 0 : t)}
              className={`rounded-xl border px-4 py-2 text-sm font-bold ${
                cart.tip === t ? "border-primary bg-primary text-white" : "border-line bg-canvas"
              }`}
            >
              {formatMoney(t, cur)}
            </button>
          ))}
        </div>
      </div>

      {/* Promo */}
      <div className="card mt-4 p-5">
        {cart.promoCode ? (
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-black text-veg">
              <Tag className="h-4 w-4" /> {cart.promoCode} applied
            </span>
            <button onClick={cart.removePromo}><X className="h-4 w-4 text-sub" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code (try KADA50)"
              className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm font-bold uppercase outline-none focus:border-primary"
            />
            <button
              onClick={() => {
                const err = cart.applyPromo(promo);
                if (err) toast(err);
                else { toast("Promo applied!"); setPromo(""); }
              }}
              className="btn-outline py-2.5"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Bill */}
      <div className="card mt-4 p-5">
        <p className="text-base font-black tracking-tight text-slate-900">Bill details</p>
        <div className="mt-3 space-y-2 text-sm font-semibold">
          <Row l="Item total" r={formatMoney(totals.subtotal, cur)} />
          {totals.tax > 0 && <Row l="Taxes & charges" r={formatMoney(totals.tax, cur)} />}
          {totals.discount > 0 && <Row l="Promo discount" r={`- ${formatMoney(totals.discount, cur)}`} green />}
          {totals.tip > 0 && <Row l="Rider tip" r={formatMoney(totals.tip, cur)} />}
          <Row l="Delivery fee" r="FREE" green />
          <div className="my-3 border-t border-dashed border-slate-200" />
          <div className="flex items-center justify-between text-base font-black">
            <span>To pay</span>
            <span>{formatMoney(totals.total, cur)}</span>
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/checkout")} className="btn-primary mt-5 w-full py-4 text-base">
        Proceed to checkout · {formatMoney(totals.total, cur)}
      </button>
    </div>
  );
}

function Row({ l, r, green }: { l: string; r: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sub">{l}</span>
      <span className={green ? "text-veg" : ""}>{r}</span>
    </div>
  );
}
