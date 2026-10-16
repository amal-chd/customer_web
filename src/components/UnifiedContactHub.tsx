import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  CalendarClock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Globe,
  Zap,
  Utensils,
  MessageSquare,
  Headphones,
  MapPin,
  AlertCircle,
  Send,
  ChevronDown,
  MessageCircle,
  Hotel,
  ShieldCheck,
  Receipt,
  Wifi,
  Store,
  Clock,
  HelpCircle,
} from "lucide-react";

export type BrandType = "dine" | "host" | "corp" | "rider" | "customer";
export type ModeType = "demo" | "contact" | "support";

interface UnifiedContactHubProps {
  brand?: BrandType;
  initialMode?: ModeType;
  dbInstance: any; // Firestore DB from either project
  onSuccess?: () => void;
}

interface BrandConfiguration {
  name: string;
  tagline: string;
  sub: string;
  heroBadge: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  trustBadges: { icon: any; text: string; color: string }[];
  businessLabel: string;
  businessPlaceholder: string;
  businessTypeLabel: string;
  businessTypes: string[];
  scaleLabel: string;
  scaleOptions: string[];
  samplePainPoint: string;
  topics: string[];
  demoBullets: string[];
  whatsappNumber: string;
  salesPhone: string;
  escalationPhone: string;
  faqs: { q: string; a: string }[];
}

