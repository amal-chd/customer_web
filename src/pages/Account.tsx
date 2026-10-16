import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { db, auth } from "@/lib/firebase";
import { topUpWallet } from "@/services/wallet";
import {
  CreditCard,
  LogOut,
  ArrowRight,
  MapPin,
  Plus,
  Home,
  Briefcase,
  Trash2,
  ReceiptText,
  User,
  ShieldCheck,
  Headphones,
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Repeat,
  CheckCircle2,
  Clock,
  Bike,
  Sparkles,
  Edit2,
  Check,
  X,
  Wallet,
  Store,
} from "lucide-react";
import { toast } from "@/components/Toast";
import {
  getSavedAddresses,
  saveAddressToStorage,
  deleteAddressFromStorage,
  type DeliveryAddress,
  saveLocation,
  getDiscoveryLocation,
} from "@/services/location";
import { subscribeMyOrders, getRestaurant } from "@/services/orders";
import type { CustomerOrder, MenuItem } from "@/types";
import { formatMoney } from "@/lib/currency";
import { displayOrderNumber } from "@/lib/orderNumber";
import { Spinner } from "@/components/bits";
import { MapLocationPickerModal } from "@/components/LazyMapPicker";

const FAQS = [
  {
    q: "How does 1-click Kada Wallet checkout work?",
    a: "Your Kada Wallet holds balance for instant ordering. There are zero payment gateway hops or OTP delays, meaning 100% order placement success even during high bank traffic periods.",
  },
  {
    q: "What is The Kada's cancellation and refund policy?",
    a: "Orders can be cancelled free of charge before the restaurant accepts and starts food preparation. Once cancelled, refunds are immediately credited back to your Kada Wallet in seconds or to your original source account within 3–5 working days.",
  },
  {
    q: "How are delivery charges calculated?",
    a: "Delivery charges are calculated based on the actual road distance between the restaurant and your delivery drop location. Free delivery is automatically applied when your order meets the promotional threshold.",
  },
  {
    q: "What if an item is missing or damaged in my delivery?",
    a: "If anything is wrong with your order, message our WhatsApp or phone support with a photo as soon as possible. Our team will review it and arrange a replacement or refund under our refund policy.",
  },
];

type AccountTab = "profile" | "addresses" | "orders" | "help";

