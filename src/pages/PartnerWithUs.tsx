import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  ReceiptText,
  Bike,
  Smartphone,
  FileCheck2,
  Landmark,
  IdCard,
  MapPin,
  ChevronDown,
  MessageCircle,
  Phone,
  Check,
} from "lucide-react";
import { getVendorOnboardingUrl } from "@/lib/urls";

const PERKS = [
  {
    icon: Smartphone,
    title: "Orders on your phone",
    desc: "Accept, prepare and hand over orders from the Kada Dine app with live alerts.",
  },
  {
    icon: ChefHat,
    title: "POS & kitchen display included",
    desc: "Billing, tables, KOTs and a kitchen display — the same tools, no extra software.",
  },
  {
    icon: Bike,
    title: "Kada riders deliver",
    desc: "A rider is assigned when you accept and is tracked from your counter to the door.",
  },
  {
    icon: ReceiptText,
    title: "Clear payouts",
    desc: "Every order shows the fee and commission breakdown before it reaches your bank.",
  },
];

const STEPS = [
  { title: "Create your account", desc: "Restaurant name, phone and email." },
  { title: "Add location & hours", desc: "Pin your kitchen and set opening times." },
  { title: "Upload menu & documents", desc: "Dishes with prices, FSSAI and bank details." },
  { title: "Go live", desc: "We verify your details and switch you on." },
];

const DOCS = [
  { icon: FileCheck2, label: "FSSAI licence or registration" },
  { icon: IdCard, label: "PAN (owner or business)" },
  { icon: Landmark, label: "Bank account for payouts" },
  { icon: MapPin, label: "GSTIN, if you are registered" },
];

const FAQS = [
  {
    q: "How long does registration take?",
    a: "The online form takes about 10 minutes. After you submit your menu and documents, our onboarding team reviews them and lets you know as soon as you are live.",
  },
  {
    q: "Who delivers the orders?",
    a: "Kada riders. As soon as you accept an order a rider is assigned, and you can see them arriving in the app.",
  },
  {
    q: "Can I change my menu or pause orders?",
    a: "Yes. From the Kada Dine app or web dashboard you can edit prices, mark items out of stock, and go offline whenever you need to.",
  },
  {
    q: "What does it cost?",
    a: "Pricing is shown inside the onboarding wizard, including the commission on delivery orders, before you commit to anything.",
  },
];

const WHATSAPP =
  "https://wa.me/918078304878?text=Hi%20The%20Kada%20team%2C%20I%20want%20to%20register%20my%20restaurant.";

export default function PartnerWithUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const signupUrl = getVendorOnboardingUrl("/signup");
  const loginUrl = getVendorOnboardingUrl("/login");

  return (
    <div className="min-h-[100dvh] bg-slate-50 pb-28 md:pb-16">
      {/* Mobile top bar — the site header is desktop-only */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 py-2.5 backdrop-blur-md md:hidden">
        <Link to="/" className="flex items-center gap-2 -ml-1 rounded-xl p-1 active:bg-slate-100">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
          <img src="/logo.png" alt="The Kada" className="h-7 w-7 object-contain" />
          <span className="text-sm font-extrabold text-slate-900">For restaurants</span>
        </Link>
        <a href={loginUrl} className="rounded-full px-3 py-1.5 text-sm font-bold text-primary active:bg-primary/10">
          Log in
        </a>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1B4D] via-[#132A7A] to-primary text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-8 sm:pt-14 md:pb-20 md:text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-100 ring-1 ring-white/20">
            <Store className="h-3.5 w-3.5" /> Kada Dine partner
          </span>
          <h1 className="mt-4 text-[28px] font-extrabold leading-tight tracking-tight sm:text-5xl">
            List your restaurant on The Kada
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-blue-100 sm:text-lg md:mx-auto md:max-w-xl">
            Take delivery orders from customers nearby, with Kada riders, a POS and the Kada Dine app included.
          </p>
          <div className="mt-6 hidden gap-3 md:flex md:justify-center">
            <a
              href={signupUrl}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-base font-extrabold text-primary shadow-lg hover:bg-blue-50"
            >
              Register your restaurant <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href={loginUrl}
              className="inline-flex items-center rounded-2xl px-6 py-3.5 text-base font-bold text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              Partner log in
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-blue-100 md:justify-center">
            {["Self-serve setup", "POS included", "Kada riders"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-300" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-6 max-w-3xl space-y-4 px-4 sm:space-y-6">
        {/* What you get */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-7">
          <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">What you get</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-7">
          <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">How it works</h2>
          <ol className="mt-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex gap-4 pb-5 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span aria-hidden className="absolute left-[15px] top-9 bottom-1 w-0.5 rounded bg-primary/15" />
                )}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <p className="text-[15px] font-bold text-slate-900">{s.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Docs */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-7">
          <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">Keep these ready</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {DOCS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-800">
                <Icon className="h-5 w-5 shrink-0 text-primary" /> {label}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="rounded-3xl bg-white px-5 py-2 shadow-sm ring-1 ring-slate-200/70 sm:px-7">
          <h2 className="pb-1 pt-4 text-lg font-extrabold text-slate-900 sm:text-xl">Questions</h2>
          <div className="divide-y divide-slate-100">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-3 py-3 text-left text-[15px] font-bold text-slate-900"
                  >
                    {f.q}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  {isOpen && <p className="pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Help */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70 sm:p-7">
          <p className="text-[15px] font-bold text-slate-900">Need a hand with registration?</p>
          <p className="mt-0.5 text-sm text-slate-600">Our onboarding team can walk you through it.</p>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 active:bg-emerald-100"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href="tel:+918078304878"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-bold text-white active:bg-slate-800"
            >
              <Phone className="h-4 w-4" /> Call us
            </a>
          </div>
        </section>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pt-3 backdrop-blur-md md:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
        <a
          href={signupUrl}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-extrabold text-white shadow-lg shadow-primary/25 active:bg-primary-dark"
        >
          Register your restaurant <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
