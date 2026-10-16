import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Phone,
  MessageCircle,
  ChefHat,
  ReceiptText,
  BadgePercent,
  Banknote,
  Sparkles,
  ChevronDown,
  Building,
} from "lucide-react";
import { getVendorOnboardingUrl, getVendorMarketingUrl } from "@/lib/urls";

const PERKS = [
  {
    icon: BadgePercent,
    title: "Lowest Commission Rates",
    desc: "Keep more of your hard-earned revenue. Enjoy 0% commission introductory plans with transparent pricing and zero hidden markups.",
  },
  {
    icon: Zap,
    title: "Instant 30-Min Onboarding",
    desc: "Complete your restaurant setup online with our streamlined onboarding wizard. Add your menu, verify FSSAI, and go live the same day.",
  },
  {
    icon: ChefHat,
    title: "Predictive KDS & Cloud POS",
    desc: "Get full access to Kada Dine's Kitchen Display System, table management, live order manager, and billing software at no extra cost.",
  },
  {
    icon: Banknote,
    title: "Next-Day Direct Payouts",
    desc: "Never wait weeks for your payments. Earnings are settled directly to your registered bank account daily with automated GST summaries.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Create Vendor Account",
    desc: "Enter your restaurant name, contact phone number, and email to initiate your merchant onboarding.",
  },
  {
    step: "02",
    title: "Restaurant Details & Location",
    desc: "Pin your kitchen location on the map, choose your service zone, and set opening & closing hours.",
  },
  {
    step: "03",
    title: "Menu & Documents",
    desc: "Add your menu items with photos and prices. Upload basic legal documents including FSSAI certificate and GST.",
  },
  {
    step: "04",
    title: "Go Live & Receive Orders",
    desc: "Once verified by our onboarding team, your restaurant goes live for customers in your area.",
  },
];

const FAQS = [
  {
    q: "How long does the restaurant onboarding process take?",
    a: "The online registration takes just 5–10 minutes. Once you submit your menu and FSSAI details via the Setup Wizard, our merchant team reviews and activates your restaurant within 24 hours.",
  },
  {
    q: "What documents are required to register a restaurant?",
    a: "You need a valid FSSAI registration/license certificate, PAN card (Proprietor or Business), GST certificate (if applicable), and bank account details (cheque or passbook) for receiving daily payouts.",
  },
  {
    q: "Who handles the delivery of orders?",
    a: "The Kada provides a dedicated hyperlocal rider network. As soon as your kitchen accepts the order, a rider is automatically assigned and tracked live from pickup to customer doorstep.",
  },
  {
    q: "Can I manage menus, pause orders, or change prices anytime?",
    a: "Yes! You have complete control via the Kada Dine Vendor Web and Vendor Mobile App. You can toggle item availability, adjust pricing, manage discount coupons, and pause orders during peak rushes.",
  },
];

export default function PartnerWithUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const signupUrl = getVendorOnboardingUrl("/signup");
  const loginUrl = getVendorOnboardingUrl("/login");
  const marketingUrl = getVendorMarketingUrl();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white py-20 lg:py-24">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-200 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Kada Dine Restaurant Partner Program</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Grow your food business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">The Kada</span>
          </h1>

          <p className="text-base sm:text-lg font-medium text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Reach new customers in your locality. Enjoy low commission rates, complete menu control, instant order management, and fast daily payouts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-2xl bg-primary px-8 py-4 text-base font-black text-white shadow-xl shadow-primary/30 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <Store className="h-5 w-5" />
              <span>Register Your Restaurant</span>
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href={loginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto rounded-2xl bg-white/10 border border-white/20 px-8 py-4 text-base font-black text-white hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>Vendor Login</span>
              <ExternalLink className="h-4 w-4 text-indigo-300" />
            </a>
          </div>

          <p className="text-xs font-bold text-indigo-300">
            ⚡ Self-serve setup · Zero hidden fees
          </p>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: "Self-serve", label: "Online Setup", sub: "Add your menu yourself" },
            { val: "Your menu", label: "Full Control", sub: "Prices, photos and stock" },
            { val: "Live", label: "Order Alerts", sub: "On the Kada Dine app" },
            { val: "Kada Rider", label: "Delivery Fleet", sub: "Riders pick up from you" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm text-center space-y-1"
            >
              <p className="text-2xl sm:text-3xl font-black text-primary">{s.val}</p>
              <p className="text-xs font-black uppercase tracking-wider text-slate-800">{s.label}</p>
              <p className="text-[11px] font-medium text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Partner with The Kada */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary">
            Merchant Benefits
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Restaurants Love The Kada Dine
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">
            Everything your kitchen needs to scale online deliveries without losing control or profit margin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERKS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">{p.title}</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Onboarding Journey */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary">
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How to Add Your Restaurant
            </h2>
            <p className="text-sm font-semibold text-slate-500 max-w-xl mx-auto">
              You are just four simple steps away from receiving live customer orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {STEPS.map((st, i) => (
              <div
                key={st.step}
                className="rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 space-y-4 relative flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-3xl font-black text-primary/30">{st.step}</span>
                  <h3 className="text-base font-black text-slate-900 mt-2">{st.title}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Step {i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Central Action Card */}
          <div className="rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-primary p-8 sm:p-10 text-white shadow-xl text-center space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to start growing with The Kada?</h3>
            <p className="text-sm font-medium text-indigo-100 max-w-xl mx-auto">
              Join the restaurants already running their kitchens on Kada Dine POS and our delivery network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-2xl bg-white px-8 py-3.5 text-sm font-black text-primary shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Onboarding Wizard</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={marketingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto rounded-2xl bg-white/10 border border-white/20 px-8 py-3.5 text-sm font-black text-white hover:bg-white/20 transition-all"
              >
                <span>Explore Kada Dine Features</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Partner FAQs */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Everything you need to know about partnering with The Kada Dine
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs divide-y divide-slate-100">
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

        {/* Dedicated Support Box */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Need help onboarding your restaurant?</h3>
              <p className="text-xs font-medium text-slate-500">
                Speak directly with our dedicated Merchant Onboarding Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/918078304878?text=Hi%20The%20Kada%20Onboarding%20Team,%20I%20want%20to%20register%20my%20restaurant."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="tel:+918078304878"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800 transition-colors"
            >
              Call Specialist
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
