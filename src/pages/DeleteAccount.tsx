import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Check, ArrowLeft } from "lucide-react";
import { toast } from "@/components/Toast";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState("customer");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !confirmed) {
      toast("Please fill in all required fields and accept the confirmation.");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "contact_requests"), {
        status: "new",
        name: "Account Deletion Request",
        email,
        phone,
        topic: "account_deletion",
        message: `Account Type: ${accountType === "customer" ? "Customer App Account" : "Merchant/Partner Account"}\nReason: ${reason || "None specified"}\nConfirmation: Permanent deletion accepted by user.`,
        createdAtIso: new Date().toISOString(),
        source: "customer_web_deletion_form",
      });
      setSubmitted(true);
      toast("Account deletion request submitted successfully!");
    } catch (err) {
      console.error(err);
      toast("Failed to submit request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-canvas min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-sub hover:text-ink transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <div className="w-full space-y-6 rounded-3xl bg-white p-6 md:p-10 shadow-card border border-line">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-ink">Delete Your Account</h2>
            <p className="text-sm font-semibold text-sub max-w-sm mx-auto">
              Please submit this form to request permanent deletion of your account and personal data.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-ink">Request Submitted</h3>
              <p className="text-sm font-semibold text-sub">
                Your request to delete the account linked with <strong>{email}</strong> has been received. Our support team will process your request within 7 business days. You will receive a confirmation email.
              </p>
              <div className="pt-4">
                <Link to="/" className="btn-primary w-full py-3.5 font-black flex items-center justify-center">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-sub block mb-2">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType("customer")}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all ${
                        accountType === "customer"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-line bg-transparent text-sub hover:border-sub/30"
                      }`}
                    >
                      <span className="font-bold text-sm">Customer App</span>
                      <span className="text-[10px] opacity-70 mt-0.5">Food Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("merchant")}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 text-center transition-all ${
                        accountType === "merchant"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-line bg-transparent text-sub hover:border-sub/30"
                      }`}
                    >
                      <span className="font-bold text-sm">Merchant / POS</span>
                      <span className="text-[10px] opacity-70 mt-0.5">Restaurant App</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-sub block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-sub block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-sub block">Reason for Deletion (Optional)</label>
                  <textarea
                    placeholder="Help us improve by telling us why you want to leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full min-h-[80px] rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="bg-danger/5 border border-danger/20 rounded-2xl p-4">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    id="confirm-deletion"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-line text-primary focus:ring-primary"
                  />
                  <label htmlFor="confirm-deletion" className="text-xs font-semibold text-danger select-none leading-relaxed">
                    I understand that account deletion is permanent. All orders, points, and account data will be completely deleted and cannot be recovered.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 font-black flex items-center justify-center mt-2"
              >
                {loading ? "Submitting..." : "Submit Deletion Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
