import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { topUpWallet } from "@/services/wallet";
import { CreditCard, LogOut, ArrowRight } from "lucide-react";
import { toast } from "@/components/Toast";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [refillAmt, setRefillAmt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "customer_users", user.uid), (snap) => {
      const value = snap.data()?.walletBalance;
      setBalance(typeof value === "number" ? value : 0);
    });
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

  if (!user) {
    return (
      <div className="mx-auto min-h-[80vh] max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto flex items-center justify-center relative w-32 h-32">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <img src="/character-1.jpg" alt="Mascot" className="relative w-full h-full object-cover rounded-full mix-blend-multiply" />
        </div>
        <h2 className="mt-6 text-xl font-black text-ink">Please log in</h2>
        <p className="mt-2 text-sm font-semibold text-sub">You need to sign in to access your profile and wallet.</p>
        <button onClick={() => navigate("/login")} className="btn-primary mt-6 mx-auto">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-slate-50 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-6 border-b border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-black text-white">
            {(user.displayName?.[0] ?? user.email?.[0] ?? "K").toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{user.displayName || "Guest"}</h2>
            <p className="text-sm font-semibold text-slate-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Wallet Visual Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-200">The Kada Wallet</span>
            <CreditCard className="h-6 w-6 text-indigo-300" />
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Available Balance</p>
            <p className="text-3xl font-black tracking-tight mt-1">
              {balance == null ? "…" : `₹${balance.toFixed(2)}`}
            </p>
          </div>
          <div className="mt-6 flex justify-between items-center text-xs font-bold text-indigo-200">
            <span>{user.displayName || "CARD HOLDER"}</span>
            <span className="font-mono">•••• •••• •••• {user.uid.slice(-4).toUpperCase()}</span>
          </div>
        </div>

        {/* Refill Options */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-black text-ink">Refill Wallet</h3>
          
          <div className="grid grid-cols-3 gap-2">
            {[100, 250, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setRefillAmt(amt)}
                className={`rounded-xl border py-2.5 text-sm font-black transition-all ${
                  refillAmt === amt ? "border-primary bg-primary/10 text-primary" : "border-line bg-white hover:border-sub"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          {refillAmt && (
            <button
              onClick={() => void handleRefill()}
              disabled={loading}
              className="btn-primary w-full py-3.5 font-black"
            >
              {loading ? "Opening Razorpay…" : `Pay ₹${refillAmt} with Razorpay`}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="card divide-y divide-line overflow-hidden">
          <button
            onClick={() => navigate("/orders")}
            className="flex w-full items-center justify-between p-4 text-left font-bold text-ink hover:bg-canvas transition-colors"
          >
            <span>My Orders</span>
            <ArrowRight className="h-4 w-4 text-sub" />
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-between p-4 text-left font-bold text-danger hover:bg-danger/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Sign Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