const BRAND_CONFIGS: Record<BrandType, BrandConfiguration> = {
  customer: {
    name: "The Kada",
    tagline: "Hyperlocal Food Ordering & Diner Support Desk",
    sub: "Live order assistance, real-time delivery tracking help, instant refund support, and restaurant partnership onboarding.",
    heroBadge: "🍽️ Diner & Customer Care Desk",
    heroTitlePrefix: "We're here to help make your",
    heroTitleHighlight: "dining experience delightful.",
    heroSubtitle: "Have questions about an active order, delivery ETA, refund, payment, dietary inquiry, or want to partner your kitchen? Reach our local support desk instantly.",
    trustBadges: [
      { icon: Zap, text: "Live order help (< 2 min SLA)", color: "text-amber-500" },
      { icon: ShieldCheck, text: "Instant refund & payment support", color: "text-emerald-500" },
      { icon: Utensils, text: "500+ partnered local kitchens", color: "text-blue-500" },
      { icon: Clock, text: "Dedicated support desk", color: "text-purple-500" },
    ],
    businessLabel: "Your Name / Order ID",
    businessPlaceholder: "e.g. Rahul Sharma (or Order #KD-9281)",
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
    samplePainPoint: "e.g. Rider delayed, need contactless drop-off note, refund status for cancelled dish",
    topics: [
      "Active Order ETA & Live Delivery Tracking",
      "Refund, Payment, or Wallet Credit Inquiry",
      "Missing Item or Food Quality Feedback",
      "Partner My Restaurant with The Kada",
      "Account, Login, or Profile Help",
      "General Feedback & Suggestions",
    ],
    demoBullets: [
      "Live restaurant menu setup & onboarding walkthrough",
      "How customer orders dispatch to your kitchen POS",
      "Hyperlocal rider network dispatch & live tracking",
      "Daily automated IFSC bank payouts & 0% fee promo",
    ],
    whatsappNumber: "919496491654",
    salesPhone: "+91 9496 491 654",
    escalationPhone: "+91 7736 004 362",
    faqs: [
      {
        q: "How can I track my active food order in real time?",
        a: "You can track your order live directly on the Orders tab with real-time GPS updates from kitchen preparation to rider arrival at your doorstep.",
      },
      {
        q: "What is the policy for order cancellations and refunds?",
        a: "Orders can be cancelled before the kitchen accepts and starts preparing food. In case of missing items or quality concerns, our care team provides instant resolution via The Kada Wallet or original payment method.",
      },
      {
        q: "How do I report an issue with delivered food or missing items?",
        a: "Use the 'Support Desk' tab right here or tap 'Need Help' on your order details. Select 'Missing Item or Food Quality Feedback', and our team will resolve it within 15 minutes.",
      },
      {
        q: "How do I partner my restaurant with The Kada?",
        a: "Switch to the 'Partner Restaurant' tab above or click 'Add Restaurant' in the main navigation. Complete the quick self-serve setup and get verified within 24 hours.",
      },
      {
        q: "Are bulk orders for events and family celebrations supported?",
        a: "Yes! Choose 'Corporate / Bulk Catering Inquiry' from the dropdown and our concierge desk will coordinate directly with top local restaurants for customized group packages.",
      },
    ],
  },
  dine: {
    name: "Kada Dine",
    tagline: "Restaurant POS & QR Operating System",
    sub: "Cloud POS billing, 3-second GST checkout, contactless table QR ordering, KDS & zero commissions.",
    heroBadge: "Direct Restaurant & Merchant Desk",
    heroTitlePrefix: "Let's grow your restaurant &",
    heroTitleHighlight: "take orders faster.",
    heroSubtitle: "Book a tailored 1-on-1 walkthrough of Kada Dine POS & QR, speak with our onboarding engineers, or get instant support for your food & beverage outlet.",
    trustBadges: [
      { icon: Zap, text: "2-min fast setup", color: "text-amber-500" },
      { icon: ShieldCheck, text: "0% commission on orders", color: "text-emerald-500" },
      { icon: Receipt, text: "GST & KOT compliant", color: "text-blue-500" },
      { icon: Wifi, text: "100% offline & instant QR", color: "text-purple-500" },
    ],
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
    samplePainPoint: "e.g. High aggregator commission cuts, slow cashier billing, need offline KOT printer sync",
    topics: [
      "Sales & Pricing Inquiry",
      "Hardware & Thermal Printer Compatibility",
      "Free Menu Migration Assistance",
      "Table QR Ordering & Pay-at-Table",
      "Swiggy / Zomato / ONDC Integration",
      "General Inquiry",
    ],
    demoBullets: [
      "Live bill punching & thermal KOT demo on your actual menu",
      "Contactless QR table ordering with zero app download",
      "Kitchen Display System (KDS) live ticket flow",
      "GST billing, split payment, and inventory analytics",
    ],
    whatsappNumber: "919496491654",
    salesPhone: "+91 9496 491 654",
    escalationPhone: "+91 7736 004 362",
    faqs: [
      {
        q: "Does Kada Dine really work 100% offline without internet?",
        a: "Yes! Kada Dine uses an embedded local database. If your broadband or 4G drops, you can continue punching orders, printing thermal KOTs to your kitchen, and issuing bills. It auto-syncs to the cloud the moment connectivity returns.",
      },
      {
        q: "How does 0% commission work compared to food aggregators?",
        a: "Aggregators typically take 22% to 32% on every single order. Kada Dine charges zero commission. You pay a simple, predictable flat subscription, keeping 100% of your earnings.",
      },
      {
        q: "Can you migrate our menu from Petpooja, Posist, or Excel?",
        a: "Yes, our onboarding team imports your existing menu, categories, modifiers, and GST rates for free within 4 hours. No manual re-typing required.",
      },
      {
        q: "What hardware, printers, and scanners are supported?",
        a: "Kada Dine supports standard ESC/POS USB, Bluetooth, and LAN thermal receipt printers (2-inch and 3-inch), electronic cash drawers, barcode scanners, Android POS handhelds, and any standard desktop or tablet.",
      },
      {
        q: "How fast can our outlet go live?",
        a: "Most restaurants go live within 2 hours. Our engineers guide you step-by-step or handle the entire menu setup for you.",
      },
    ],
  },
  host: {
    name: "Kada Host",
    tagline: "Hotel PMS & Guest Service Engine",
    sub: "App-less guest room QR menus, digital minibar, front desk PMS, housekeeping workflows, and direct guest dining.",
    heroBadge: "Direct Hotelier & Hospitality Desk",
    heroTitlePrefix: "Let's elevate your hotel &",
    heroTitleHighlight: "guest stay experience.",
    heroSubtitle: "Book a live 1-on-1 walkthrough of Kada Host PMS & Room QR, talk with our hospitality engineers, or get instant setup assistance for your property.",
    trustBadges: [
      { icon: Zap, text: "10-minute property rollout", color: "text-amber-500" },
      { icon: ShieldCheck, text: "0% guest surcharge", color: "text-emerald-500" },
      { icon: Receipt, text: "Room billing & Folio sync", color: "text-blue-500" },
      { icon: Wifi, text: "App-less camera QR menus", color: "text-purple-500" },
    ],
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
    samplePainPoint: "e.g. Guests not using room intercom, slow order delivery, need digital minibar & housekeeping sync",
    topics: [
      "Live PMS & Room QR Walkthrough",
      "Front Desk & Room Folio Billing Integration",
      "Room Standee & Keycard QR Setup",
      "Housekeeping & Maintenance Dispatch",
      "Pricing & Multi-Property Plans",
      "General Inquiry",
    ],
    demoBullets: [
      "Guest app-less QR camera scan directly from room standee",
      "Instant kitchen order dispatch with auto room-number tag",
      "Front desk guest check-in, keycard assignment & folio checkout",
      "Digital minibar, room service billing, and housekeeping tickets",
    ],
    whatsappNumber: "919496491654",
    salesPhone: "+91 9496 491 654",
    escalationPhone: "+91 7736 004 362",
    faqs: [
      {
        q: "Do hotel guests need to download an app or sign up to order?",
        a: "No! Guests simply open their iPhone or Android camera, point it at the in-room QR standee, and the hotel menu loads instantly in under 1 second. No login, no password, no friction.",
      },
      {
        q: "How does billing work? Can charges be added to the room folio?",
        a: "Yes. Guests can either pay instantly via UPI/Cards at the time of ordering or choose 'Charge to Room Folio' which syncs directly with front desk checkout.",
      },
      {
        q: "Can Kada Host handle room amenities, fresh towels, and housekeeping requests?",
        a: "Yes. Guests can order extra pillows, request room cleaning, or report maintenance directly through the same QR interface. Housekeeping staff receives instant notification.",
      },
      {
        q: "How long does it take to deploy Kada Host across all our rooms?",
        a: "Most properties roll out across 20–100 rooms in less than 24 hours. We generate pre-configured printable QR acrylic designs with room numbers ready for printing.",
      },
      {
        q: "Can our existing kitchen printers receive room service KOTs?",
        a: "Yes! Orders placed from guest rooms print automatically on your kitchen's ESC/POS thermal printer, clearly labeled with the guest's room number and special instructions.",
      },
    ],
  },
  corp: {
    name: "The Kada Digital Ventures",
    tagline: "Enterprise Software & Tech Solutions",
    sub: "High-performance web applications, mobile platforms, cloud systems, and specialized retail & hospitality infrastructure.",
    heroBadge: "Direct Solutions & Technology Desk",
    heroTitlePrefix: "Let's build software that",
    heroTitleHighlight: "runs your business.",
    heroSubtitle: "Talk directly with our system architects and engineers in Kannur, Kerala. Explore custom development, API integrations, or book an executive walkthrough.",
    trustBadges: [
      { icon: Zap, text: "Engineered in Kannur, Kerala", color: "text-amber-500" },
      { icon: ShieldCheck, text: "Enterprise security & SLA", color: "text-emerald-500" },
      { icon: Receipt, text: "GST & compliance built-in", color: "text-blue-500" },
      { icon: Wifi, text: "Cloud-native & offline-first", color: "text-purple-500" },
    ],
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
    samplePainPoint: "e.g. Modernizing legacy billing, multi-store inventory sync, real-time dispatch dashboard",
    topics: [
      "Custom Web & Mobile Development",
      "Kada Ecosystem Integration (Dine, Host, Rider)",
      "Cloud Infrastructure & Architecture Consulting",
      "Enterprise POS & Payment Gateway Setup",
      "Partnership & Strategic Inquiries",
      "General Consultation",
    ],
    demoBullets: [
      "Architectural walkthrough of our high-speed React & Node stack",
      "Real-time Firebase, Firestore & offline sync demonstrations",
      "Hardware integrations (thermal printers, barcode scanners, IoT)",
      "Security, multi-tenant isolation, and automated CI/CD pipeline",
    ],
    whatsappNumber: "919496491654",
    salesPhone: "+91 9496 491 654",
    escalationPhone: "+91 7736 004 362",
    faqs: [
      {
        q: "Where is The Kada Digital Ventures based?",
        a: "We are headquartered in Kannur, Kerala, India. Our core engineering, product design, and technical operations teams operate directly out of Kannur.",
      },
      {
        q: "Do you offer custom software development beyond Kada Dine and Kada Host?",
        a: "Yes. In addition to our flagship products, we build bespoke web apps, mobile apps (Flutter, React Native), ERP connectors, and specialized cloud systems for enterprise clients.",
      },
      {
        q: "Can we integrate Kada systems into our existing ERP (SAP, Tally, Zoho)?",
        a: "Absolutely. We provide REST APIs, webhooks, and automated export connectors to sync sales, GST invoices, and inventory directly into Tally, Zoho Books, or custom ERPs.",
      },
      {
        q: "What support SLA is provided for enterprise deployments?",
        a: "Enterprise clients receive dedicated Slack/WhatsApp support channels, priority response times, and optional on-site engineer deployment during major go-lives.",
      },
      {
        q: "How do we get started with a consultation?",
        a: "Submit the form above or call our solution leads directly. We schedule an initial discovery call within 24 hours to review your requirements and architecture.",
      },
    ],
  },
  rider: {
    name: "Kada Delivery",
    tagline: "Hyperlocal Delivery Fleet & Courier Operations",
    sub: "Automated dispatch, weekly payouts, 100% tip pass-through, route optimization, and dedicated rider support.",
    heroBadge: "Direct Rider & Logistics Support Desk",
    heroTitlePrefix: "Ride with pride &",
    heroTitleHighlight: "earn flexibly every day.",
    heroSubtitle: "Have questions about joining our delivery fleet, need help with active shifts, wallet payouts, or vehicle onboarding? Our team is available every day from 8:30 AM to 10:30 PM.",
    trustBadges: [
      { icon: Zap, text: "Weekly automated bank payout", color: "text-amber-500" },
      { icon: ShieldCheck, text: "100% customer tip pass-through", color: "text-emerald-500" },
      { icon: Receipt, text: "Accidental cover on active orders", color: "text-blue-500" },
      { icon: Wifi, text: "Real-time battery & GPS sync", color: "text-purple-500" },
    ],
    businessLabel: "Rider Name / Partner ID",
    businessPlaceholder: "e.g. Aneesh K. (or Partner #KD-402)",
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
    samplePainPoint: "e.g. Onboarding document verification, wallet payout query, app GPS background location help",
    topics: [
      "New Delivery Partner Registration",
      "Payout, Wallet & Bank IFSC Verification",
      "Insurance & Accidental Assistance",
      "Shift Timing & Area Allocation",
      "Rider App Troubleshooting",
      "General Fleet Support",
    ],
    demoBullets: [
      "Live order dispatch notification & route turn-by-turn demo",
      "Transparent fare calculation (base + distance + surge + tips)",
      "Instant wallet earnings & weekly auto-credit summary",
      "In-app safety emergency trigger and live support ping",
    ],
    whatsappNumber: "919496491654",
    salesPhone: "+91 9496 491 654",
    escalationPhone: "+91 7736 004 362",
    faqs: [
      {
        q: "What documents are required to join Kada Delivery as a rider partner?",
        a: "You need a valid Driving License (for motorized vehicles), Aadhaar Card, PAN Card, and a bank account in your name (or passbook copy) for weekly payouts.",
      },
      {
        q: "When and how are delivery earnings paid out?",
        a: "Earnings are calculated dynamically per delivery and credited directly to your bank account every Tuesday without fail. You can see your live balance anytime in the Kada Rider app.",
      },
      {
        q: "Can I choose my own delivery areas and shift timings?",
        a: "Yes! You have full flexibility to choose morning, evening, or weekend slots, and define your preferred primary pickup locality within the city.",
      },
      {
        q: "Does The Kada take any commission from customer tips?",
        a: "Never. 100% of all customer tips go straight to the delivery partner who completed the order, with zero deduction.",
      },
      {
        q: "How fast can I start delivering after submitting my application?",
        a: "Our fleet onboarding desk verifies documents within 2 to 4 hours. Once verified, you can collect your delivery bag and go online immediately.",
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

const DATE_OPTIONS = [
  { label: "Today", sub: "Immediate / Rush" },
  { label: "Tomorrow", sub: "Next Day" },
  { label: "This Week", sub: "Flexible Slot" },
];

export function UnifiedContactHub({
  brand = "dine",
  initialMode = "contact",
  dbInstance,
  onSuccess,
}: UnifiedContactHubProps) {
  const activeConfig = BRAND_CONFIGS[brand] || BRAND_CONFIGS.dine;

  const [mode, setMode] = useState<ModeType>(initialMode);
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [businessType, setBusinessType] = useState(activeConfig.businessTypes[0] || "");
  const [scale, setScale] = useState(activeConfig.scaleOptions[0] || "");
  const [preferredDate, setPreferredDate] = useState("Tomorrow");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[1]);
  const [topic, setTopic] = useState(activeConfig.topics[0] || "");
  const [message, setMessage] = useState("");
  const [supportPriority, setSupportPriority] = useState<"Normal" | "High" | "Urgent">("Normal");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const bName = businessName.trim();
    const cName = contactName.trim();
    const em = email.trim();
    const ph = phone.trim();
    const msg = message.trim();

    // Validation
    if (!bName) {
      setErrorMsg(`Please enter your ${activeConfig.businessLabel.toLowerCase()}.`);
      return;
    }
    if (!cName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!em || !em.includes("@") || !em.includes(".")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!ph || ph.replace(/\D/g, "").length < 7) {
      setErrorMsg("Please enter a valid phone number (at least 7 digits).");
      return;
    }

    setSubmitting(true);

    try {
      const sourceTag =
        brand === "customer"
          ? mode === "demo"
            ? "customer/partner_demo"
            : "customer/support"
          : brand === "host"
          ? mode === "demo"
            ? "kadahost/demo"
            : "kadahost/contact"
          : brand === "rider"
          ? mode === "demo"
            ? "kadarider/demo"
            : "kadarider/contact"
          : brand === "corp"
          ? mode === "demo"
            ? "thekada/demo"
            : "thekada/contact"
          : mode === "demo"
          ? "kadadine/demo"
          : "kadadine/contact";

      if (mode === "demo") {
        // Submit to demo_requests collection (mapped directly to vendor_dash Demo Requests inbox)
        const demoPayload = {
          restaurantName: bName.slice(0, 120),
          email: em.slice(0, 254),
          phone: ph.slice(0, 40),
          city: (city.trim() || "").slice(0, 80),
          outlets: scale.slice(0, 40),
          painPoint: (msg || `Requested live ${activeConfig.name} walkthrough for ${businessType} (${scale}). Preferred slot: ${preferredDate} - ${preferredTimeSlot}`).slice(0, 500),
          status: "new",
          createdAt: serverTimestamp(),
          createdAtIso: new Date().toISOString(),
          source: sourceTag,
          brand: activeConfig.name,
          contactPerson: cName || bName,
          preferredDate,
          preferredTimeSlot,
          businessType,
        };

        await addDoc(collection(dbInstance, "demo_requests"), demoPayload);
      } else {
        // Submit to contact_requests collection (mapped directly to vendor_dash Support inbox)
        const contactPayload = {
          name: (cName || bName).slice(0, 120),
          email: em.slice(0, 254),
          phone: ph.slice(0, 40),
          topic: (mode === "support" ? `Support: ${supportPriority}` : topic).slice(0, 40),
          message: (msg || `${mode === "support" ? "Support inquiry" : "General message"} for ${bName} (${activeConfig.name}). Preferred slot: ${preferredDate}.`).slice(0, 2000),
          status: "new",
          createdAt: serverTimestamp(),
          createdAtIso: new Date().toISOString(),
          source: sourceTag,
          brand: activeConfig.name,
          company: bName.slice(0, 120),
          city: (city.trim() || "").slice(0, 80),
        };

        await addDoc(collection(dbInstance, "contact_requests"), contactPayload);
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err?.message || "Failed to submit request. Please try direct call or WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Hi ${activeConfig.name} Team! I'm reaching out about ${activeConfig.name} for "${businessName || "an inquiry"}". My name is ${
        contactName || "Customer"
      } (Phone: ${phone || "N/A"}). I would like to ${
        mode === "demo" ? `book a walkthrough for ${preferredDate} (${preferredTimeSlot})` : `discuss: ${topic || "a query"}`
      }.`
    );
    return `https://wa.me/${activeConfig.whatsappNumber}?text=${text}`;
  };

  return (
    <div className="w-full text-slate-900 font-sans selection:bg-blue-600/20 selection:text-blue-700">
      {/* ─── 1. HERO HEADER ─────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-700 border border-blue-600/20 shadow-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{activeConfig.heroBadge}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
          {activeConfig.heroTitlePrefix}{" "}
          <span className="text-blue-600">
            {activeConfig.heroTitleHighlight}
          </span>
        </h1>
        <p className="mt-4 text-base sm:text-lg font-semibold text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {activeConfig.heroSubtitle}
        </p>

        {/* 4 Dedicated Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-800">
          {activeConfig.trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-2 border-slate-200/90 shadow-xs"
              >
                <Icon className={`h-4 w-4 ${badge.color}`} />
                <span className="text-slate-800 font-bold">{badge.text}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 2. DEDICATED HEADER & MODE SELECTOR ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm">
          {/* Dedicated Product Branding Indicator (No other products mentioned!) */}
          <div className="flex items-center gap-3 px-3 py-1 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-black shrink-0">
              {brand === "host" ? (
                <Hotel className="w-5 h-5 text-blue-600" />
              ) : brand === "rider" ? (
                <Zap className="w-5 h-5 text-blue-600" />
              ) : brand === "corp" ? (
                <Globe className="w-5 h-5 text-blue-600" />
              ) : brand === "customer" ? (
                <Utensils className="w-5 h-5 text-blue-600" />
              ) : (
                <Store className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                {activeConfig.name} Direct Desk
              </div>
              <div className="text-[11px] font-semibold text-slate-500">
                {activeConfig.tagline}
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode("demo");
                setSubmitted(false);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === "demo"
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <CalendarClock className="w-4 h-4 text-blue-600" />
              <span>{brand === "customer" ? "Partner Restaurant" : "Book a Demo"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("contact");
                setSubmitted(false);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === "contact"
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{brand === "customer" ? "Send Inquiry" : "Send Message"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("support");
                setSubmitted(false);
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === "support"
                  ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Headphones className="w-4 h-4 text-amber-600" />
              <span>Support Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 3. MAIN SPLIT: DIRECT CHANNELS PANEL + INTERACTIVE FORM ───────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT PANEL: Direct Action Channels & Highlights (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Spotlight Card */}
            <div className="rounded-3xl bg-slate-950 text-white p-7 sm:p-8 relative overflow-hidden shadow-2xl border border-slate-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Support desk · Daily 8:30 AM – 10:30 PM
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {activeConfig.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
                    {activeConfig.sub}
                  </p>
                </div>

                {/* Direct Helplines */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`tel:${activeConfig.salesPhone.replace(/\s+/g, "")}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/25 text-blue-400 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {brand === "customer" ? "Customer Care Line" : "Sales & Onboarding"}
                        </div>
                        <div className="text-sm font-black text-white group-hover:text-blue-300 transition-colors">
                          {activeConfig.salesPhone}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href={`tel:${activeConfig.escalationPhone.replace(/\s+/g, "")}`}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600/25 text-amber-400 flex items-center justify-center shrink-0">
                        <Headphones className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Priority Support &amp; Escalation
                        </div>
                        <div className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                          {activeConfig.escalationPhone}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/35 hover:bg-emerald-600/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                          Instant WhatsApp Direct
                        </div>
                        <div className="text-sm font-black text-white group-hover:text-emerald-200 transition-colors">
                          Chat with Support Team
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </a>
                </div>

                {/* What's Covered Box */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-200 mb-2.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>
                      {mode === "demo"
                        ? "Included in Walkthrough:"
                        : "Our Support Commitment:"}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    {activeConfig.demoBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-black">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Office & Headquarters Card */}
            <div className="p-6 rounded-3xl bg-white border-2 border-slate-200/90 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">
                    Corporate Headquarters
                  </h4>
                  <p className="text-xs font-medium text-slate-500">
                    Kannur, Kerala 670001, India
                  </p>
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operating Hours:</span>
                  <span className="font-bold text-slate-900">8:30 AM – 10:30 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Helpline:</span>
                  <span className="font-bold text-emerald-600">Priority Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Direct Email:</span>
                  <a
                    href="mailto:support@thekada.in"
                    className="font-bold text-blue-600 hover:underline"
                  >
                    support@thekada.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL: Interactive Form Card (7 cols) ── */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white p-6 sm:p-10 border-2 border-slate-200/90 shadow-xl relative text-slate-900">
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── SUBMITTED / SUCCESS STATE ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {mode === "demo" ? "Request Confirmed!" : "Message Received!"}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                        {mode === "demo"
                          ? `Our ${activeConfig.name} team has logged your walkthrough request. A specialist will call/WhatsApp you shortly to confirm your slot.`
                          : `Thank you for reaching out to ${activeConfig.name}. Our team will get back to you as soon as possible.`}
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-left text-xs space-y-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Product:</span>
                        <span className="font-black text-slate-900">{activeConfig.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Reference:</span>
                        <span className="font-black text-slate-900">{businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Contact:</span>
                        <span className="font-black text-slate-900">{contactName || phone}</span>
                      </div>
                      {mode === "demo" && (
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-bold">Slot:</span>
                          <span className="font-black text-blue-600">
                            {preferredDate} · {preferredTimeSlot.split(" ")[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Direct WhatsApp Callout */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3.5 shadow-md shadow-emerald-500/20"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send WhatsApp Ping Now</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setMessage("");
                        }}
                        className="w-full sm:w-auto text-xs font-bold text-slate-600 hover:text-slate-900 underline py-2 cursor-pointer"
                      >
                        Submit another request
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ── FORM STATE ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                    noValidate
                  >
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {mode === "demo"
                          ? brand === "customer"
                            ? "Partner Your Restaurant with The Kada"
                            : `Book a 1-on-1 ${activeConfig.name} Demo`
                          : mode === "support"
                          ? `${activeConfig.name} Priority Support Desk`
                          : `Send Message to ${activeConfig.name} Team`}
                      </h2>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                        {mode === "demo"
                          ? brand === "customer"
                            ? "Our merchant onboarding specialist will connect to help list your kitchen and setup live online ordering."
                            : "We demonstrate live on your actual menu, inventory, and format — no generic slides."
                          : "Fill in the details below and an onboarding lead will follow up shortly."}
                      </p>
                    </div>

                    {errorMsg && (
                      <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Business / Diner Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          {activeConfig.businessLabel} *
                        </label>
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder={activeConfig.businessPlaceholder}
                          className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm"
                        />
                      </div>

                      {/* Contact Name */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          Phone Number (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm"
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          City / Locality
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Kannur, Thalassery, Kozhikode"
                          className="w-full h-12 px-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          {activeConfig.businessTypeLabel}
                        </label>
                        <div className="relative">
                          <select
                            value={businessType}
                            onChange={(e) => setBusinessType(e.target.value)}
                            className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold appearance-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm cursor-pointer"
                          >
                            {activeConfig.businessTypes.map((type) => (
                              <option
                                key={type}
                                value={type}
                                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                                className="bg-white text-slate-900 font-medium py-1"
                              >
                                {type}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Scale / Frequency */}
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                          {activeConfig.scaleLabel}
                        </label>
                        <div className="relative">
                          <select
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                            className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold appearance-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm cursor-pointer"
                          >
                            {activeConfig.scaleOptions.map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                                className="bg-white text-slate-900 font-medium py-1"
                              >
                                {opt}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* DEMO-SPECIFIC: Date & Time Picker */}
                    {mode === "demo" && (
                      <div className="pt-2 border-t-2 border-slate-100 space-y-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                            Select Preferred Walkthrough Date
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {DATE_OPTIONS.map((opt) => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => setPreferredDate(opt.label)}
                                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                                  preferredDate === opt.label
                                    ? "border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-600/20"
                                    : "border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-900"
                                }`}
                              >
                                <div className="text-xs font-black text-slate-900">{opt.label}</div>
                                <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                                  {opt.sub}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                            Select Preferred Time Window
                          </label>
                          <div className="grid sm:grid-cols-3 gap-2">
                            {TIME_SLOTS.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setPreferredTimeSlot(slot)}
                                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer text-xs font-bold ${
                                  preferredTimeSlot === slot
                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm font-black"
                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONTACT & SUPPORT: Topic & Priority */}
                    {mode !== "demo" && (
                      <div className="pt-2 border-t-2 border-slate-100 grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                            Inquiry Topic
                          </label>
                          <div className="relative">
                            <select
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-bold appearance-none focus:border-blue-600 focus:outline-none transition-all text-sm cursor-pointer"
                            >
                              {activeConfig.topics.map((t) => (
                                <option
                                  key={t}
                                  value={t}
                                  style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
                                  className="bg-white text-slate-900 font-medium py-1"
                                >
                                  {t}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {mode === "support" && (
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                              Issue Severity
                            </label>
                            <div className="grid grid-cols-3 gap-2 h-12">
                              {(["Normal", "High", "Urgent"] as const).map((pri) => (
                                <button
                                  key={pri}
                                  type="button"
                                  onClick={() => setSupportPriority(pri)}
                                  className={`rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                                    supportPriority === pri
                                      ? pri === "Urgent"
                                        ? "bg-rose-600 text-white border-rose-600 font-black shadow-sm"
                                        : pri === "High"
                                        ? "bg-amber-600 text-white border-amber-600 font-black shadow-sm"
                                        : "bg-blue-600 text-white border-blue-600 font-black shadow-sm"
                                      : "border-slate-200 bg-slate-50 text-slate-700 hover:text-slate-900"
                                  }`}
                                >
                                  {pri}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes / Message */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
                        {mode === "demo" ? "Specific Details or Outlet Needs (Optional)" : "Message / Details *"}
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={
                          mode === "demo"
                            ? activeConfig.samplePainPoint
                            : "Describe your inquiry, order details, or assistance required..."
                        }
                        className="w-full p-4 rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all text-sm leading-relaxed resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Connecting Desk...</span>
                        </>
                      ) : (
                        <>
                          {mode === "demo" ? (
                            <>
                              <CalendarClock className="w-4 h-4" />
                              <span>
                                {brand === "customer"
                                  ? "Confirm Merchant Onboarding Slot"
                                  : `Confirm Live ${activeConfig.name} Demo Slot`}
                              </span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>
                                {mode === "support"
                                  ? `Submit ${activeConfig.name} Support Ticket`
                                  : `Send Message to ${activeConfig.name}`}
                              </span>
                            </>
                          )}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="text-center text-[11px] font-bold text-slate-500 flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>No spam · A real person from our team replies</span>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. DEDICATED PRODUCT FAQ SECTION ───────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-700 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Dedicated {activeConfig.name} FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Common Inquiries &amp; Help Desk
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Clear, transparent answers directly from our operations desk.
          </p>
        </div>

        <div className="space-y-3">
          {activeConfig.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border-2 border-slate-200/90 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-black text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors cursor-pointer gap-4"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
