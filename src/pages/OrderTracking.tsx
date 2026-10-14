import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChefHat, Bike, PartyPopper, Star } from "lucide-react";
import type { CustomerOrder } from "@/types";
import { subscribeOrder, submitReview } from "@/services/orders";
import { useAuth } from "@/context/AuthContext";
import { formatMoney } from "@/lib/currency";
import { Spinner, Stars } from "@/components/bits";
import { toast } from "@/components/Toast";
import { displayOrderNumber } from "@/lib/orderNumber";
import { BillCard } from "@/components/BillCard";

const STAGES = [
  { key: "placed", label: "Order placed", icon: Check },
  { key: "preparing", label: "Preparing", icon: ChefHat },
  { key: "ready", label: "Ready", icon: PartyPopper },
  { key: "out", label: "Out for delivery", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Check },
];

function stageIndex(status: string): number {
  const s = status.toLowerCase();
  if (["delivered", "completed", "paid"].includes(s)) return 4;
  if (["out_for_delivery", "dispatched", "on_the_way"].includes(s)) return 3;
  if (["ready", "prepared"].includes(s)) return 2;
  if (["preparing", "cooking", "accepted", "in_progress", "inprogress"].includes(s)) return 1;
  return 0;
}

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    if (!id) return;
    return subscribeOrder(id, setOrder);
  }, [id]);

  if (!order) {
    return <div className="flex h-[80vh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  }

  const idx = stageIndex(order.status);
  const cancelled = ["cancelled", "canceled", "rejected"].includes(order.status.toLowerCase());
  const delivered = idx === 4;

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-slate-50 pb-16">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <button onClick={() => navigate("/orders")} className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"><ArrowLeft className="h-5 w-5 text-slate-700" /></button>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Track order</h1>
      </div>

      <div className="px-4 pt-4">
        {params.get("placed") === "1" && !cancelled && (
          <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-[2rem] border border-veg/30 bg-veg/10 p-6 text-center">
            <div className="relative w-24 h-24 mb-2">
               <div className="absolute inset-0 bg-white/50 rounded-full blur-xl"></div>
               <img src="/character-2.jpg" alt="Order Placed" className="relative w-full h-full object-cover rounded-full" />
            </div>
            <p className="text-lg font-black text-veg">Order placed successfully!</p>
            <p className="text-sm font-bold text-veg/80">The restaurant has been notified.</p>
          </div>
        )}

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-base font-black">{displayOrderNumber(order.orderNumber, order.id)}</p>
            <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-black text-primary">
              {order.paymentStatus === "paid" ? "Paid" : order.paymentMethod.toUpperCase()}
            </span>
          </div>
          <p className="mt-1 text-sm font-bold text-primary">{order.restaurantName}</p>
        </div>

        {/* Timeline */}
        {!cancelled ? (
          <div className="card mt-4 p-5">
            {STAGES.map((st, i) => {
              const done = i <= idx;
              const Icon = st.icon;
              return (
                <div key={st.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-primary text-white" : "bg-canvas text-sub"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < STAGES.length - 1 && <div className={`h-8 w-0.5 ${i < idx ? "bg-primary" : "bg-line"}`} />}
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-extrabold ${done ? "text-ink" : "text-sub"}`}>{st.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card mt-4 border-danger/30 bg-danger/5 p-5 text-center">
            <p className="font-black text-danger">This order was cancelled.</p>
          </div>
        )}

        {/* Items */}
        <div className="card mt-4 p-4">
          <p className="text-sm font-black">Items</p>
          <div className="mt-2 space-y-1.5">
            {order.items.map((it: any, i: number) => (
              <div key={i} className="flex justify-between text-sm font-semibold">
                <span>{it.qty}× {it.name}</span>
                <span>{formatMoney((it.price ?? 0) * (it.qty ?? 1), order.currency)}</span>
              </div>
            ))}
            {!order.bill && (
              <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-black">
                <span>Total</span>
                <span>{formatMoney(order.total, order.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {order.bill && (
          <div className="mt-4">
            <BillCard
              rows={order.bill.rows}
              totalPaise={order.bill.totalPaise}
              savingsPaise={order.bill.savingsPaise}
              totalLabel={order.paymentStatus === "paid" ? "Total paid" : "Total to pay"}
            />
          </div>
        )}

        {delivered && <RateCard order={order} />}
      </div>
    </div>
  );
}

function RateCard({ order }: { order: CustomerOrder }) {
  const { user } = useAuth();
  const [food, setFood] = useState(order.foodRating);
  const [delivery, setDelivery] = useState(order.deliveryRating);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const rated = order.foodRating > 0 || order.deliveryRating > 0;
  const [done, setDone] = useState(rated);

  async function send() {
    if (food === 0 && delivery === 0) return toast("Tap the stars to rate.");
    setBusy(true);
    try {
      await submitReview({
        restaurantId: order.restaurantId,
        orderId: order.id,
        foodRating: food,
        deliveryRating: delivery,
        text,
        customerName: user?.displayName ?? "",
      });
      setDone(true);
      toast("Thanks for rating your order!");
    } catch (e: any) {
      toast(e?.message ?? "Could not submit rating.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card mt-4 flex items-center gap-2 p-4">
        <Star className="h-5 w-5 fill-[#F5A623] text-[#F5A623]" />
        <p className="text-sm font-bold">Thanks for rating this order.</p>
      </div>
    );
  }

  return (
    <div className="card mt-4 p-4">
      <p className="text-base font-black">Rate your order</p>
      <RateRow label="Food quality" value={food} onChange={setFood} />
      <RateRow label="Delivery" value={delivery} onChange={setDelivery} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a review (optional)"
        rows={2}
        className="mt-3 w-full rounded-xl border border-line px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
      />
      <button onClick={send} disabled={busy} className="btn-primary mt-3 w-full">
        {busy ? <Spinner className="h-5 w-5 border-white/40 border-t-white" /> : "Submit rating"}
      </button>
    </div>
  );
}

function RateRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm font-bold">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} onClick={() => onChange(i)}>
            <Star className={`h-7 w-7 ${i <= value ? "fill-[#F5A623] text-[#F5A623]" : "text-sub"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
