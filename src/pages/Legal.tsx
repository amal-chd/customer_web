import { Shield, Scale, RefreshCw, Cookie, Truck } from "lucide-react";

interface LegalTemplateProps {
  title: string;
  icon: React.ElementType;
  intro: string;
  sections: { title: string; body: string }[];
}

function LegalTemplate({ title, icon: Icon, intro, sections }: LegalTemplateProps) {
  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black text-ink tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-sm font-semibold text-sub max-w-md mx-auto">
            {intro}
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((sec, i) => (
            <div key={i} className="card p-6 space-y-3">
              <h3 className="text-base font-black text-ink">{sec.title}</h3>
              <p className="text-sm font-semibold text-sub leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRIVACY POLICY ──────────────────────────────────────────────────────────
export function Privacy() {
  return (
    <LegalTemplate
      title="Privacy Policy"
      icon={Shield}
      intro="Last updated: June 2026. How we collect, store, and manage customer data."
      sections={[
        {
          title: "1. Information We Collect",
          body: "We collect personal details such as your name, email, phone number, and delivery addresses when you place an order. We also collect transactional logs and device diagnostics."
        },
        {
          title: "2. Data Processing & Usage",
          body: "We process your information solely to confirm your order, route it to restaurants and delivery agents, manage payment options, and send updates. We do not sell your personal data."
        },
        {
          title: "3. Third-party Integrations",
          body: "We share data with payment processors (e.g. Razorpay) and Firebase Authentication providers under strict security guidelines."
        }
      ]}
    />
  );
}

// ─── TERMS OF SERVICE ────────────────────────────────────────────────────────
export function Terms() {
  return (
    <LegalTemplate
      title="Terms of Service"
      icon={Scale}
      intro="Last updated: June 2026. Rules and policies for using our platform."
      sections={[
        {
          title: "1. Eligibility & Accounts",
          body: "You must be at least 18 years old to create an account. You are responsible for maintaining your login security."
        },
        {
          title: "2. Acceptable Use",
          body: "You agree not to probe or overload our infrastructure, or upload unlawful contents. Violators will face immediate ban."
        },
        {
          title: "3. Disclaimers & Uptime",
          body: "The Kada is provided on an 'as-is' basis. We make reasonable efforts to guarantee 99.9% uptime but are not liable for transient network disruptions."
        }
      ]}
    />
  );
}

// ─── REFUND & CANCELLATION ───────────────────────────────────────────────────
export function Refund() {
  return (
    <LegalTemplate
      title="Refund & Cancellation"
      icon={RefreshCw}
      intro="Last updated: June 2026. Refund eligibility and cancellation thresholds."
      sections={[
        {
          title: "1. Free Trials & Subscriptions",
          body: "Subscriptions can be cancelled anytime, preventing future renewals. No partial refunds are provided for active cycles."
        },
        {
          title: "2. Refund Eligibility",
          body: "Refunds are processed solely if the restaurant fails to fulfill your order, or in the case of double charges. Tap support for assistance."
        },
        {
          title: "3. Processing Period",
          body: "Approved refunds take 5-7 business days to reflect in your original payment method (bank account, card, or wallet)."
        }
      ]}
    />
  );
}

// ─── COOKIE POLICY ──────────────────────────────────────────────────────────
export function Cookies() {
  return (
    <LegalTemplate
      title="Cookie Policy"
      icon={Cookie}
      intro="Last updated: June 2026. How we use cookies to keep sessions secure."
      sections={[
        {
          title: "1. Essential Security",
          body: "We use session identifiers and CSRF tokens to keep your authentication state secure and prevent cross-site hijacking."
        },
        {
          title: "2. UI Preferences",
          body: "We save dark mode choices and sidebar configurations locally so your preferences persist."
        },
        {
          title: "3. Analytics Tracking",
          body: "We track anonymous telemetry (page visits, click rates) to identify UI issues. We do not track advertisement metrics."
        }
      ]}
    />
  );
}

// ─── SHIPPING & DELIVERY ─────────────────────────────────────────────────────
export function Shipping() {
  return (
    <LegalTemplate
      title="Shipping & Delivery"
      icon={Truck}
      intro="Last updated: June 2026. Logistics routing, SLAs, and fees."
      sections={[
        {
          title: "1. Delivery Routing",
          body: "Orders are assigned to certified delivery agents. You will receive live GPS coordinates when the order leaves the kitchen."
        },
        {
          title: "2. Delivery SLAs",
          body: "We strive to deliver all hot meals within 40 minutes. Delays due to weather, gridlocks, or kitchen surges will be flagged in the timeline."
        },
        {
          title: "3. Delivery Fees",
          body: "Fees are computed dynamically using base distance, fuel surges, and peak hours, displayable at checkout before payment confirmation."
        }
      ]}
    />
  );
}
