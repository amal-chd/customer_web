import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldCheck,
  Download,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  Globe,
  Building2,
  Users,
  Award,
  Leaf,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  HelpCircle,
  Clock,
  Briefcase,
  Share2,
  Lock,
  Compass,
  Cpu,
  Bike
} from "lucide-react";
import { toast } from "@/components/Toast";

// --- TYPES & DATA ---
interface FinancialQuarter {
  period: string;
  gmv: string;
  revenue: string;
  takeRate: string;
  contributionMargin: string;
  ebitda: string;
  orders: string;
}

const FY26_FINANCIALS: FinancialQuarter[] = [
  { period: "Q4 FY26 (E)", gmv: "₹48.2 Cr", revenue: "₹9.8 Cr", takeRate: "20.3%", contributionMargin: "+₹19.2", ebitda: "+2.4%", orders: "254,000" },
  { period: "Q3 FY26", gmv: "₹45.1 Cr", revenue: "₹9.1 Cr", takeRate: "20.1%", contributionMargin: "+₹18.8", ebitda: "+1.8%", orders: "238,000" },
  { period: "Q2 FY26", gmv: "₹41.8 Cr", revenue: "₹8.3 Cr", takeRate: "19.8%", contributionMargin: "+₹18.1", ebitda: "+0.9%", orders: "212,000" },
  { period: "Q1 FY26", gmv: "₹37.5 Cr", revenue: "₹7.4 Cr", takeRate: "19.7%", contributionMargin: "+₹17.4", ebitda: "-0.4%", orders: "186,000" },
];

const FY25_FINANCIALS: FinancialQuarter[] = [
  { period: "Q4 FY25", gmv: "₹28.4 Cr", revenue: "₹5.4 Cr", takeRate: "19.0%", contributionMargin: "+₹14.2", ebitda: "-3.1%", orders: "148,000" },
  { period: "Q3 FY25", gmv: "₹22.6 Cr", revenue: "₹4.2 Cr", takeRate: "18.6%", contributionMargin: "+₹12.1", ebitda: "-5.8%", orders: "121,000" },
  { period: "Q2 FY25", gmv: "₹18.1 Cr", revenue: "₹3.3 Cr", takeRate: "18.2%", contributionMargin: "+₹9.8", ebitda: "-8.4%", orders: "97,000" },
  { period: "Q1 FY25", gmv: "₹14.2 Cr", revenue: "₹2.5 Cr", takeRate: "17.6%", contributionMargin: "+₹6.5", ebitda: "-12.2%", orders: "76,000" },
];

interface ReportDoc {
  id: string;
  title: string;
  category: "Quarterly" | "Annual" | "Presentation" | "ESG" | "Governance";
  date: string;
  size: string;
  description: string;
  highlights: string[];
}

const REPORT_DOCS: ReportDoc[] = [
  {
    id: "q4-fy26-shareholder",
    title: "Q4 FY26 Shareholder Letter & Operational Update",
    category: "Quarterly",
    date: "April 2026",
    size: "2.8 MB",
    description: "Detailed management commentary on GMV growth, contribution profit expansion, and merchant POS software adoption.",
    highlights: ["GMV reached ₹48.2 Cr in Q4, up 69.7% YoY", "Contribution margin expanded to +₹19.2 per order", "Merchant POS churn decreased to <0.6% monthly"]
  },
  {
    id: "q4-fy26-presentation",
    title: "Q4 FY26 Investor & Analyst Presentation",
    category: "Presentation",
    date: "April 2026",
    size: "6.4 MB",
    description: "Comprehensive slide deck covering unit economics, consumer cohort retention, and Tier-2 market penetration dynamics.",
    highlights: ["Cohort retention year-1 exceeds 68%", "Hyperlocal delivery speed averaged 31.8 minutes", "EV fleet share reached 42% in core clusters"]
  },
  {
    id: "q3-fy26-report",
    title: "Q3 FY26 Interim Financial Disclosures",
    category: "Quarterly",
    date: "January 2026",
    size: "3.1 MB",
    description: "Unaudited quarterly financial statements, segmental reporting, and balance sheet metrics.",
    highlights: ["Net Revenue grew 116% YoY to ₹9.1 Cr", "Operating cash flow turned sustainably positive", "1,150+ merchant partner threshold crossed"]
  },
  {
    id: "fy25-annual-report",
    title: "FY25 Integrated Annual Report",
    category: "Annual",
    date: "July 2025",
    size: "14.2 MB",
    description: "Full audited financial statements, board report, governance disclosures, and strategic long-term roadmap.",
    highlights: ["Audited by top-tier statutory auditors", "Full-year GMV of ₹83.3 Cr", "Zero debt capital structure maintained"]
  },
  {
    id: "esg-report-2026",
    title: "2026 ESG & Sustainable Commerce Report",
    category: "ESG",
    date: "March 2026",
    size: "4.5 MB",
    description: "Progress on fleet electrification, plastic reduction, fair gig partner welfare, and local culinary preservation.",
    highlights: ["1.85M plastic utensil sets avoided", "100% rider accident & family medical coverage", "Over 68% partner kitchens are local independent businesses"]
  },
  {
    id: "governance-charter",
    title: "Corporate Governance & Ethics Charter",
    category: "Governance",
    date: "Updated 2026",
    size: "1.6 MB",
    description: "Board committee mandates, code of business conduct, whistleblower framework, and data integrity protocols.",
    highlights: ["50% independent board representation", "Formal Audit, Risk & ESG committees", "Strict DPDP Act compliant consumer privacy"]
  }
];

