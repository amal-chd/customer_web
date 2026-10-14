import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Clock,
  ChefHat,
  Check,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Store
} from "lucide-react";
import { toast } from "@/components/Toast";

// ─── ABOUT PAGE ─────────────────────────────────────────────────────────────
export function About() {
  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10 sm:space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            Our Story
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink">
            About The Kada
          </h1>
          <p className="text-base sm:text-lg font-medium text-sub max-w-xl mx-auto leading-relaxed">
            Redefining restaurant operations and food delivery in India. Built for speed, transparency, and top-tier customer experience.
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-6">
          <p className="text-sm sm:text-base font-semibold text-sub leading-relaxed">
            The Kada started with a simple vision: to empower local restaurants with high-speed POS software and give diners a transparent, high-fidelity online ordering experience.
          </p>
          <p className="text-sm sm:text-base font-semibold text-sub leading-relaxed">
            Unlike other platforms that charge hefty commissions, The Kada focuses on providing high-value tooling, clean digital menus, and live kitchen updates so you always know exactly when your meal is prepped, packed, and out for delivery.
          </p>

          <div className="pt-4 border-t border-line flex flex-wrap items-center gap-3">
            <Link
              to="/investor-relations"
              className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline"
            >
              <span>Explore Investor Relations</span>
              <Sparkles className="h-3.5 w-3.5" />
            </Link>
            <span className="text-line">•</span>
            <Link
              to="/add-restaurant"
              className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-primary transition-colors"
            >
              <span>Partner Your Restaurant</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
          {[
            { label: "Restaurants Partnered", val: "500+" },
            { label: "On-Time Deliveries", val: "99.2%" },
            { label: "Active Diners", val: "50,000+" }
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <p className="text-3xl sm:text-4xl font-black text-primary">{stat.val}</p>
              <p className="text-xs font-black uppercase tracking-wider text-sub mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !msg.trim()) {
      toast("Please fill all required fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      toast("Thank you! Your message has been sent.");
      setName("");
      setEmail("");
      setMsg("");
      setSending(false);
    }, 1200);
  }

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-12 items-start">
          <div className="md:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary mb-3">
                Support & Contact
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">
                Get in Touch
              </h1>
              <p className="mt-2 text-sm sm:text-base font-semibold text-sub leading-relaxed">
                Have questions about your order, restaurant partnerships, or general feedback? Our team is here to assist.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-line shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-sub uppercase tracking-wider">Email Us</p>
                  <a href="mailto:support@thekada.in" className="text-sm font-bold text-ink hover:text-primary transition-colors block truncate">
                    support@thekada.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-line shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-sub uppercase tracking-wider">Call Support</p>
                  <a href="tel:+919496491654" className="text-sm font-bold text-ink hover:text-primary transition-colors block truncate">
                    +91 9496491654
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-line shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-sub uppercase tracking-wider">Corporate Office</p>
                  <p className="text-sm font-bold text-ink">The Kada, Kannur, Kerala 670001, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSend} className="card p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-lg font-black text-ink">Send a message</h3>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary focus:bg-white transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Message</label>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us what we can help you with..."
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary focus:bg-white transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3.5 font-black flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {sending ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAQ PAGE ────────────────────────────────────────────────────────────────
export function Faq() {
  const [active, setActive] = useState<number | null>(0);

  const FAQS = [
    {
      q: "How fast is delivery?",
      a: "Our typical delivery time ranges between 20 to 35 minutes depending on the preparation time required by the restaurant and the distance. You can track this live in your Orders tab with real-time GPS updates."
    },
    {
      q: "Can I cancel my order?",
      a: "Orders can be cancelled before the kitchen accepts and starts preparing the food. Once the restaurant has accepted the order and started food prep, cancellations are not permitted to minimize food waste."
    },
    {
      q: "Are there any delivery charges?",
      a: "Yes, delivery charges are calculated based on the distance between the restaurant and your delivery address. These are calculated transparently and shown upfront at checkout with zero hidden fees."
    },
    {
      q: "What payment options are supported?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm, BHIM), Credit and Debit Cards (Visa, Mastercard, RuPay), Net Banking, and wallet balance refills from The Kada Wallet."
    },
    {
      q: "How do I list my restaurant on The Kada?",
      a: "You can partner your restaurant in just a few minutes by clicking 'Add Restaurant' in the navigation or visiting our merchant onboarding portal at kadadine.thekada.in."
    }
  ];

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            Help Center
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg font-medium text-sub">
            Quick answers to common questions about using The Kada.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-bold text-ink hover:bg-slate-100/50 transition-colors gap-4"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <span className="text-primary text-xl font-bold shrink-0">{active === i ? "−" : "+"}</span>
              </button>
              {active === i && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-semibold text-sub leading-relaxed border-t border-line">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 text-center space-y-3 bg-white">
          <p className="text-sm font-bold text-ink">Still have questions?</p>
          <p className="text-xs font-semibold text-sub">Our support team is always ready to help you with your orders or merchant inquiries.</p>
          <div>
            <Link to="/contact" className="btn-primary inline-flex px-6 py-2.5 text-xs font-bold">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
