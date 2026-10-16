import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Headphones,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import "./kada-kit.css";
import { PageHeader } from "./page";
import { ShadeStack } from "./stack";
import type { HeaderOffset } from "./shades";
import type { Tile } from "./tiles";

export type BrandType = "dine" | "host" | "corp" | "rider" | "customer";
export type ModeType = "demo" | "contact" | "support";

interface BrandConfiguration {
  /** Saved with every request; the admin inboxes group by it. */
  name: string;
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  /** Which tabs the hub offers, in order. */
  modes: ModeType[];
  /** What the "demo" tab is called for this brand. */
  demoLabel: string;
  businessLabel: string;
  businessPlaceholder: string;
  businessTypeLabel: string;
  businessTypes: string[];
  scaleLabel: string;
  scaleOptions: string[];
  samplePainPoint: string;
  topics: string[];
  faqs: { q: string; a: string }[];
}

const WHATSAPP_NUMBER = "919496491654";
const SALES_PHONE = "+91 94964 91654";
const SUPPORT_PHONE = "+91 77360 04362";
const SUPPORT_EMAIL = "support@thekada.in";
const HOURS = "Every day, 8:30 AM – 10:30 PM";

const BRAND_CONFIGS: Record<BrandType, BrandConfiguration> = {
  customer: {
    name: "The Kada",
    eyebrow: "Help & support",
    titlePrefix: "How can we",
    titleHighlight: "help you today?",
    subtitle: "Orders, refunds, payments or partnering — we're here to help.",
    modes: ["contact", "support", "demo"],
    demoLabel: "Partner with us",
    businessLabel: "Your Name / Order ID",
    businessPlaceholder: "e.g. Rahul Sharma (or Order #1016)",
    businessTypeLabel: "Inquiry Category",
    businessTypes: [
      "Active Diner (Current Order Assistance)",
      "Registered Customer (General Help)",
      "New Diner (App & Ordering Question)",
      "Restaurant Merchant (Partner With Us)",
      "Corporate / Bulk Catering Inquiry",
    ],
    scaleLabel: "Order Type / Frequency",
    scaleOptions: [
      "Single Meal / Personal Order",
      "Family / Group Order",
      "Regular Daily / Weekly Diner",
      "Bulk / Party Catering Order",
    ],
    samplePainPoint: "e.g. Rider delayed, refund status for a cancelled dish",
    topics: [
      "Order ETA & Delivery Tracking",
      "Refund, Payment or Wallet",
      "Missing Item or Food Quality",
      "Partner My Restaurant",
      "Account, Login or Profile",
      "Feedback & Suggestions",
    ],
    faqs: [
      {
        q: "How can I track my active food order?",
        a: "Open the Orders tab in the app to follow your order live, from the kitchen to your door.",
      },
      {
        q: "What is the policy for cancellations and refunds?",
        a: "You can cancel before the restaurant starts preparing your food. For missing items or quality problems, our care team refunds to your Kada wallet or your original payment method.",
      },
      {
        q: "How do I report a problem with a delivered order?",
        a: "Send us a message here with the topic 'Missing Item or Food Quality', or tap 'Need Help' on the order in the app.",
      },
      {
        q: "How do I partner my restaurant with The Kada?",
        a: "Pick 'Partner with us' above, or tap 'Add Restaurant' in the menu and complete the self-serve setup. Our team verifies your details before you go live.",
      },
      {
        q: "Do you take bulk orders for events?",
        a: "Yes. Choose 'Corporate / Bulk Catering Inquiry' in the form and our team will coordinate with local restaurants for you.",
      },
    ],
  },
  dine: {
    name: "Kada Dine",
    eyebrow: "Restaurant desk",
    titlePrefix: "Let's grow",
    titleHighlight: "your restaurant",
    subtitle: "Book a walkthrough or get help with your outlet.",
    modes: ["demo", "contact", "support"],
    demoLabel: "Book a demo",
    businessLabel: "Restaurant / Outlet Name",
    businessPlaceholder: "e.g. The Grand Biryani & Cafe",
    businessTypeLabel: "Restaurant Concept",
    businessTypes: [
      "Dine-In Restaurant",
      "Quick Service (QSR) & Fast Food",
      "Cafe, Bakery & Dessert Bar",
      "Cloud Kitchen & Multi-Brand Hub",
      "Food Court Counter & Kiosk",
      "Bar, Pub & Brewery",
    ],
    scaleLabel: "Number of Outlets",
    scaleOptions: ["Single Outlet", "2–4 Outlets", "5–10 Outlets (Chain)", "10+ Outlets (Enterprise)"],
    samplePainPoint: "e.g. Slow billing at the counter, need KOTs to print offline",
    topics: [
      "Sales & Pricing",
      "Printers & Hardware",
      "Menu Migration Help",
      "Table QR Ordering",
      "Swiggy / Zomato Orders",
      "General Inquiry",
    ],
    faqs: [
      {
        q: "Does Kada Dine work without internet?",
        a: "Yes. You can keep taking orders, printing KOTs and issuing bills when the connection drops, and everything syncs when you're back online.",
      },
      {
        q: "How does zero commission work?",
        a: "Kada Dine doesn't take a cut of your orders. You pay a flat subscription and keep what you earn.",
      },
      {
        q: "Can you move our menu from another POS or a spreadsheet?",
        a: "Yes. Our onboarding team can import your menu, categories, add-ons and GST rates for you.",
      },
      {
        q: "Which printers and devices are supported?",
        a: "Standard ESC/POS thermal printers over USB, Bluetooth or LAN (2-inch and 3-inch), cash drawers, barcode scanners, Android POS handhelds, and any desktop or tablet.",
      },
      {
        q: "How quickly can our outlet go live?",
        a: "As soon as your menu is in. Our team can walk you through setup or do it with you.",
      },
    ],
  },
  host: {
    name: "Kada Host",
    eyebrow: "Hotelier desk",
    titlePrefix: "Let's make every stay",
    titleHighlight: "easier to run",
    subtitle: "Book a walkthrough or get help with your property.",
    modes: ["demo", "contact", "support"],
    demoLabel: "Book a demo",
    businessLabel: "Hotel / Property Name",
    businessPlaceholder: "e.g. Mountain Breeze Resort & Spa",
    businessTypeLabel: "Property Type",
    businessTypes: [
      "Boutique Hotel & Suites",
      "Luxury Resort & Spa",
      "Business Hotel & Conference Center",
      "Homestay, Villa & Heritage Stay",
      "Serviced Apartments & Extended Stay",
      "Hostel, B&B & Eco Lodge",
    ],
    scaleLabel: "Total Room Keys / Inventory",
    scaleOptions: ["Up to 15 Keys", "16–50 Keys", "51–150 Keys", "150+ Keys (Multi-Property)"],
    samplePainPoint: "e.g. Room service orders are slow, need housekeeping requests in one place",
    topics: [
      "Room QR Walkthrough",
      "Front Desk & Folio Billing",
      "Room QR Standee Setup",
      "Housekeeping & Maintenance",
      "Pricing & Multi-Property",
      "General Inquiry",
    ],
    faqs: [
      {
        q: "Do guests need to download an app to order?",
        a: "No. Guests scan the QR in their room with their phone camera and the menu opens in the browser — no login needed.",
      },
      {
        q: "Can orders be charged to the room?",
        a: "Yes. Guests can pay by UPI or card when they order, or charge it to their room folio for checkout.",
      },
      {
        q: "Can guests request towels, cleaning or repairs?",
        a: "Yes. Housekeeping and maintenance requests come through the same QR, and your staff are notified straight away.",
      },
      {
        q: "How long does it take to roll out across our rooms?",
        a: "We generate a printable QR for every room number, so rollout is mostly a matter of placing them.",
      },
      {
        q: "Can our kitchen printers receive room service KOTs?",
        a: "Yes. Room orders print on your ESC/POS kitchen printer with the room number and any special instructions.",
      },
    ],
  },
  corp: {
    name: "The Kada Digital Ventures",
    eyebrow: "Contact",
    titlePrefix: "Let's build software that",
    titleHighlight: "runs your business",
    subtitle: "Talk to our engineers about your project.",
    modes: ["contact", "demo", "support"],
    demoLabel: "Book a call",
    businessLabel: "Organization / Company Name",
    businessPlaceholder: "e.g. Malabar Retail Group",
    businessTypeLabel: "Industry Domain",
    businessTypes: [
      "Retail & Multi-Store Commerce",
      "Hospitality & Tourism",
      "Healthcare & Clinics",
      "Logistics, Fleet & Supply Chain",
      "Education & Campus Management",
      "Custom Enterprise SaaS",
    ],
    scaleLabel: "Project Scope / Scale",
    scaleOptions: [
      "Startup / MVP Build",
      "Growing Business (Modernization)",
      "Multi-Branch Enterprise",
      "Custom Large-Scale Ecosystem",
    ],
    samplePainPoint: "e.g. Replace our billing system, sync stock across stores",
    topics: [
      "Custom Web & Mobile App",
      "Kada Product Integration",
      "Cloud & Architecture",
      "POS & Payment Setup",
      "Partnership Inquiry",
      "General Consultation",
    ],
    faqs: [
      {
        q: "Where is The Kada Digital Ventures based?",
        a: "We are headquartered in Kannur, Kerala, India, where our engineering and product teams work.",
      },
      {
        q: "Do you build custom software beyond the Kada products?",
        a: "Yes. We build web apps, mobile apps, ERP connectors and cloud systems for businesses of every size.",
      },
      {
        q: "Can Kada systems connect to our existing ERP or accounts software?",
        a: "Yes. We can build connectors that send sales, GST invoices and stock data to the tools you already use.",
      },
      {
        q: "What support do larger deployments get?",
        a: "A dedicated support channel, priority responses, and our engineers on hand during go-live.",
      },
      {
        q: "How do we get started?",
        a: "Send the form or call us. We'll set up a discovery call to understand what you need.",
      },
    ],
  },
  rider: {
    name: "Kada Delivery",
    eyebrow: "Rider support",
    titlePrefix: "How can we",
    titleHighlight: "help you ride?",
    subtitle: "Questions about joining, shifts or payouts? We're here to help.",
    modes: ["contact", "support"],
    demoLabel: "Book a call",
    businessLabel: "Rider Name / Partner ID",
    businessPlaceholder: "e.g. Aneesh K.",
    businessTypeLabel: "Vehicle Category",
    businessTypes: [
      "Motorcycle / Scooter (Petrol)",
      "Electric Two-Wheeler (EV)",
      "Bicycle / E-Cycle",
      "Four-Wheeler / Commercial Van",
    ],
    scaleLabel: "Availability / Shifts",
    scaleOptions: [
      "Full Time (Lunch + Dinner Shifts)",
      "Part Time (Evening / Weekend Only)",
      "Student Flexible Shifts",
      "Dedicated Fleet Partner",
    ],
    samplePainPoint: "e.g. Document verification, payout question, GPS not updating",
    topics: [
      "Joining as a Rider",
      "Payouts & Bank Details",
      "Accident or Safety Help",
      "Shifts & Delivery Areas",
      "Rider App Problem",
      "General Question",
    ],
    faqs: [
      {
        q: "What documents do I need to join?",
        a: "A driving licence (for motor vehicles), Aadhaar, PAN, and a bank account in your name for weekly payouts.",
      },
      {
        q: "When are earnings paid?",
        a: "Earnings are counted Monday to Sunday and sent to your bank every week. You can see your balance any time in the Kada Rider app.",
      },
      {
        q: "Can I choose my own areas and hours?",
        a: "Yes. Go online when it suits you and pick the area you want to deliver in.",
      },
      {
        q: "Does The Kada take a cut of customer tips?",
        a: "No. Every rupee of a tip goes to the rider who delivered the order.",
      },
      {
        q: "How soon can I start after applying?",
        a: "As soon as our team has verified your documents. You then collect your delivery kit and go online.",
      },
    ],
  },
};