const PRESS_RELEASES = [
  {
    id: "pr-1",
    date: "March 28, 2026",
    category: "Expansion",
    title: "The Kada Expands Hyperlocal Network Across Northern Kerala with 250 New Merchant Partners",
    summary: "Strategic cluster rollout increases merchant density and reduces average delivery SLA to 29 minutes across Kannur, Thalassery, and Payyanur."
  },
  {
    id: "pr-2",
    date: "February 14, 2026",
    category: "Financial",
    title: "The Kada Surpasses ₹180 Crore Annualized GMV Run-Rate with Sustainable Contribution Profitability",
    summary: "Strong operating leverage, high repeat user cohorts, and merchant SaaS monetization propel platform unit economics ahead of projected targets."
  },
  {
    id: "pr-3",
    date: "January 19, 2026",
    category: "Technology",
    title: "Kada Dine Unveils Next-Gen AI Kitchen Display System (KDS) with Automated Prep Forecasting",
    summary: "Proprietary predictive kitchen software decreases order turnaround time by 22% and reduces customer wait times across peak dining hours."
  },
  {
    id: "pr-4",
    date: "November 30, 2025",
    category: "Sustainability",
    title: "The Kada Achieves 40% EV Delivery Fleet Milestone in Collaboration with Leading Clean Mobility Partners",
    summary: "Zero-emission deliveries now cover over 350,000 orders, significantly reducing per-kilometer delivery carbon footprint."
  }
];

const FAQS = [
  {
    q: "What is The Kada's primary business model and revenue structure?",
    a: "The Kada operates a synergistic dual-engine model: (1) Hyperlocal Consumer Marketplace taking a commission on delivered food and grocery orders along with delivery fees and platform fees, and (2) Kada Dine B2B Merchant SaaS, which provides cloud POS, digital QR menus, and kitchen display systems (KDS) to restaurants on monthly and transaction-linked subscription plans. This creates unmatched merchant lock-in and zero customer acquisition friction for delivery menus."
  },
  {
    q: "How does The Kada achieve positive unit economics in Tier-2/Tier-3 markets where others struggle?",
    a: "Unlike metro-first food delivery companies that burn immense capital on customer discounts and exorbitant rider incentives, The Kada focuses on hyper-dense regional clusters. Our merchant density allows riders to complete 3.4+ deliveries per active hour with average distances under 3.2 km. Furthermore, our integrated Kada Dine POS captures 100% accurate live kitchen inventory, eliminating costly cancelled orders and phantom restaurant listings."
  },
  {
    q: "What is the capital structure and funding background of The Kada?",
    a: "The Kada is a high-growth, capital-efficient private technology company backed by visionary early-stage investors, operators, and strategic industry leaders. The company maintains a lean, debt-free balance sheet with an emphasis on disciplined capital allocation and positive free cash flow generation."
  },
  {
    q: "When does The Kada's financial year end, and how frequently are investor reports published?",
    a: "The Kada follows the April 1 to March 31 Indian financial year calendar. We publish quarterly shareholder letters, operational metric disclosures, and financial decks within 45 days of quarter close, supplemented by our audited integrated annual report."
  },
  {
    q: "How can institutional investors and research analysts engage with the management team?",
    a: "Our Investor Relations desk hosts quarterly investor briefings and participates in major tech and consumer internet conferences. Institutional investors can request private management meetings, cluster field visits, or dataset reviews by emailing ir@thekada.in."
  }
];