export default function Account() {
  const { user, logout, updateCustomerName } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [balance, setBalance] = useState<number | null>(null);
  const [refillAmt, setRefillAmt] = useState<number | null>(null);
  const [customAmt, setCustomAmt] = useState("");
  const [loadingRefill, setLoadingRefill] = useState(false);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // FAQ accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeLoc = getDiscoveryLocation();

  useEffect(() => {
    if (!user) return;
    setEditName(user.displayName || "");

    const unsubWallet = onSnapshot(doc(db, "customer_users", user.uid), (snap) => {
      const value = snap.data()?.walletBalance;
      setBalance(typeof value === "number" ? value : 0);
    });

    getSavedAddresses(user.uid).then((list) => setAddresses(list));

    const unsubOrders = subscribeMyOrders((list) => {
      setOrders(list);
      setLoadingOrders(false);
    });

    return () => {
      unsubWallet();
      unsubOrders();
    };
  }, [user]);

  async function handleLogout() {
    try {
      await logout();
      toast("Logged out successfully");
      navigate("/login");
    } catch {
      toast("Could not log out");
    }
  }

  async function handleUpdateName() {
    if (!editName.trim()) {
      toast("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      await updateCustomerName(editName.trim());
      setIsEditingName(false);
      toast("Profile updated successfully!");
    } catch {
      toast("Could not update profile name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleRefill(amountToPay: number) {
    if (!user) {
      toast("Please sign in first.");
      return;
    }
    if (amountToPay < 10) {
      toast("Minimum recharge amount is ₹10.");
      return;
    }
    setLoadingRefill(true);
    try {
      const next = await topUpWallet({
        amountRupees: amountToPay,
        name: user.displayName || "Customer",
        email: user.email || "",
        contact: user.phoneNumber || "",
      });
      if (next == null) {
        toast("Payment cancelled.");
      } else {
        setBalance(next);
        toast(`₹${amountToPay} credited to your Kada Wallet!`);
        setRefillAmt(null);
        setCustomAmt("");
      }
    } catch (e: any) {
      toast(e?.message || "Top-up failed. Please try again.");
    } finally {
      setLoadingRefill(false);
    }
  }

  async function handleDeleteAddress(id?: string) {
    if (!id) return;
    const updated = await deleteAddressFromStorage(id, user?.uid);
    setAddresses(updated);
    toast("Address removed.");
  }

  function handleSelectAsDelivery(addr: DeliveryAddress) {
    saveLocation({
      lat: addr.lat,
      lng: addr.lng,
      label: addr.area || addr.label,
      area: addr.area,
      line1: addr.line1,
      pincode: addr.pincode,
      isGps: false,
    });
    toast(`Active delivery location set to: ${addr.label}`);
  }

  async function handleReorder(order: CustomerOrder) {
    setReorderingId(order.id);
    try {
      const rest = await getRestaurant(order.restaurantId);
      if (!rest) {
        toast("Restaurant is currently unavailable.");
        return;
      }

      if (cart.restaurant && cart.restaurant.id !== rest.id && !cart.isEmpty) {
        cart.clear();
      }

      for (let i = 0; i < order.items.length; i++) {
        const it = order.items[i];
        const menuItem: MenuItem = {
          id: it.id || it.menuItemId || `reorder-${i}`,
          restaurantId: order.restaurantId,
          name: it.name || "Item",
          price: it.price || 0,
          category: it.category || "General",
          image: it.image || it.imageUrl,
          isVeg: it.isVeg ?? true,
          isAvailable: true,
          isRecommended: false,
          variants: it.variants || [],
          addons: it.addons || [],
        };
        cart.add(rest, menuItem, {
          variant: it.variant || it.selectedVariant,
          addons: it.addons || it.selectedAddons || [],
          qty: it.qty || 1,
        });
      }

      toast("Items added to your cart!");
      navigate("/cart");
    } catch (e: any) {
      toast("Could not reorder. Please browse the restaurant menu.");
    } finally {
      setReorderingId(null);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto min-h-[80vh] max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex items-center justify-center relative w-24 h-24 sm:w-28 sm:h-28">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img
            src="/logo.png"
            alt="The Kada"
            className="relative w-full h-full object-contain"
          />
        </div>
        <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
          Welcome to The Kada
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Sign in to manage your digital wallet, track orders, and view saved addresses.
        </p>
        <button onClick={() => navigate("/login?next=/account")} className="btn-primary mt-6 mx-auto">
          Sign In
        </button>
      </div>
    );
  }

  const activeOrders = orders.filter((o) =>
    ["new", "pending", "preparing", "cooking", "accepted", "in_progress", "ready", "out_for_delivery", "dispatched"].includes(
      o.status.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-100 shadow-xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-3xl font-black text-white shadow-xl shadow-primary/25">
                  {(user.displayName?.[0] ?? user.email?.[0] ?? "K").toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {user.displayName || "Valued Customer"}
                  </h1>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-black text-amber-700 border border-amber-200">
                    KADA GOLD
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 mt-0.5">{user.email}</p>
                {user.phoneNumber && (
                  <p className="text-xs font-bold text-slate-400 mt-0.5">{user.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-3 self-start sm:self-auto">
              <div className="px-3 border-r border-slate-200 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Wallet Balance
                </p>
                <p className="text-base font-black text-primary">
                  {balance == null ? "…" : `₹${balance.toFixed(0)}`}
                </p>
              </div>
              <div className="px-3 border-r border-slate-200 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Addresses
                </p>
                <p className="text-base font-black text-slate-800">{addresses.length}</p>
              </div>
              <div className="px-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>
                <p className="text-base font-black text-slate-800">{orders.length}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation Navigation Rail */}
          <div className="flex gap-2 border-t border-slate-100 mt-8 pt-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all shrink-0 ${
                activeTab === "profile"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              <span>Wallet & Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all shrink-0 ${
                activeTab === "addresses"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Saved Addresses ({addresses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all shrink-0 relative ${
                activeTab === "orders"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ReceiptText className="h-4 w-4" />
              <span>Order History</span>
              {activeOrders.length > 0 && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("help")}
              className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all shrink-0 ${
                activeTab === "help"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Headphones className="h-4 w-4" />
              <span>Help & Policies</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-8">
        {/* TAB 1: WALLET & PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Wallet Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white font-black text-xs">
                      K
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-200">
                      The Kada Wallet
                    </span>
                  </div>
                  <CreditCard className="h-6 w-6 text-indigo-300" />
                </div>
                <div className="my-6">
                  <p className="text-[11px] font-black uppercase tracking-wider text-indigo-200">
                    Available Balance
                  </p>
                  <p className="text-4xl font-black tracking-tight mt-1 text-white">
                    {balance == null ? "…" : `₹${balance.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-indigo-200 border-t border-white/10 pt-4">
                  <span className="tracking-wide uppercase">{user.displayName || "KADA MEMBER"}</span>
                  <span className="font-mono">•••• {user.uid.slice(-4).toUpperCase()}</span>
                </div>
              </div>

              {/* Refill Box */}
              <div className="md:col-span-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-slate-900">Refill Wallet</h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700">
                      100% SECURE
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                    Instant 1-click checkout with zero payment failures.
                  </p>

                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => {
                          setRefillAmt(amt);
                          setCustomAmt("");
                        }}
                        className={`rounded-2xl border py-2.5 text-xs font-black transition-all ${
                          refillAmt === amt
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <input
                      type="number"
                      placeholder="Or enter custom amount (₹)"
                      value={customAmt}
                      onChange={(e) => {
                        setCustomAmt(e.target.value);
                        setRefillAmt(Number(e.target.value) || null);
                      }}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                {refillAmt && refillAmt > 0 ? (
                  <button
                    onClick={() => void handleRefill(refillAmt)}
                    disabled={loadingRefill}
                    className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {loadingRefill ? (
                      <>
                        <Spinner className="h-4 w-4 text-white" />
                        <span>Opening Razorpay…</span>
                      </>
                    ) : (
                      <span>Pay ₹{refillAmt} with Razorpay</span>
                    )}
                  </button>
                ) : (
                  <p className="text-xs font-medium text-slate-400 text-center py-2">
                    Select an amount above to top up
                  </p>
                )}
              </div>
            </div>

            {/* Profile Info & Account Details Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Personal Information</h2>
                  <p className="text-xs font-semibold text-slate-400">
                    Manage your account details and contact preferences
                  </p>
                </div>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 rounded-xl border border-primary bg-primary/5 px-3 py-2 text-sm font-bold text-slate-800 outline-none"
                      />
                      <button
                        onClick={handleUpdateName}
                        disabled={savingName}
                        className="rounded-xl bg-primary px-3 py-2 text-xs font-black text-white hover:bg-primary/90"
                      >
                        {savingName ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-slate-800">
                      {user.displayName || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <p className="text-sm font-bold text-slate-800">{user.email || "—"}</p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <p className="text-sm font-bold text-slate-800">
                    {user.phoneNumber || "Verified via Google/Phone"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Customer Account ID
                  </label>
                  <p className="text-xs font-mono font-bold text-slate-500 truncate">
                    {user.uid}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links Banner */}
            <div className="rounded-3xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-xs overflow-hidden">
              <button
                onClick={() => setActiveTab("orders")}
                className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <ReceiptText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">View All Orders</p>
                    <p className="text-xs font-medium text-slate-400">
                      {orders.length} previous orders recorded
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-between p-5 text-left font-bold text-red-600 hover:bg-red-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-red-600">Sign Out</p>
                    <p className="text-xs font-medium text-red-400">Log out of your Kada account</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Saved Addresses</h2>
                <p className="text-xs font-semibold text-slate-400">
                  Manage your home, office, and delivery locations
                </p>
              </div>
              <button
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                <MapPin className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-base font-bold text-slate-700">No saved addresses yet</p>
                <p className="text-xs font-medium text-slate-400 mt-1 max-w-sm mx-auto">
                  Add your home or office address to enable instant 1-tap checkout.
                </p>
                <button
                  onClick={() => setShowMapModal(true)}
                  className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white"
                >
                  Pin Address on Map
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isActive =
                    activeLoc.line1 === addr.line1 ||
                    (addr.lat === activeLoc.lat && addr.lng === activeLoc.lng);
                  return (
                    <div
                      key={addr.id}
                      className={`rounded-2xl border p-5 space-y-3 relative group transition-all shadow-xs ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : "border-slate-200/80 bg-slate-50/60 hover:border-primary/40 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {addr.label.toLowerCase().includes("work") ? (
                              <Briefcase className="h-5 w-5" />
                            ) : (
                              <Home className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-black text-slate-900">{addr.label}</h3>
                              {isActive && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-black text-white">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-primary">{addr.area}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-xs font-medium text-slate-600 line-clamp-2">
                        {[addr.line1, addr.landmark, addr.pincode].filter(Boolean).join(", ")}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60">
                        {isActive ? (
                          <div className="flex items-center gap-1.5 text-xs font-black text-primary">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Current Delivery Location</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectAsDelivery(addr)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors"
                          >
                            Set as Active Delivery Address
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY & REORDER */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Active Orders Strip */}
            {activeOrders.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-base font-black text-slate-900">Active Deliveries</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {activeOrders.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/5 via-indigo-50 to-primary/10 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 shrink-0">
                          <Bike className="h-6 w-6 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-black text-slate-900">
                              {o.restaurantName}
                            </h3>
                            <span className="rounded-md bg-white px-2 py-0.5 text-xs font-black text-primary border border-primary/20">
                              {displayOrderNumber(o.orderNumber, o.id)}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 mt-0.5">
                            Status: <span className="text-primary uppercase">{o.status}</span>
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="rounded-2xl bg-primary px-5 py-3 text-xs font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Orders Section */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Previous Orders</h2>
                  <p className="text-xs font-semibold text-slate-400">
                    Review your order history or reorder your favorites in 1 click
                  </p>
                </div>
                <button
                  onClick={() => navigate("/order")}
                  className="text-xs font-black text-primary hover:underline"
                >
                  Order Food Now
                </button>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center">
                  <Spinner className="mx-auto h-7 w-7 text-primary" />
                  <p className="mt-2 text-xs font-bold text-slate-400">Loading your orders…</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-12 text-center">
                  <ReceiptText className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-base font-bold text-slate-700">No orders placed yet</p>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Explore top restaurants and dishes nearby.
                  </p>
                  <button
                    onClick={() => navigate("/order")}
                    className="btn-primary mt-4 mx-auto text-xs"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => {
                    const isDelivered = o.status === "delivered" || o.status === "completed";
                    const isCancelled = ["cancelled", "canceled", "rejected"].includes(
                      o.status.toLowerCase()
                    );
                    return (
                      <div
                        key={o.id}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-slate-900">
                                {o.restaurantName}
                              </h3>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                                {displayOrderNumber(o.orderNumber, o.id)}
                              </span>
                            </div>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">
                              {o.timestamp ? new Date(o.timestamp).toLocaleString() : "Recent"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
                                isDelivered
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isCancelled
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-blue-50 text-primary border border-blue-200"
                              }`}
                            >
                              {o.status.toUpperCase()}
                            </span>
                            <span className="text-sm font-black text-slate-900">
                              {formatMoney(o.total, o.currency)}
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <p className="text-xs font-medium text-slate-600 line-clamp-2">
                          {o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ")}
                        </p>

                        {/* Order Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            onClick={() => navigate(`/orders/${o.id}`)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors"
                          >
                            View Details / Invoice
                          </button>

                          <button
                            onClick={() => handleReorder(o)}
                            disabled={reorderingId === o.id}
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-white shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
                          >
                            {reorderingId === o.id ? (
                              <>
                                <Spinner className="h-3.5 w-3.5 text-white" />
                                <span>Adding…</span>
                              </>
                            ) : (
                              <>
                                <Repeat className="h-3.5 w-3.5" />
                                <span>1-Click Reorder</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HELP & POLICIES */}
        {activeTab === "help" && (
          <div className="space-y-6">
            {/* Customer Care Channels */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customer Support Hub</h2>
                <p className="text-xs font-semibold text-slate-400">
                  We are here to assist you 24/7 with any order, payment, or delivery questions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="https://wa.me/918078304878?text=Hi%20The%20Kada%20Support,%20I%20need%20help%20with%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 space-y-2 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-emerald-950">WhatsApp Care</h3>
                  <p className="text-xs font-medium text-emerald-700">
                    Instant chat assistance with our support team.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 group-hover:underline">
                    Chat Now <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </a>

                <a
                  href="tel:+918078304878"
                  className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 space-y-2 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Direct Helpline</h3>
                  <p className="text-xs font-medium text-slate-600">
                    Call our direct phone line for immediate order issues.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-primary group-hover:underline">
                    +91 80783 04878 <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </a>

                <a
                  href="mailto:support@thekada.in"
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-2 hover:bg-slate-100 transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900">Email Support</h3>
                  <p className="text-xs font-medium text-slate-600">
                    For partnership inquiries or formal grievances.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-slate-800 group-hover:underline">
                    support@thekada.in <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              </div>
            </div>

            {/* Restaurant Partner Onboarding Banner */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-indigo-50 to-primary/10 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20 shrink-0">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">Partner with The Kada</h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                      0% COMMISSION OFFER
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    Own a restaurant, cafe, or cloud kitchen? List your outlet on The Kada and start getting live customer orders.
                  </p>
                </div>
              </div>

              <Link
                to="/add-restaurant"
                className="rounded-2xl bg-primary px-5 py-3 text-xs font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>Add Your Restaurant</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Frequently Asked Questions */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-black text-slate-900">Frequently Asked Questions</h2>
              <div className="divide-y divide-slate-100">
                {FAQS.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div key={i} className="py-4">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between text-left text-sm font-black text-slate-800 hover:text-primary transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-2.5 text-xs font-medium text-slate-500 leading-relaxed pr-6">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legal & Account Deletion */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Privacy & Terms</h3>
                  <p className="text-xs font-medium text-slate-500">
                    Your personal information and payment data are encrypted & protected under IT Act.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/legal"
                  className="text-xs font-bold text-slate-600 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
                <span className="text-slate-300">·</span>
                <Link
                  to="/delete-account"
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Delete Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Location Picker Modal */}
      {showMapModal && (
        <MapLocationPickerModal
          onSelect={async (res) => {
            const newAddr: DeliveryAddress = {
              label: "New Address",
              line1: res.line1,
              area: res.area,
              landmark: res.landmark,
              pincode: res.pincode,
              lat: res.lat,
              lng: res.lng,
            };
            const updated = await saveAddressToStorage(newAddr, user.uid);
            setAddresses(updated);
            setShowMapModal(false);
            toast("New address added successfully.");
          }}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </div>
  );
}
