import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Clock, ChefHat, Check, Mail, Phone, MapPin, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "@/components/Toast";

// ─── ABOUT PAGE ─────────────────────────────────────────────────────────────
export function About() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            Our Story
          </div>
          <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
            About The Kada
          </h1>
          <p className="text-lg font-medium text-sub max-w-xl mx-auto">
            Redefining restaurant operations and food delivery in India. Built for speed, transparency, and top-tier customer experience.
          </p>
        </div>

        <div className="card p-8 space-y-6">
          <p className="text-base font-semibold text-sub leading-relaxed">
            The Kada started with a simple vision: to empower local restaurants with high-speed POS software and give diners a transparent, high-fidelity online ordering experience. 
          </p>
          <p className="text-base font-semibold text-sub leading-relaxed">
            Unlike other platforms that charge hefty commissions, The Kada focus on providing high-value tooling, clean digital menus, and live kitchen updates so you always know exactly when your meal is prepped, packed, and out for delivery.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Restaurants Partnered", val: "500+" },
            { label: "On-Time Deliveries", val: "99.2%" },
            { label: "Active Diners", val: "50,000+" }
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <p className="text-3xl font-black text-primary">{stat.val}</p>
              <p className="text-xs font-black uppercase tracking-wider text-sub mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HOW IT WORKS PAGE ────────────────────────────────────────────────────────
export function HowItWorks() {
  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            Simplified Ordering
          </div>
          <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
            How The Kada Works
          </h1>
          <p className="text-lg font-medium text-sub max-w-xl mx-auto">
            Three simple steps to delicious meals delivered right to your table or doorstep.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-line">
          {[
            {
              step: "01",
              icon: Sparkles,
              title: "Discover Nearby Spots",
              desc: "Enter your location to discover the finest local restaurants, cafes, and bakeries. Filter by ratings, veg-only, or prep times."
            },
            {
              step: "02",
              icon: ChefHat,
              title: "Add Items & Customize",
              desc: "Select items from high-fidelity digital menus. Add special instructions, choose toppings, and pay securely via UPI, wallet, or cards."
            },
            {
              step: "03",
              icon: Clock,
              title: "Live Kitchen Tracking",
              desc: "Watch your order move from kitchen acceptance, preparation, cooking, ready for delivery, and in-transit to your doorstep."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="flex gap-6 relative z-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white border border-line shadow-sm text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-primary">{item.step}</span>
                    <h3 className="text-lg font-black text-ink">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-sub max-w-md leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
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
    }, 1500);
  }

  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-12 md:grid-cols-12">
          
          <div className="md:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary mb-4">
                Support
              </div>
              <h1 className="text-4xl font-black tracking-tight text-ink">
                Get in Touch
              </h1>
              <p className="mt-3 text-base font-semibold text-sub leading-relaxed">
                Have questions about your order, refunds, or general feedback? Our team responds within 2 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-line shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-sub uppercase tracking-wider">Email Us</p>
                  <p className="text-sm font-bold text-ink">support@thekada.in</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-line shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-sub uppercase tracking-wider">Call Support</p>
                  <p className="text-sm font-bold text-ink">+91 9496491654</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-line shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-sub uppercase tracking-wider">Address</p>
                  <p className="text-sm font-bold text-ink">Kannur, Kerala, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSend} className="card p-8 space-y-4 shadow-lg">
              <h3 className="text-lg font-black text-ink">Send a message</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase tracking-wider text-sub block">Message</label>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us what we can help you with..."
                  rows={4}
                  className="w-full rounded-xl border border-line py-2.5 px-4 text-sm font-semibold outline-none focus:border-primary resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-3.5 font-black flex items-center justify-center"
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
  const [active, setActive] = useState<number | null>(null);

  const FAQS = [
    {
      q: "How fast is delivery?",
      a: "Our typical delivery time ranges between 20 to 35 minutes depending on the preparation time required by the restaurant and the distance. You can track this live in your Orders tab."
    },
    {
      q: "Can I cancel my order?",
      a: "Orders can be cancelled before the restaurant accepts and starts preparing the food. Once the restaurant has accepted the order, cancellations are not permitted."
    },
    {
      q: "Are there any delivery charges?",
      a: "Yes, delivery charges are calculated based on the distance between the restaurant and your delivery address. These are calculated transparently at checkout."
    },
    {
      q: "What payment options are supported?",
      a: "We accept UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards, Net Banking, and wallet balance refills from The Kada Wallet."
    }
  ];

  return (
    <div className="bg-canvas py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            Help Center
          </div>
          <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-lg font-medium text-sub">
            Quick answers to common questions about using The Kada.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left font-extrabold text-ink hover:bg-canvas transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-primary text-xl font-bold">{active === i ? "−" : "+"}</span>
              </button>
              {active === i && (
                <div className="px-5 pb-5 pt-1 text-sm font-semibold text-sub leading-relaxed border-t border-line">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