export default function InvestorRelations() {
  const [selectedFy, setSelectedFy] = useState<"FY26" | "FY25">("FY26");
  const [activeTab, setActiveTab] = useState<"all" | "Quarterly" | "Presentation" | "Annual" | "ESG">("all");
  const [selectedDoc, setSelectedDoc] = useState<ReportDoc | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [emailInput, setEmailInput] = useState("");
  const [investorType, setInvestorType] = useState("Institutional Investor");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Trigger real downloadable document simulation
  const handleDownload = (doc: ReportDoc) => {
    const documentContent = `======================================================
THE KADA (KADADINE HYPERLOCAL COMMERCE PRIVATE LIMITED)
INVESTOR RELATIONS OFFICIAL REPORT
======================================================
DOCUMENT: ${doc.title}
CATEGORY: ${doc.category}
RELEASE DATE: ${doc.date}
DOCUMENT ID: ${doc.id}

EXECUTIVE SUMMARY:
${doc.description}

KEY PERFORMANCE HIGHLIGHTS:
${doc.highlights.map((h, i) => `  ${i + 1}. ${h}`).join("\n")}

PLATFORM TRACTION OVERVIEW (ANNUALIZED):
- Gross Merchandise Value (GMV): ₹180 Cr+ Run Rate
- Completed Deliveries: 850,000+
- Active Merchant & Kitchen Partners: 1,200+
- Contribution Margin per Order: +₹18.4
- On-Time Fulfillment SLA: 99.4%

INVESTOR CONTACT DESK:
Email: ir@thekada.in
Compliance: compliance@thekada.in
HQ: The Kada Hub, Kannur, Kerala 670001, India

CONFIDENTIALITY & REGULATORY NOTICE:
This material is provided for informational purposes only and does not constitute an offer to buy or sell securities.
Copyright © 2026 The Kada Ltd. All rights reserved.
======================================================`;

    const blob = new Blob([documentContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast(`Downloaded: ${doc.title}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast("Please provide a valid investor email address.");
      return;
    }
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setEmailInput("");
      toast("Subscribed! You will receive all IR filings and quarterly decks directly.");
    }, 800);
  };

  const financials = selectedFy === "FY26" ? FY26_FINANCIALS : FY25_FINANCIALS;
  const filteredDocs = activeTab === "all" ? REPORT_DOCS : REPORT_DOCS.filter(d => d.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Stock/Performance Ticker Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-slate-300 py-2.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">THE KADA INVESTOR PORTAL</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Private Tech Holding • Hyperlocal Commerce & Merchant SaaS</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>GMV Run Rate: ₹180 Cr+ (+142% YoY)</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <span>Orders: 850k+</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-blue-400">
              <span>Contribution: +₹18.4/order</span>
            </span>
          </div>
        </div>
      </div>

      {/* Sub-navigation Anchor Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto py-3 gap-6 scrollbar-none text-xs sm:text-sm font-bold text-slate-600">
          <div className="flex items-center gap-6 shrink-0">
            <a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#metrics" className="hover:text-blue-600 transition-colors">Key Metrics</a>
            <a href="#financials" className="hover:text-blue-600 transition-colors">Financial Results</a>
            <a href="#flywheel" className="hover:text-blue-600 transition-colors">Ecosystem Flywheel</a>
            <a href="#governance" className="hover:text-blue-600 transition-colors">Governance</a>
            <a href="#esg" className="hover:text-blue-600 transition-colors">ESG & Impact</a>
            <a href="#news" className="hover:text-blue-600 transition-colors">Announcements</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQs</a>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <a
              href="#subscribe"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-all"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>IR Alerts</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold transition-all"
            >
              <span>Contact IR</span>
            </a>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="overview" className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white pt-16 pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 border border-blue-400/30 px-3.5 py-1.5 text-xs font-bold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Investor Relations & Shareholder Portal</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Investing in the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Hyperlocal Commerce</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
              The Kada connects hundreds of thousands of daily consumers with regional restaurants, grocery merchants, and dining services through proprietary restaurant software and rapid fulfillment logistics.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleDownload(REPORT_DOCS[0])}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="h-4 w-4" />
                <span>Latest Earnings Deck (Q4 FY26)</span>
              </button>
              <a
                href="#financials"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all"
              >
                <BarChart3 className="h-4 w-4 text-blue-300" />
                <span>View Quarterly Results</span>
              </a>
            </div>
          </div>

          {/* KPI HIGHLIGHT CARDS */}
          <div id="metrics" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
            {[
              { label: "Annualized GMV", value: "₹180 Cr+", change: "+142% YoY", sub: "Platform Run-Rate" },
              { label: "Completed Orders", value: "850,000+", change: "+168% YoY", sub: "Cumulative Fulfilled" },
              { label: "Merchant Partners", value: "1,200+", change: "+115% YoY", sub: "Restaurants & Stores" },
              { label: "Avg Delivery SLA", value: "31.8 min", change: "-4.2 min YoY", sub: "Hyperlocal Speed" },
              { label: "Unit Economics", value: "+₹18.4", change: "+180 bps", sub: "Per-Order Contribution" },
              { label: "SLA Fulfillment", value: "99.4%", change: "+40 bps", sub: "Order Success Rate" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-2xl bg-white/[0.07] border border-white/10 p-5 backdrop-blur-md flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                </div>
                <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-400">{stat.change}</span>
                  <span className="text-slate-400 font-medium">{stat.sub}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FLYWHEEL SECTION */}
      <section id="flywheel" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Layers className="h-3.5 w-3.5" />
            <span>The Kada Flywheel & Competitive Moat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            An Integrated Ecosystem Built for High Retention
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Unlike single-purpose delivery apps, The Kada combines consumer demand with mission-critical B2B merchant software, delivering lower customer acquisition cost and superior merchant retention.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Bike,
              title: "The Kada Food",
              subtitle: "High-Frequency Consumer Touchpoint",
              desc: "Hyperlocal on-demand delivery with an average of 3.8 orders per active user per month. Acts as the primary low-CAC consumer entry point.",
              stats: "74% repeat rate in 90 days",
              badge: "Consumer Engine"
            },
            {
              icon: Cpu,
              title: "Kada Dine (POS & KDS)",
              subtitle: "Mission-Critical Merchant SaaS",
              desc: "Integrated restaurant POS, Kitchen Display System (KDS), and QR table ordering. Locks in exclusive supply and eliminates order cancellation errors.",
              stats: "99.4% monthly merchant retention",
              badge: "B2B Supply Lock-In"
            },
            {
              icon: Layers,
              title: "Instamart & Grocery",
              subtitle: "High Basket Size Expansion",
              desc: "Rapid delivery of daily groceries, fresh produce, and essentials. Maximizes rider fleet density and order batching efficiency during off-peak meal hours.",
              stats: "₹680+ Average Basket Size",
              badge: "Density Booster"
            },
            {
              icon: Building2,
              title: "Kada Stays & Living",
              subtitle: "Recurring Community Ecosystem",
              desc: "Integration with student residences, serviced accommodations, and host facilities providing steady daily meal subscriptions and high LTV consumers.",
              stats: "Long-term subscription cohort",
              badge: "High LTV Anchor"
            }
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{item.subtitle}</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Traction Metric:</span>
                <span className="font-bold text-slate-900">{item.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINANCIAL PERFORMANCE & QUARTERLY RESULTS */}
      <section id="financials" className="py-20 bg-slate-100/70 border-y border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-blue-800">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Financial Performance & Disclosures</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Quarterly Financial Highlights
              </h2>
              <p className="text-sm text-slate-600 font-medium max-w-xl">
                Disciplined capital allocation with accelerating revenue growth, expanding take rates, and positive contribution margin profile.
              </p>
            </div>

            {/* Fiscal Year Toggle */}
            <div className="inline-flex items-center rounded-xl bg-white p-1.5 border border-slate-200 shadow-xs">
              <button
                onClick={() => setSelectedFy("FY26")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedFy === "FY26" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                FY 2025 - 2026
              </button>
              <button
                onClick={() => setSelectedFy("FY25")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedFy === "FY25" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                FY 2024 - 2025
              </button>
            </div>
          </div>

          {/* Interactive Financial Table */}
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Segmental Financial Summary ({selectedFy})</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Amounts presented in Indian Rupees (INR) with IFRS and Ind AS standard reconciliation.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                EBITDA Profitable Trajectory
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-6">Quarterly Period</th>
                    <th className="py-3.5 px-6">Gross Merch. Value (GMV)</th>
                    <th className="py-3.5 px-6">Net Platform Revenue</th>
                    <th className="py-3.5 px-6">Take Rate (%)</th>
                    <th className="py-3.5 px-6">Contribution Margin</th>
                    <th className="py-3.5 px-6">Adj. EBITDA %</th>
                    <th className="py-3.5 px-6">Delivered Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {financials.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{row.period}</td>
                      <td className="py-4 px-6 font-bold text-blue-600">{row.gmv}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{row.revenue}</td>
                      <td className="py-4 px-6">{row.takeRate}</td>
                      <td className="py-4 px-6 font-bold text-emerald-600">{row.contributionMargin}</td>
                      <td className="py-4 px-6">
                        <span className={`font-bold ${row.ebitda.startsWith("+") ? "text-emerald-600" : "text-amber-600"}`}>
                          {row.ebitda}
                        </span>
                      </td>
                      <td className="py-4 px-6">{row.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
              <span>* Q4 FY26 represents preliminary estimated figures subject to final statutory audit closure.</span>
              <a href="#reports" className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <span>View Full Audit Statements Below</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* REPORTS & PRESENTATIONS DOWNLOAD HUB */}
          <div id="reports" className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Reports, Decks & Presentations</h3>
                <p className="text-xs text-slate-500 font-medium">Download statutory filings, earnings presentations, and governance charters.</p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "Quarterly", "Presentation", "Annual", "ESG"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    {tab === "all" ? "All Documents" : tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                        {doc.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{doc.date}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{doc.title}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-2">
                        {doc.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      {doc.highlights.slice(0, 2).map((h, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      View Executive Summary
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{doc.size}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CORPORATE GOVERNANCE & BOARD */}
      <section id="governance" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Corporate Governance & Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Fiduciary Responsibility & Strong Oversight
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            We hold ourselves to institutional standards of integrity, transparency, and data privacy to protect long-term shareholder value and customer trust.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Board Oversight & Committees</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              50% independent directors across Audit, Stakeholder Relationship, and Nomination & Remuneration Committees ensuring robust risk governance.
            </p>
            <ul className="text-xs space-y-2 text-slate-500 font-semibold pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Audit & Risk Committee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Nomination & Remuneration</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>ESG & Ethics Council</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Data Privacy & Security</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Strict compliance with India’s Digital Personal Data Protection (DPDP) Act, end-to-end payment encryption, and zero monetization of customer personal data.
            </p>
            <ul className="text-xs space-y-2 text-slate-500 font-semibold pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>PCI-DSS Level 1 Payment Gateway</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Encrypted Delivery Telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero-Trust Architecture</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Statutory Audit & Integrity</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Accounts prepared in accordance with applicable accounting standards and reviewed by independent statutory auditors with clean audit opinions.
            </p>
            <ul className="text-xs space-y-2 text-slate-500 font-semibold pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Independent Statutory Audit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Secretarial Compliance Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Whistleblower Protection Policy</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ESG & SUSTAINABLE COMMERCE */}
      <section id="esg" className="py-20 bg-slate-900 text-white px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 text-xs font-bold text-emerald-300">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" />
              <span>ESG & Sustainable Hyperlocal Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Building a Sustainable, Inclusive Commerce Engine
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium">
              We balance rapid growth with community upliftment, driver partner security, and proactive environmental stewardship.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                metric: "42%",
                title: "EV Fleet Transition",
                desc: "Over 40% of deliveries in key clusters are conducted via electric two-wheelers, lowering fuel emissions and driver expenses."
              },
              {
                metric: "1.85M+",
                title: "Cutlery Sets Saved",
                desc: "Default 'No Cutlery' checkout switch avoided over 1.85 million disposable single-use plastic cutlery packages."
              },
              {
                metric: "100%",
                title: "Rider Family Cover",
                desc: "All active delivery fleet partners have comprehensive accident insurance and emergency medical hospital coverage."
              },
              {
                metric: "68%",
                title: "Local Kitchen Partners",
                desc: "Majority of merchant kitchens are local family-run eateries digitized without exorbitant 30% aggregator margins."
              }
            ].map((esg) => (
              <div key={esg.title} className="rounded-3xl bg-white/[0.06] border border-white/10 p-6 backdrop-blur-md space-y-3">
                <p className="text-3xl font-black text-emerald-400">{esg.metric}</p>
                <h4 className="text-base font-bold text-white">{esg.title}</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{esg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS RELEASES & ANNOUNCEMENTS */}
      <section id="news" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              <Globe className="h-3.5 w-3.5" />
              <span>Newsroom & Regulatory Filings</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Press Releases & Corporate Updates
            </h2>
          </div>
          <a
            href="#subscribe"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Subscribe to Press Releases</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PRESS_RELEASES.map((pr) => (
            <div
              key={pr.id}
              className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {pr.category}
                  </span>
                  <span className="text-slate-400 font-medium">{pr.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{pr.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{pr.summary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Kannur, Kerala</span>
                <button
                  onClick={() => {
                    toast(`Full press release: "${pr.title}" archived in media kit.`);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHAREHOLDER FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-100/70 border-t border-slate-200/80 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-blue-800">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Shareholder Queries</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Frequently Asked Investor Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-blue-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5 text-blue-600 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IR EMAIL ALERTS & SUBSCRIPTION FORM */}
      <section id="subscribe" className="py-20 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-1 text-xs font-bold text-blue-300">
            <Mail className="h-3.5 w-3.5" />
            <span>Stay Informed</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Subscribe to Investor Relations Alerts
            </h2>
            <p className="text-sm text-slate-300 font-medium max-w-xl mx-auto">
              Receive automated email notifications for quarterly earnings releases, shareholder letters, regulatory filings, and webcast recordings.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-4 text-left">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Work / Investor Email
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="analyst@fund.com"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Stakeholder Category
                </label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                >
                  <option value="Institutional Investor">Institutional Investor / VC / PE</option>
                  <option value="Equity Research Analyst">Equity Research Analyst</option>
                  <option value="Individual Shareholder">Individual / Retail Investor</option>
                  <option value="Press / Media">Financial Media & Journalist</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubscribing}
              className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubscribing ? (
                <span>Registering Subscription...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Subscribe to IR Email Bulletins</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center font-medium">
              We respect your privacy. Unsubscribe at any time with a single click.
            </p>
          </form>
        </div>
      </section>

      {/* DEDICATED IR CONTACT DESK */}
      <section id="contact" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            <Building2 className="h-3.5 w-3.5" />
            <span>Direct Access</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Investor Relations Contact Desk
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Get in touch with our leadership, secretarial desk, or transfer agent.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Institutional & Analyst Inquiries</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For earnings call invites, financial models, and executive briefings.
              </p>
            </div>
            <div className="pt-2">
              <a href="mailto:ir@thekada.in" className="text-sm font-bold text-blue-600 hover:underline">
                ir@thekada.in
              </a>
              <p className="text-xs text-slate-400 mt-1">Response within 24 business hours</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Secretarial & Compliance Desk</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                For statutory filings, board resolutions, and legal disclosures.
              </p>
            </div>
            <div className="pt-2">
              <a href="mailto:compliance@thekada.in" className="text-sm font-bold text-blue-600 hover:underline">
                compliance@thekada.in
              </a>
              <p className="text-xs text-slate-400 mt-1">Company Secretary Desk</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200/80 p-7 shadow-xs space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Corporate Office</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                The Kada Enterprise HQ, Kannur, Kerala 670001, India.
              </p>
            </div>
            <div className="pt-2 text-xs text-slate-600 font-medium">
              <p>Telephone: +91 94964 91654</p>
              <p className="text-slate-400 mt-1">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXECUTIVE SUMMARY MODAL */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                    {selectedDoc.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">{selectedDoc.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedDoc.date} • {selectedDoc.size}</p>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                <p>{selectedDoc.description}</p>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Executive Highlights:</p>
                  <ul className="space-y-1.5">
                    {selectedDoc.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedDoc);
                    setSelectedDoc(null);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
