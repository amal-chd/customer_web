import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CreditCard,
  MapPin,
  Clock,
  Zap,
  Compass,
  CheckCircle2,
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  Home,
  Briefcase,
  Wallet,
  Calendar,
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeQuotedOrder, quoteOrder, type OrderQuote } from "@/services/orders";
import { BillCard } from "@/components/BillCard";
import { formatPaise } from "@/lib/billFormat";
import { payForOrder } from "@/services/payment";
import { payWithWallet } from "@/services/wallet";
import {
  getDiscoveryLocation,
  getSavedAddresses,
  requestBrowserLocation,
  reverseGeocode,
  saveAddressToStorage,
  type DeliveryAddress,
} from "@/services/location";
import { formatMoney } from "@/lib/currency";
import { Spinner } from "@/components/bits";
import { toast } from "@/components/Toast";
import { MapLocationPickerModal } from "@/components/MapLocationPickerModal";

const INSTRUCTION_TAGS = [
  "Leave at door",
  "Avoid calling",
  "Do not ring bell",
  "Leave with security",
];

export default function Checkout() {
  const cart = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const totals = cart.totals();
  const cur = cart.restaurant?.currency;

  const discoveryLoc = getDiscoveryLocation();

  const [name, setName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState(user?.phoneNumber ?? "");
  const [line1, setLine1] = useState(discoveryLoc.line1 || "");
  const [area, setArea] = useState(discoveryLoc.area || discoveryLoc.label || "");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState(discoveryLoc.pincode || "");
  const [gps, setGps] = useState<{ lat: number; lng: number }>({
    lat: discoveryLoc.lat,
    lng: discoveryLoc.lng,
  });

  const [locating, setLocating] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);

  const [payment, setPayment] = useState<"cod" | "razorpay" | "wallet">("razorpay");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [fulfillmentType, setFulfillmentType] = useState<"now" | "scheduled">("now");
  const [scheduledSlot, setScheduledSlot] = useState<number>(45); // minutes from now
  const [note, setNote] = useState("");
  const [optCutlery, setOptCutlery] = useState(false);
  const [placing, setPlacing] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  // Listen to customer wallet balance
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "customer_users", user.uid), (snap) => {
      const val = snap.data()?.walletBalance;
      setWalletBalance(typeof val === "number" ? val : 0);
    });
    return unsub;
  }, [user]);

  // Load saved addresses on start
  useEffect(() => {
    (async () => {
      const addrs = await getSavedAddresses(user?.uid);
      setSavedAddresses(addrs);
    })();
  }, [user]);

  // Live server quote
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
        if (!cancelled) setQuoteError(e?.message ?? "Couldn't calculate delivery quote.");
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
      if (l.area) setArea(l.area);
      if (l.line1) setLine1(l.line1);
      if (l.pincode) setPincode(l.pincode);
      toast("Location updated via GPS.");
    } catch {
      toast("Could not access GPS. Please use 'Select on Map'.");
    } finally {
      setLocating(false);
    }
  }

  function handleSelectSaved(addr: DeliveryAddress) {
    setSelectedAddrId(addr.id || null);
    setLine1(addr.line1);
    setArea(addr.area);
    setLandmark(addr.landmark || "");
    setPincode(addr.pincode);
    if (addr.lat && addr.lng) {
      setGps({ lat: addr.lat, lng: addr.lng });
    }
    toast(`Using saved address: ${addr.label}`);
  }

  function handleAddInstructionTag(tag: string) {
    if (note.includes(tag)) {
      setNote(note.replace(tag, "").replace(/,\s*,/g, ",").trim());
    } else {
      setNote(note ? `${note}, ${tag}` : tag);
    }
  }

  async function submit() {
    if (!line1.trim() || !area.trim()) return toast("Please enter your delivery street and area.");
    if (phone.trim().length < 8) return toast("Please enter a valid phone number.");
    if (!cart.restaurant) return;
    if (!gps) return toast("Please confirm your location pin on the map.");

    setPlacing(true);
    try {
      const q =
        fresh && quote
          ? quote
          : await quoteOrder({
              restaurantId: cart.restaurant.id,
              lines: cart.lines,
              drop: gps,
              couponCode: cart.promoCode,
              tipRupees: cart.tip,
            });

      if (!fresh) {
        quotedKey.current = quoteKey;
        setQuote(q);
      }

      const fullInstructions = [
        note.trim(),
        optCutlery ? "Don't send cutlery" : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const addressPayload: DeliveryAddress = {
        label: "Delivery Address",
        line1: line1.trim(),
        area: area.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim(),
        lat: gps.lat,
        lng: gps.lng,
      };

      // Save address for future orders
      saveAddressToStorage(addressPayload, user?.uid).catch(() => {});

      if (payment === "wallet") {
        const orderTotal = q.totalPaise / 100;
        if (walletBalance == null || walletBalance < orderTotal) {
          toast(
            `Insufficient wallet balance (₹${(walletBalance ?? 0).toFixed(
              2
            )} available, ₹${orderTotal.toFixed(2)} required). Please choose Razorpay or top up.`
          );
          setPlacing(false);
          return;
        }
      }

      const scheduledDate =
        fulfillmentType === "scheduled"
          ? new Date(Date.now() + scheduledSlot * 60_000)
          : undefined;

      const placed = await placeQuotedOrder({
        quote: q,
        paymentMethod: payment,
        customerName: name.trim() || user?.displayName || "Customer",
        customerPhone: phone.trim(),
        instructions: fullInstructions,
        scheduledFor: scheduledDate,
        address: addressPayload,
        idempotencyKey: idempotencyKey.current,
      });

      const orderId = placed.orderId;

      if (payment === "wallet") {
        await payWithWallet(orderId);
      } else if (payment === "razorpay") {
        const paid = await payForOrder({
          orderId,
          amountRupees: placed.totalPaise / 100,
          name: name.trim(),
          email: user?.email ?? "",
          contact: phone.trim(),
        });
        if (!paid) {
          navigate(`/orders/${orderId}?payment=failed`);
          return;
        }
      }

      cart.clear();
      navigate(`/orders/${orderId}?placed=1`);
    } catch (e: any) {
      toast(e?.message ?? "Could not place order.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-xs font-semibold text-slate-500">
              Ordering from <span className="font-bold text-primary">{cart.restaurant?.name}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Details & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Address Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Delivery Address</h2>
                    <p className="text-xs font-semibold text-slate-400">Where should we deliver?</p>
                  </div>
                </div>

                {/* Map Pick Button */}
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs font-black text-primary hover:bg-primary/10 transition-colors"
                >
                  <Compass className="h-4 w-4" />
                  Select on Map
                </button>
              </div>

              {/* Saved Addresses Quick Selector */}
              {savedAddresses.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Saved Addresses
                  </p>
                  <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                    {savedAddresses.map((addr) => {
                      const selected = selectedAddrId === addr.id;
                      return (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectSaved(addr)}
                          className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all shrink-0 ${
                            selected
                              ? "border-primary bg-primary text-white shadow-xs"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {addr.label.toLowerCase().includes("work") ? (
                            <Briefcase className="h-3.5 w-3.5" />
                          ) : (
                            <Home className="h-3.5 w-3.5" />
                          )}
                          <span>{addr.label}</span>
                          <span className="opacity-70 text-[10px]">({addr.area})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    House / Flat / Street Name *
                  </label>
                  <input
                    type="text"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="e.g. Flat 402, Skyline Oasis, Infopark Road"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Kakkanad, Edachira"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 682030"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Infopark Gate 2, Opposite Federal Bank"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              {/* GPS Confirmation Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 border border-emerald-100 p-3.5 text-emerald-800">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold truncate">
                    Pin confirmed ({gps.lat.toFixed(4)}, {gps.lng.toFixed(4)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={pinLocation}
                  disabled={locating}
                  className="text-xs font-black text-emerald-700 hover:underline shrink-0 ml-2"
                >
                  {locating ? "Locating..." : "Use GPS"}
                </button>
              </div>
            </div>

            {/* Contact Details Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                    Phone Number (for Rider) *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Instructions & Preferences */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Delivery Instructions</h2>

              <div className="flex flex-wrap gap-2">
                {INSTRUCTION_TAGS.map((t) => {
                  const active = note.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddInstructionTag(t)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {t}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Any special notes for the rider or gate code..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:bg-white"
              />

              {/* Cutlery Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={optCutlery}
                  onChange={(e) => setOptCutlery(e.target.checked)}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">
                  Don't send plastic cutlery (Help us stay green 🌱)
                </span>
              </label>
            </div>

            {/* Delivery Time Preference */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Delivery Preference</h2>
                    <p className="text-xs font-semibold text-slate-400">Choose when you want your meal</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("now")}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    fulfillmentType === "now"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs font-black text-slate-900">Deliver Now</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Standard Hyperlocal (~30–45m)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType("scheduled")}
                  className={`rounded-2xl border p-3.5 text-left transition-all ${
                    fulfillmentType === "scheduled"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="text-xs font-black text-slate-900">Schedule Order</p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Pick a convenient delivery time
                  </p>
                </button>
              </div>

              {fulfillmentType === "scheduled" && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    Select Delivery Slot
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { minutes: 45, label: "In 45 mins" },
                      { minutes: 60, label: "In 1 hour" },
                      { minutes: 90, label: "In 1.5 hours" },
                      { minutes: 120, label: "In 2 hours" },
                      { minutes: 180, label: "In 3 hours" },
                      { minutes: 240, label: "In 4 hours" },
                    ].map((slot) => {
                      const isSel = scheduledSlot === slot.minutes;
                      return (
                        <button
                          key={slot.minutes}
                          type="button"
                          onClick={() => setScheduledSlot(slot.minutes)}
                          className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                            isSel
                              ? "border-primary bg-primary text-white shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Your order will be freshly cooked and delivered around{" "}
                    <span className="font-bold text-slate-800">
                      {new Date(Date.now() + scheduledSlot * 60_000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    .
                  </p>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Payment Method</h2>
              <div className="space-y-3">
                {/* The Kada Wallet */}
                <label
                  onClick={() => {
                    const orderTotal = (quote?.totalPaise ?? totals.total * 100) / 100;
                    if (walletBalance != null && walletBalance >= orderTotal) {
                      setPayment("wallet");
                    } else {
                      toast(
                        `Insufficient wallet balance (₹${(walletBalance ?? 0).toFixed(
                          2
                        )}). Please select Razorpay or refill in Account.`
                      );
                    }
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    payment === "wallet"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-xs">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-slate-900">The Kada Wallet</p>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                          1-TAP PAY
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        Available Balance:{" "}
                        <span className="font-bold text-slate-800">
                          {walletBalance == null ? "…" : `₹${walletBalance.toFixed(2)}`}
                        </span>
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === "wallet"}
                    onChange={() => {}}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                </label>

                {/* Razorpay Online */}
                <label
                  onClick={() => setPayment("razorpay")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    payment === "razorpay"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        Online Payment (UPI, Cards, NetBanking)
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        Fast, secure checkout powered by Razorpay
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === "razorpay"}
                    onChange={() => setPayment("razorpay")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPayment("cod")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    payment === "cod"
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Cash on Delivery (COD)</p>
                      <p className="text-xs font-semibold text-slate-500">
                        Pay with cash or UPI directly when food arrives
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="pay"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Bill (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Order Items Summary */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-slate-900">Order Summary</h2>
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {cart.lines.map((l) => (
                  <div key={l.cartId} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-black text-slate-900">
                        {l.qty}× {l.item.name}
                      </p>
                      {l.variant && (
                        <p className="text-[11px] font-bold text-slate-400">
                          {l.variant.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-800">
                      {formatMoney(
                        ((l.variant?.price ?? l.item.price) +
                          l.addons.reduce((s, a) => s + a.price, 0)) *
                          l.qty,
                        cur
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            {quoting && !quote ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xs">
                <Spinner className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Calculating real-time delivery quote...
                </p>
              </div>
            ) : quote?.bill ? (
              <div className={quoting ? "opacity-60 transition-opacity" : ""}>
                <BillCard
                  rows={quote.bill.rows}
                  totalPaise={quote.totalPaise}
                  savingsPaise={quote.bill.savingsPaise}
                  totalLabel="Total Amount"
                />
              </div>
            ) : quoteError ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800">
                {quoteError}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatMoney(totals.subtotal, cur)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Delivery fee</span>
                  <span className="text-emerald-600 font-black">FREE</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-black text-slate-900">
                  <span>Estimated Total</span>
                  <span>{formatMoney(totals.total, cur)}</span>
                </div>
              </div>
            )}

            {/* Place Order CTA */}
            <div className="space-y-3">
              <button
                onClick={submit}
                disabled={placing}
                className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-4 text-base font-black text-white shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {placing ? (
                  <>
                    <Spinner className="h-5 w-5 text-white" />
                    <span>Placing order...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Place Order ·{" "}
                      {quote
                        ? formatPaise(quote.totalPaise)
                        : formatMoney(totals.total, cur)}
                    </span>
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Safe & Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Picker Modal */}
      {showMapModal && (
        <MapLocationPickerModal
          initialLat={gps.lat}
          initialLng={gps.lng}
          onSelect={(res) => {
            setGps({ lat: res.lat, lng: res.lng });
            setArea(res.area);
            setLine1(res.line1);
            if (res.pincode) setPincode(res.pincode);
            if (res.landmark) setLandmark(res.landmark);
            setSelectedAddrId(null);
            setShowMapModal(false);
            toast("Delivery location confirmed on map.");
          }}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  );
}
