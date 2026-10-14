import { Link } from "react-router-dom";
import {
  Sparkles,
  ChefHat,
  Store,
  Bike,
  ShieldCheck,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
  Building,
  HeartHandshake
} from "lucide-react";
import { getVendorOnboardingUrl } from "@/lib/urls";

export default function InvestorRelations() {
  const vendorSignupUrl = getVendorOnboardingUrl("/signup");

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Header / Intro */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Investor Relations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-ink">
            The Kada for Investors
          </h1>
          <p className="text-base sm:text-lg font-medium text-sub max-w-2xl mx-auto leading-relaxed">
            Pioneering the next generation of sustainable hyperlocal commerce, restaurant POS software, and fast neighborhood logistics across South India.
          </p>
        </div>

        {/* Core Vision & Business Model Card */}
        <div className="card p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-black text-ink">Our Mission & Investment Thesis</h2>
          <p className="text-sm sm:text-base font-semibold text-sub leading-relaxed">
            The Kada started with a simple belief: local restaurants and neighborhood merchants deserve world-class digital technology without paying predatory 30% aggregator commissions, while consumers deserve transparent, high-speed delivery with real kitchen updates.
          </p>
          <p className="text-sm sm:text-base font-semibold text-sub leading-relaxed">
            By marrying consumer on-demand ordering with our proprietary merchant POS and Kitchen Display System (Kada Dine), we solve the root operational issues that cause food delivery losses: high merchant churn, order prep errors, and phantom restaurant listings.
          </p>
        </div>

        {/* Key Operational Metrics */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
          {[
            { label: "Partner Restaurants", val: "500+" },
            { label: "On-Time Deliveries", val: "99.2%" },
            { label: "Active Diners Served", val: "50,000+" }
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <p className="text-3xl sm:text-4xl font-black text-primary">{stat.val}</p>
              <p className="text-xs font-black uppercase tracking-wider text-sub mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* The Kada Ecosystem */}
        <div className="space-y-4">
          <div className="text-left space-y-1">
            <h2 className="text-xl font-black text-ink">The Kadaverse Ecosystem</h2>
            <p className="text-sm font-semibold text-sub">Four integrated pillars powering daily commerce.</p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            {[
              {
                icon: Bike,
                title: "Food & On-Demand Delivery",
                desc: "High-frequency daily consumer touchpoint connecting neighborhood diners with top regional kitchens, bakeries, and cafes with live kitchen tracking."
              },
              {
                icon: ChefHat,
                title: "Kada Dine (Merchant OS)",
                desc: "Proprietary cloud POS, Kitchen Display Systems (KDS), and dynamic QR ordering that empower restaurants and virtually eliminate order prep delays."
              },
              {
                icon: Store,
                title: "Local Groceries & Retail",
                desc: "Hyperlocal fulfillment of daily essentials, groceries, and pharmacy needs maximizing rider fleet density and order basket value."
              },
              {
                icon: ShieldCheck,
                title: "Fair Partner Economics",
                desc: "Sustainable unit economics based on fair commissions, direct next-day merchant payouts, and 100% rider safety and medical coverage."
              }
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="card p-6 space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-ink">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm font-semibold text-sub leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Governance & Transparency */}
        <div className="card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-ink">Corporate Governance & Compliance</h2>
              <p className="text-xs font-semibold text-sub">Committed to fiduciary integrity, transparency, and data privacy.</p>
            </div>
          </div>

          <p className="text-sm font-semibold text-sub leading-relaxed">
            The Kada operates with strict corporate governance protocols, regular statutory accounting reviews, and complete compliance with India’s Digital Personal Data Protection (DPDP) Act. All customer payments are processed through PCI-DSS Level 1 compliant gateway partners with bank-grade encryption.
          </p>

          <div className="pt-2 border-t border-line text-xs font-semibold text-sub flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Corporate Entity: <strong className="text-ink">The Kada™ Ltd. / KadaDine Hyperlocal Commerce</strong></span>
            <span>Registered HQ: <strong className="text-ink">Kannur, Kerala, India</strong></span>
          </div>
        </div>

        {/* Direct Investor & Partner Desk Card */}
        <div className="card p-6 sm:p-8 space-y-6 bg-gradient-to-br from-white via-white to-primary/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-ink">Investor & Partnership Inquiries</h2>
              <p className="text-xs font-semibold text-sub">Connect directly with our leadership and investor relations desk.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-line bg-white p-4 space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-sub">Investor Relations</p>
              <a href="mailto:ir@thekada.in" className="text-sm font-bold text-primary hover:underline block truncate">
                ir@thekada.in
              </a>
            </div>

            <div className="rounded-xl border border-line bg-white p-4 space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-sub">Support & Partners</p>
              <a href="mailto:support@thekada.in" className="text-sm font-bold text-ink hover:underline block truncate">
                support@thekada.in
              </a>
            </div>

            <div className="rounded-xl border border-line bg-white p-4 space-y-1">
              <p className="text-[11px] font-black uppercase tracking-wider text-sub">Corporate Phone</p>
              <p className="text-sm font-bold text-ink truncate">+91 94964 91654</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={vendorSignupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black text-white shadow-xs hover:bg-blue-600 transition-colors"
            >
              <Store className="h-4 w-4" />
              <span>Partner With Us</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white hover:bg-slate-50 px-6 py-3 text-xs font-black text-slate-700 transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span>Send Message to Team</span>
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black text-sub hover:text-ink transition-colors"
            >
              <span>View About Us</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