const TIME_SLOTS = [
  "10:00 AM – 11:30 AM",
  "12:00 PM – 01:30 PM",
  "02:30 PM – 04:00 PM",
  "04:30 PM – 06:00 PM",
  "06:30 PM – 08:00 PM",
];

const DATE_OPTIONS = ["Today", "Tomorrow", "This Week"];

const MODE_META: Record<ModeType, { icon: ReactNode; title: string; highlight: string; subtitle: string; submit: string }> = {
  demo: {
    icon: <CalendarClock className="h-4 w-4" />,
    title: "Book a",
    highlight: "walkthrough",
    subtitle: "Pick a time and we'll show you around on a call",
    submit: "Request this slot",
  },
  contact: {
    icon: <MessageSquare className="h-4 w-4" />,
    title: "Send us a",
    highlight: "message",
    subtitle: "A real person from our team replies",
    submit: "Send message",
  },
  support: {
    icon: <Headphones className="h-4 w-4" />,
    title: "Get",
    highlight: "support",
    subtitle: "Tell us what's wrong and how urgent it is",
    submit: "Raise a support request",
  },
};

const FIELD =
  "w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-colors";
const LABEL = "block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5";

function Field({ label, htmlFor, children, wide = false }: { label: string; htmlFor?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={htmlFor} className={LABEL}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

export interface UnifiedContactHubProps {
  brand?: BrandType;
  initialMode?: ModeType;
  /** Null when the site has no Firebase config; the form then points people to phone and WhatsApp. */
  dbInstance: Firestore | null;
  onSuccess?: () => void;
  /** Height of a fixed site header the page header must clear, in px. */
  topOffset?: number;
  /** The site's sticky header height, for the stacked cards. */
  headerOffset?: HeaderOffset;
}

/**
 * The contact page of every Kada website: the site's page header, a mode
 * switch (demo / message / support), then stacked shade cards with the form,
 * the direct lines and the FAQ. Requests land in the admin inboxes
 * (demo_requests / contact_requests).
 */
export function UnifiedContactHub({
  brand = "dine",
  initialMode = "contact",
  dbInstance,
  onSuccess,
  topOffset = 0,
  headerOffset,
}: UnifiedContactHubProps) {
  const cfg = BRAND_CONFIGS[brand] || BRAND_CONFIGS.dine;

  const [mode, setMode] = useState<ModeType>(cfg.modes.includes(initialMode) ? initialMode : cfg.modes[0]);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState(cfg.businessTypes[0] || "");
  const [scale, setScale] = useState(cfg.scaleOptions[0] || "");
  const [preferredDate, setPreferredDate] = useState("Tomorrow");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[1]);
  const [topic, setTopic] = useState(cfg.topics[0] || "");
  const [message, setMessage] = useState("");
  const [supportPriority, setSupportPriority] = useState<"Normal" | "High" | "Urgent">("Normal");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const meta = MODE_META[mode];
  const modeLabel = (m: ModeType) => (m === "demo" ? cfg.demoLabel : m === "contact" ? "Message us" : "Get support");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const bName = businessName.trim();
    const cName = contactName.trim();
    const em = email.trim();
    const ph = phone.trim();
    const msg = message.trim();

    if (!bName) return setErrorMsg(`Please enter your ${cfg.businessLabel.toLowerCase()}.`);
    if (!cName) return setErrorMsg("Please enter your full name.");
    if (!em || !em.includes("@") || !em.includes(".")) return setErrorMsg("Please enter a valid email address.");
    if (!ph || ph.replace(/\D/g, "").length < 7) return setErrorMsg("Please enter a valid phone number (at least 7 digits).");
    if (mode !== "demo" && !msg) return setErrorMsg("Please tell us a little about what you need.");

    if (!dbInstance) return setErrorMsg("The form isn't available right now. Please call or WhatsApp us.");

    setSubmitting(true);
    try {
      const sourcePrefix =
        brand === "customer" ? "customer" : brand === "host" ? "kadahost" : brand === "rider" ? "kadarider" : brand === "corp" ? "thekada" : "kadadine";
      const sourceTag =
        brand === "customer" ? `customer/${mode === "demo" ? "partner_demo" : "support"}` : `${sourcePrefix}/${mode === "demo" ? "demo" : "contact"}`;

      if (mode === "demo") {
        await addDoc(collection(dbInstance, "demo_requests"), {
          restaurantName: bName.slice(0, 120),
          email: em.slice(0, 254),
          phone: ph.slice(0, 40),
          city: city.trim().slice(0, 80),
          outlets: scale.slice(0, 40),
          painPoint: (msg || `Requested live ${cfg.name} walkthrough for ${businessType} (${scale}). Preferred slot: ${preferredDate} - ${preferredTimeSlot}`).slice(0, 500),
          status: "new",
          createdAt: serverTimestamp(),
          createdAtIso: new Date().toISOString(),
          source: sourceTag,
          brand: cfg.name,
          contactPerson: cName || bName,
          preferredDate,
          preferredTimeSlot,
          businessType,
        });
      } else {
        await addDoc(collection(dbInstance, "contact_requests"), {
          name: (cName || bName).slice(0, 120),
          email: em.slice(0, 254),
          phone: ph.slice(0, 40),
          topic: (mode === "support" ? `Support: ${supportPriority}` : topic).slice(0, 40),
          message: msg.slice(0, 2000),
          status: "new",
          createdAt: serverTimestamp(),
          createdAtIso: new Date().toISOString(),
          source: sourceTag,
          brand: cfg.name,
          company: bName.slice(0, 120),
          city: city.trim().slice(0, 80),
        });
      }
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      console.error("Contact request failed:", err);
      setErrorMsg("We couldn't send that. Please try again, or call or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsAppLink = () => {
    const text = encodeURIComponent(
      `Hi ${cfg.name} team! I'm ${contactName.trim() || "getting in touch"}${businessName.trim() ? ` from ${businessName.trim()}` : ""}. ${
        mode === "demo" ? `I'd like to book a walkthrough for ${preferredDate} (${preferredTimeSlot}).` : `I have a question about ${topic || cfg.name}.`
      }`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const resetForm = () => {
    setSubmitted(false);
    setMessage("");
  };

  const channels: Tile[] = [
    { id: "sales", title: "Call sales", desc: SALES_PHONE, icon: <Phone />, to: `tel:${SALES_PHONE.replace(/\s/g, "")}` },
    { id: "support", title: "Priority support", desc: SUPPORT_PHONE, icon: <Headphones />, to: `tel:${SUPPORT_PHONE.replace(/\s/g, "")}` },
    { id: "whatsapp", title: "WhatsApp", desc: "Chat with our team", icon: <MessageCircle />, to: `https://wa.me/${WHATSAPP_NUMBER}` },
    { id: "email", title: "Email", desc: SUPPORT_EMAIL, icon: <Mail />, to: `mailto:${SUPPORT_EMAIL}` },
  ];

  const form = (
    <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-5 sm:p-8 text-slate-900 shadow-2xl shadow-blue-950/30 ring-1 ring-black/5">
      {submitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">{mode === "demo" ? "Request received" : "Message received"}</h3>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {mode === "demo"
                ? `We'll confirm your ${preferredDate.toLowerCase()} slot (${preferredTimeSlot}) on ${email.trim()}.`
                : `Our team will reply to ${email.trim()} soon.`}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <a
              href={whatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" /> Follow up on WhatsApp
            </a>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Send another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={`${cfg.businessLabel} *`} htmlFor="kch-business">
              <input id="kch-business" className={FIELD} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={cfg.businessPlaceholder} autoComplete="organization" />
            </Field>
            <Field label="Your full name *" htmlFor="kch-name">
              <input id="kch-name" className={FIELD} value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Rahul Sharma" autoComplete="name" />
            </Field>
            <Field label="Phone (WhatsApp) *" htmlFor="kch-phone">
              <input id="kch-phone" type="tel" inputMode="tel" className={FIELD} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
            </Field>
            <Field label="Email *" htmlFor="kch-email">
              <input id="kch-email" type="email" inputMode="email" className={FIELD} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" />
            </Field>
            <Field label="City" htmlFor="kch-city">
              <input id="kch-city" className={FIELD} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Kannur, Kochi, Kozhikode" autoComplete="address-level2" />
            </Field>
            <Field label={cfg.businessTypeLabel} htmlFor="kch-type">
              <div className="relative">
                <select id="kch-type" className={`${FIELD} appearance-none pr-9`} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                  {cfg.businessTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
            <Field label={cfg.scaleLabel} htmlFor="kch-scale" wide>
              <div className="relative">
                <select id="kch-scale" className={`${FIELD} appearance-none pr-9`} value={scale} onChange={(e) => setScale(e.target.value)}>
                  {cfg.scaleOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
          </div>

          {mode === "demo" ? (
            <div className="space-y-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              <div>
                <span className={LABEL}>Preferred day</span>
                <div className="flex flex-wrap gap-2">
                  {DATE_OPTIONS.map((d) => (
                    <Choice key={d} active={preferredDate === d} onClick={() => setPreferredDate(d)}>
                      {d}
                    </Choice>
                  ))}
                </div>
              </div>
              <div>
                <span className={LABEL}>Preferred time (IST)</span>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((t) => (
                    <Choice key={t} active={preferredTimeSlot === t} onClick={() => setPreferredTimeSlot(t)}>
                      {t}
                    </Choice>
                  ))}
                </div>
              </div>
            </div>
          ) : mode === "contact" ? (
            <Field label="Topic" htmlFor="kch-topic">
              <div className="relative">
                <select id="kch-topic" className={`${FIELD} appearance-none pr-9`} value={topic} onChange={(e) => setTopic(e.target.value)}>
                  {cfg.topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </Field>
          ) : (
            <div>
              <span className={LABEL}>How urgent is it?</span>
              <div className="flex flex-wrap gap-2">
                {(["Normal", "High", "Urgent"] as const).map((p) => (
                  <Choice key={p} active={supportPriority === p} onClick={() => setSupportPriority(p)}>
                    {p}
                  </Choice>
                ))}
              </div>
            </div>
          )}

          <Field label={mode === "demo" ? "Anything we should know? (optional)" : "How can we help? *"} htmlFor="kch-message">
            <textarea
              id="kch-message"
              rows={4}
              className={`${FIELD} h-auto py-3 resize-y min-h-[110px]`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={cfg.samplePainPoint}
            />
          </Field>

          {errorMsg && (
            <div role="alert" className="flex items-start gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-70 transition-all"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{meta.submit} <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-center text-[11px] font-semibold text-slate-400">No spam — a real person from our team replies.</p>
        </form>
      )}
    </div>
  );

  const faq = (
    <div className="mx-auto w-full max-w-2xl space-y-2.5">
      {cfg.faqs.map((f, i) => (
        <details
          key={f.q}
          open={i === 0}
          className="group rounded-2xl bg-white/95 ring-1 ring-black/5 shadow-[0_6px_20px_rgba(2,132,199,0.08)] open:bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm sm:text-base font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-blue-600 transition-transform group-open:rotate-180" />
          </summary>
          <p className="px-4 pb-4 -mt-1 text-sm font-medium leading-relaxed text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-slate-50 font-sans">
      <PageHeader
        topOffset={topOffset}
        eyebrow={cfg.eyebrow}
        title={
          <>
            {cfg.titlePrefix} <span className="text-blue-600">{cfg.titleHighlight}</span>
          </>
        }
        subtitle={cfg.subtitle}
      />

      {/* Mode switch, styled like the pricing pages' billing toggle. */}
      <div className="flex justify-center bg-slate-50 px-4 pb-8">
        <div
          role="tablist"
          aria-label="How would you like to reach us?"
          className="grid w-full max-w-md gap-1 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm"
          style={{ gridTemplateColumns: `repeat(${cfg.modes.length}, minmax(0, 1fr))` }}
        >
          {cfg.modes.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setSubmitted(false);
                setErrorMsg(null);
              }}
              className={`inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 sm:px-4 py-2 text-[13px] sm:text-sm font-bold transition-colors [&>svg]:hidden sm:[&>svg]:block ${
                mode === m ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {MODE_META[m].icon}
              {modeLabel(m)}
            </button>
          ))}
        </div>
      </div>

      <ShadeStack
        headerOffset={headerOffset}
        cards={[
          { id: "contact-form", title: meta.title, highlight: meta.highlight, subtitle: meta.subtitle, children: form, pin: false },
          {
            title: "Or reach us",
            highlight: "directly",
            subtitle: (
              <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                <span>{HOURS}</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Kannur, Kerala
                </span>
              </span>
            ),
            tiles: channels,
          },
          { title: "Common", highlight: "questions", children: faq },
        ]}
      />
    </div>
  );
}
