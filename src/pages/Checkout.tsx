import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Banknote, CreditCard, MapPin, Clock, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeQuotedOrder, quoteOrder, type OrderQuote } from "@/services/orders";
import { BillCard } from "@/components/BillCard";
import { formatPaise } from "@/lib/billFormat";
import { payForOrder } from "@/services/payment";
import { requestBrowserLocation } from "@/services/location";
import { formatMoney } from "@/lib/currency";
import { Spinner } from "@/components/bits";
import { toast } from "@/components/Toast";

export default function Checkout() {
  const cart = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const totals = cart.totals();
  const cur = cart.restaurant?.currency;

  const [name, setName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [payment, setPayment] = useState<"cod" | "razorpay">("razorpay");
  const [note, setNote] = useState("");
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [placing, setPlacing] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  // Live server quote: what the customer sees is what they're charged.
  // Re-priced 350 ms after the cart, pinned location or tip changes; the last
  // bill stays on screen (dimmed) while the next one loads.
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const quoteKey = JSON.stringify({
    r: cart.restaurant?.id,
    l: cart.lines.map((l) => [l.item.id, l.qty, l.variant?.name ?? "", l.addons.map((a) => a.name)]),
    g: gps,
    c: cart.promoCode,
    t: cart.tip,
  });
  const quotedKey = useRef<string | null>(null);
  const fresh = quote != null && quotedKey.current === quoteKey;
  useEffect(() => {
    if (!user || !cart.restaurant || cart.isEmpty || !gps) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setQuoting(true);
      try {
        const q = await quoteOrder({
          restaurantId: cart.restaurant!.id,
          lines: cart.lines,
          drop: gps,
          couponCode: cart.promoCode,
          tipRupees: cart.tip,
        });
        if (cancelled) return;
        quotedKey.current = quoteKey;
        setQuote(q);
        setQuoteError(null);
      } catch (e: any) {
        if (!cancelled) setQuoteError(e?.message ?? "Couldn't work out your total.");
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // quoteKey fingerprints every cart/location/tip input, so it is the dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteKey, user]);

  useEffect(() => {
    if (!loading && !user) navigate("/login?next=/checkout");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (cart.isEmpty) navigate("/order");
  }, [cart.isEmpty, navigate]);

  useEffect(() => {
    if (user?.displayName && !name) setName(user.displayName);
  }, [user]);

  async function pinLocation() {
    try {
      setLocating(true);
      const l = await requestBrowserLocation();
      setGps({ lat: l.lat, lng: l.lng });
      toast("Location pinned for delivery.");
    } catch {
      toast("Could not access your location.");
    } finally {
      setLocating(false);
    }
  }

  async function submit() {
    if (!line1.trim() || !area.trim()) return toast("Please enter your delivery address.");
    if (phone.trim().length < 8) return toast("Please enter a valid phone number.");
    if (!cart.restaurant) return;
    if (!gps) return toast("Pin your location so we can price delivery.");
    setPlacing(true);
    try {
      // Place exactly the quote on screen; re-price first if it's stale.
      const q =
        fresh && quote
          ? quote
          : await quoteOrder({ restaurantId: cart.restaurant.id, lines: cart.lines, drop: gps, couponCode: cart.promoCode, tipRupees: cart.tip });
      if (!fresh) {
        quotedKey.current = quoteKey;
        setQuote(q);
      }
      const placed = await placeQuotedOrder({
        quote: q,
        paymentMethod: payment,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        instructions: note.trim(),
        scheduledFor: scheduledFor ?? undefined,
        address: { label: "Home", line1, area, landmark, pincode, lat: gps?.lat, lng: gps?.lng },
        idempotencyKey: idempotencyKey.current,
      });
      const orderId = placed.orderId;

      if (payment === "razorpay") {
        const paid = await payForOrder({
          orderId,
          amountRupees: placed.totalPaise / 100,
          name: name.trim(),
          email: user?.email ?? "",
          contact: phone.trim(),
        });
        if (paid === "cancelled") {
          idempotencyKey.current = crypto.randomUUID();
          toast("Payment cancelled. You were not charged.");
          return;
        }
        if (paid === "pending") {
          toast("Payment received — we're confirming it with your bank. Your order updates automatically.");
        }
      }

      cart.clear();
      idempotencyKey.current = crypto.randomUUID();
      navigate(`/orders/${orderId}?placed=1`);
    } catch (e: any) {
      toast(e?.message ?? "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  }

  if (loading || !user) {
    return <div className="flex h-[80vh] items-center justify-center"><Spinner className="h-8 w-8" /></div>;
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-slate-50 pb-28">
      <div className="flex items-center gap-3 px-4 pt-6 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"><ArrowLeft className="h-5 w-5 text-slate-700" /></button>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Checkout</h1>
      </div>

      <div className="space-y-5 px-4 pt-4">
        <Section title="Delivery time">
          <div className="flex gap-3">
            <button
              onClick={() => setScheduledFor(null)}
              className={`flex-1 rounded-2xl border p-3 text-center transition-all ${
                !scheduledFor ? "border-primary bg-primary/5" : "border-line bg-white text-slate-500"
              }`}
            >
              <Zap className={`mx-auto mb-1 h-5 w-5 ${!scheduledFor ? "text-primary" : "opacity-50"}`} />
              <p className="text-sm font-bold">Deliver now</p>
              <p className="text-xs">ASAP</p>
            </button>
            <button
              onClick={() => {
                // simple prompt for demo purposes in web app
                const time = prompt("Enter time (e.g. 19:30 for 7:30 PM today). Minimum 30 mins from now.");
                if (time) {
                  const [h, m] = time.split(":");
                  const d = new Date();
                  d.setHours(Number(h), Number(m), 0, 0);
                  if (d.getTime() < Date.now() + 30 * 60 * 1000) {
                    toast("Time must be at least 30 minutes in the future");
                    return;
                  }
                  setScheduledFor(d);
                }
              }}
              className={`flex-1 rounded-2xl border p-3 text-center transition-all ${
                scheduledFor ? "border-primary bg-primary/5" : "border-line bg-white text-slate-500"
              }`}
            >
              <Clock className={`mx-auto mb-1 h-5 w-5 ${scheduledFor ? "text-primary" : "opacity-50"}`} />
              <p className="text-sm font-bold">Schedule</p>
              <p className="text-xs">
                {scheduledFor
                  ? scheduledFor.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "Pick a slot"}
              </p>
            </button>
          </div>
        </Section>

        <Section title="Delivery address">
          <button onClick={pinLocation} className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-left">
            <MapPin className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-extrabold">{gps ? "Location pinned" : "Pin your location"}</p>
              <p className="text-xs font-semibold text-sub">{gps ? "Used for accurate delivery" : "Recommended for accuracy"}</p>
            </div>
            <span className="text-sm font-black text-primary">{gps ? "Change" : "Pin"}</span>
          </button>
          <Field value={line1} onChange={setLine1} placeholder="House / Flat / Building" />
          <Field value={area} onChange={setArea} placeholder="Area / Locality" />
          <div className="grid grid-cols-2 gap-3">
            <Field value={landmark} onChange={setLandmark} placeholder="Landmark" />
            <Field value={pincode} onChange={setPincode} placeholder="Pincode" />
          </div>
        </Section>

        <Section title="Contact">
          <Field value={name} onChange={setName} placeholder="Your name" />
          <Field value={phone} onChange={setPhone} placeholder="Phone number" type="tel" />
        </Section>

        <Section title="Payment method">
          <PayTile selected={payment === "cod"} onClick={() => setPayment("cod")} icon={<Banknote className="h-5 w-5" />} title="Cash on Delivery" sub="Pay with cash or card on delivery" />
          <PayTile selected={payment === "razorpay"} onClick={() => setPayment("razorpay")} icon={<CreditCard className="h-5 w-5" />} title="Pay online (UPI / Card)" sub="Secure payment via Razorpay" />
        </Section>

        <Section title="Bill">
          {!gps ? (
            <div className="rounded-3xl border border-dashed border-line bg-white p-4 text-sm font-semibold text-sub">
              Pin your location to see the delivery fee and your total.
            </div>
          ) : quote ? (
            <BillCard
              rows={quote.bill?.rows ?? quote.display.slice(0, -1)}
              totalPaise={quote.bill?.totalPaise ?? quote.totalPaise}
              savingsPaise={quote.bill?.savingsPaise ?? 0}
              updating={quoting || !fresh}
              problem={quote.problems[0] ?? quoteError}
            />
          ) : (
            <div className="space-y-2 rounded-3xl border border-line bg-white p-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${85 - i * 12}%` }} />
              ))}
              {quoteError && <p className="text-xs font-semibold text-red-600">{quoteError}</p>}
            </div>
          )}
        </Section>

        <Section title="Order note">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any instructions for the restaurant?"
            className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
            rows={2}
          />
        </Section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-2xl border-t border-slate-200 bg-white/80 backdrop-blur-xl p-4">
        <button onClick={submit} disabled={placing} className="btn-primary w-full py-4 text-base shadow-xl">
          {placing ? (
            <Spinner className="h-5 w-5 border-white/40 border-t-white" />
          ) : quote && fresh ? (
            `Place order · ${formatPaise(quote.bill?.totalPaise ?? quote.totalPaise)}`
          ) : gps ? (
            "Place order"
          ) : (
            `Place order · ${formatMoney(totals.total, cur)}+`
          )}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-black">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
    />
  );
}

function PayTile({ selected, onClick, icon, title, sub }: { selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left ${selected ? "border-primary bg-primary/5" : "border-line bg-white"}`}>
      <span className={selected ? "text-primary" : "text-sub"}>{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-extrabold">{title}</p>
        <p className="text-xs font-semibold text-sub">{sub}</p>
      </div>
      <span className={`h-5 w-5 rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-line"}`} />
    </button>
  );
}
