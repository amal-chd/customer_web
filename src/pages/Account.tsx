import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
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
  Compass,
} from "lucide-react";
import { toast } from "@/components/Toast";
import {
  getSavedAddresses,
  saveAddressToStorage,
  deleteAddressFromStorage,
  type DeliveryAddress,
  saveLocation,
} from "@/services/location";
import { MapLocationPickerModal } from "@/components/MapLocationPickerModal";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [refillAmt, setRefillAmt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "customer_users", user.uid), (snap) => {
      const value = snap.data()?.walletBalance;
      setBalance(typeof value === "number" ? value : 0);
    });

    getSavedAddresses(user.uid).then((list) => setAddresses(list));

    return unsub;
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

  async function handleRefill() {
    if (!user || !refillAmt) {
      toast("Select an amount to top up.");
      return;
    }
    setLoading(true);
    try {
      const next = await topUpWallet({
        amountRupees: refillAmt,
        name: user.displayName || "",
        email: user.email || "",
        contact: user.phoneNumber || "",
      });
      if (next == null) toast("Payment cancelled.");
      else {
        setBalance(next);
        toast(`₹${refillAmt} added to your wallet.`);
        setRefillAmt(null);
      }
    } catch (e: any) {
      toast(e?.message || "Top-up failed. Nothing was added.");
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <div className="mx-auto min-h-[80vh] max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex items-center justify-center relative w-32 h-32">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img
            src="/character-1.jpg"
            alt="Mascot"
            className="relative w-full h-full object-cover rounded-full mix-blend-multiply"
          />
        </div>
        <h2 className="mt-6 text-xl font-black text-slate-900">Please log in</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">
          Sign in to access your profile, saved addresses, and wallet.
        </p>
        <button onClick={() => navigate("/login")} className="btn-primary mt-6 mx-auto">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Banner Header */}
      <div className="bg-white border-b border-slate-100 shadow-xs">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-primary to-indigo-600 text-3xl font-black text-white shadow-xl shadow-primary/25">
              {(user.displayName?.[0] ?? user.email?.[0] ?? "K").toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {user.displayName || "Valued Customer"}
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">{user.email}</p>
              {user.phoneNumber && (
                <p className="text-xs font-bold text-slate-400 mt-0.5">{user.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-8">
        {/* Wallet Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-7 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-200">
                The Kada Wallet
              </span>
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
              <span>{user.displayName || "CARD HOLDER"}</span>
              <span className="font-mono">•••• {user.uid.slice(-4).toUpperCase()}</span>
            </div>
          </div>

          <div className="md:col-span-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Refill Wallet</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Instant checkout with zero payment failures.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setRefillAmt(amt)}
                    className={`rounded-2xl border py-3 text-sm font-black transition-all ${
                      refillAmt === amt
                        ? "border-primary bg-primary/10 text-primary shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {refillAmt ? (
              <button
                onClick={() => void handleRefill()}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {loading ? "Opening Razorpay…" : `Pay ₹${refillAmt} with Razorpay`}
              </button>
            ) : (
              <p className="text-xs font-medium text-slate-400 text-center">
                Select an amount above to top up
              </p>
            )}
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Saved Addresses</h2>
              <p className="text-xs font-semibold text-slate-400">
                Manage your home, office, and delivery locations
              </p>
            </div>
            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Address</span>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center">
              <MapPin className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">No saved addresses yet</p>
              <p className="text-xs font-medium text-slate-400 mt-0.5">
                Add an address to checkout even faster.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 space-y-3 relative group hover:border-primary/40 hover:bg-white transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {addr.label.toLowerCase().includes("work") ? (
                          <Briefcase className="h-4 w-4" />
                        ) : (
                          <Home className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{addr.label}</h3>
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

                  <p className="text-xs font-medium text-slate-500 line-clamp-2">
                    {[addr.line1, addr.landmark, addr.pincode].filter(Boolean).join(", ")}
                  </p>

                  <button
                    onClick={() => handleSelectAsDelivery(addr)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors"
                  >
                    Set as Active Delivery Address
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Quick Links */}
        <div className="rounded-3xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-xs overflow-hidden">
          <button
            onClick={() => navigate("/orders")}
            className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ReceiptText className="h-4 w-4" />
              </div>
              <span>My Orders</span>
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
              <span>Sign Out</span>
            </div>
          </button>
        </div>
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
