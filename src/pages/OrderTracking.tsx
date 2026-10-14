import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChefHat,
  Bike,
  PartyPopper,
  Phone,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  Clock,
  Sparkles,
  Building,
} from "lucide-react";
import type { CustomerOrder, Restaurant } from "@/types";
import { subscribeOrder, submitReview, getRestaurant } from "@/services/orders";
import { formatMoney } from "@/lib/currency";
import { Spinner, Stars } from "@/components/bits";
import { toast } from "@/components/Toast";
import { displayOrderNumber } from "@/lib/orderNumber";
import { BillCard } from "@/components/BillCard";
import { DeliveryTrackingMap } from "@/components/DeliveryTrackingMap";

const STAGES = [
  { key: "placed", label: "Order Placed", desc: "Sent to restaurant", icon: Check },
  { key: "preparing", label: "Preparing Food", desc: "Chef is cooking your meal", icon: ChefHat },
  { key: "ready", label: "Order Ready", desc: "Packaged & waiting for pickup", icon: PartyPopper },
  { key: "out", label: "Out for Delivery", desc: "Rider is heading to your drop location", icon: Bike },
  { key: "delivered", label: "Delivered", desc: "Enjoy your meal!", icon: Check },
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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (!id) return;
    return subscribeOrder(id, (ord) => {
      setOrder(ord);
      if (ord.restaurantId && !restaurant) {
        getRestaurant(ord.restaurantId).then((r) => setRestaurant(r));
      }
    });
  }, [id, restaurant]);

  if (!order) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const idx = stageIndex(order.status);
  const cancelled = ["cancelled", "canceled", "rejected"].includes(order.status.toLowerCase());
  const delivered = idx === 4;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/orders")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Track Order
                </h1>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-black text-primary">
                  {displayOrderNumber(order.orderNumber, order.id)}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                {order.restaurantName} · {order.paymentStatus === "paid" ? "Paid Online" : order.paymentMethod.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Placed Celebration Banner */}
        {params.get("placed") === "1" && !cancelled && (
          <div className="mb-6 flex items-center gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-xs">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-emerald-100 p-1 shrink-0">
              <img src="/character-2.jpg" alt="Order Placed" className="h-full w-full object-cover rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Confirmed
              </div>
              <h2 className="text-lg font-black text-emerald-950 mt-0.5">Order placed successfully!</h2>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                The restaurant has accepted your order and is getting it ready.
              </p>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Map & Rider Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Interactive Map */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-black text-slate-900">
                      {delivered
                        ? "Delivered to your address"
                        : order.status === "out_for_delivery"
                        ? "Rider is on the way"
                        : "Preparing your delicious meal"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {order.deliveryAddress ? order.deliveryAddress.split(",")[0] : "Doorstep drop"}
                  </span>
                </div>
              </div>

              {/* Delivery Tracking Map */}
              <DeliveryTrackingMap
                restaurantLat={restaurant?.lat}
                restaurantLng={restaurant?.lng}
                restaurantName={order.restaurantName}
                dropLat={order.deliveryLat}
                dropLng={order.deliveryLng}
                dropAddress={order.deliveryAddress}
                riderLat={order.riderLat}
                riderLng={order.riderLng}
                riderName={order.riderName}
                status={order.status}
              />
            </div>

            {/* Delivery OTP Card */}
            {order.otp && !delivered && !cancelled && (
              <div className="flex items-center justify-between rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-indigo-50 to-primary/5 p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/30">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-primary">
                      Delivery Completion PIN
                    </span>
                    <h3 className="text-sm font-bold text-slate-700 mt-0.5">
                      Share this code with the rider when food arrives
                    </h3>
                  </div>
                </div>
                <div className="rounded-2xl bg-white px-5 py-2.5 shadow-sm border border-primary/30 text-center">
                  <span className="font-mono text-2xl font-black text-primary tracking-widest">
                    {order.otp}
                  </span>
                </div>
              </div>
            )}

            {/* Rider Contact Card (if assigned) */}
            {order.riderName && !delivered && !cancelled && (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 font-black text-lg">
                      <Bike className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                        Assigned Delivery Partner
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-0.5">
                        {order.riderName}
                      </h3>
                      {order.riderVehicle && (
                        <p className="text-xs font-semibold text-slate-400">
                          Vehicle: {order.riderVehicle}
                        </p>
                      )}
                    </div>
                  </div>

                  {order.riderPhone && (
                    <a
                      href={`tel:${order.riderPhone}`}
                      className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Rider</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Progress Timeline, Bill & Review (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Order Timeline */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <h2 className="text-base font-black text-slate-900 mb-6">Order Status</h2>

              {!cancelled ? (
                <div className="space-y-6">
                  {STAGES.map((st, i) => {
                    const done = i <= idx;
                    const isCurrent = i === idx;
                    const Icon = st.icon;
                    return (
                      <div key={st.key} className="flex gap-4 relative">
                        {/* Connecting Line */}
                        {i < STAGES.length - 1 && (
                          <div
                            className={`absolute left-5 top-10 -bottom-6 w-0.5 ${
                              i < idx ? "bg-primary" : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div className="relative z-10 flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-xs transition-all ${
                              done
                                ? "bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-primary/25"
                                : "bg-slate-100 text-slate-400"
                            } ${isCurrent ? "ring-4 ring-primary/20 scale-105" : ""}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-1">
                          <p
                            className={`text-sm font-black ${
                              done ? "text-slate-900" : "text-slate-400"
                            }`}
                          >
                            {st.label}
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                  <p className="font-black text-red-700">This order was cancelled.</p>
                </div>
              )}
            </div>

            {/* Ordered Items Breakdown */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-3">
              <h2 className="text-base font-black text-slate-900">Items Ordered</h2>
              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                {order.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between py-2.5 text-xs font-bold">
                    <span className="text-slate-800">
                      {it.qty}× {it.name}
                    </span>
                    <span className="text-slate-900 font-black">
                      {formatMoney((it.price ?? 0) * (it.qty ?? 1), order.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details Card */}
            {order.bill && (
              <BillCard
                rows={order.bill.rows}
                totalPaise={order.bill.totalPaise}
                savingsPaise={order.bill.savingsPaise}
                totalLabel={order.paymentStatus === "paid" ? "Total Paid" : "Total to Pay"}
              />
            )}

            {/* Rating & Review Card when delivered */}
            {delivered && <RateCard order={order} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function RateCard({ order }: { order: CustomerOrder }) {
  const [food, setFood] = useState(order.foodRating || 0);
  const [delivery, setDelivery] = useState(order.deliveryRating || 0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(order.foodRating > 0);

  async function handleRate() {
    if (food === 0) return toast("Please select a food rating.");
    setSubmitting(true);
    try {
      await submitReview({
        restaurantId: order.restaurantId,
        orderId: order.id,
        foodRating: food,
        deliveryRating: delivery || food,
      });
      setSubmitted(true);
      toast("Thank you for your rating!");
    } catch {
      toast("Could not submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-center shadow-xs">
        <Sparkles className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
        <h3 className="text-base font-black text-emerald-950">Thank you for your feedback!</h3>
        <p className="text-xs font-semibold text-emerald-700 mt-1">
          Your review helps improve food quality and service.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
      <h3 className="text-base font-black text-slate-900">Rate your experience</h3>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1.5">Food Quality</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFood(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Stars value={food >= star ? 1 : 0} size={28} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1.5">Delivery Service</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setDelivery(star)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Stars value={delivery >= star ? 1 : 0} size={28} />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleRate}
        disabled={submitting}
        className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3 text-sm font-black text-white shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
