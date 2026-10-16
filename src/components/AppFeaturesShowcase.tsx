import { Link } from "react-router-dom";
import { Sparkles, Navigation, Clock, Gift, ShieldCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureTile {
  id: string;
  name: string;
  desc?: string;
  image: string;
  to: string;
}

const FEATURE_COLUMNS: FeatureTile[][] = [
  // Column 1
  [
    {
      id: "veg",
      name: "Veg Mode",
      desc: "100% Pure Vegetarian Kitchens",
      image: "/zomato_assets/veg_mode.png",
      to: "/order?veg=true",
    },
    {
      id: "healthy",
      name: "Healthy Bowls",
      desc: "Salads, Keto & Low-Calorie",
      image: "/zomato_assets/healthy.png",
      to: "/search?q=Healthy",
    },
    {
      id: "collections",
      name: "Collections",
      desc: "Curated Local Guides",
      image: "/zomato_assets/collections.png",
      to: "/search",
    },
  ],
  // Column 2 (Elevated Center Column as in Reference)
  [
    {
      id: "schedule",
      name: "Schedule Order",
      desc: "Plan Ahead For Later",
      image: "/zomato_assets/schedule_order.png",
      to: "/order",
    },
    {
      id: "party",
      name: "Plan a Party",
      desc: "Bulk Catering & Combos",
      image: "/zomato_assets/party.png",
      to: "/search?q=Party",
    },
    {
      id: "offers",
      name: "Super Offers",
      desc: "Up to 50% OFF Daily Deals",
      image: "/zomato_assets/offers.png",
      to: "/order",
    },
  ],
  // Column 3
  [
    {
      id: "train",
      name: "Express Delivery",
      desc: "Priority 20-min Dropoff",
      image: "/zomato_assets/train_order.png",
      to: "/order",
    },
    {
      id: "gourmet",
      name: "Gourmet Dine",
      desc: "Chef-Crafted Fine Dining",
      image: "/zomato_assets/gourmet.png",
      to: "/search?q=Gourmet",
    },
    {
      id: "gifts",
      name: "Gift Cards",
      desc: "Foodie Vouchers & Treats",
      image: "/zomato_assets/gift_cards.png",
      to: "/account",
    },
  ],
];

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden w-full h-full flex flex-col justify-center items-center py-4 sm:py-8 select-none z-10">
      {/* ── SPECIAL BACKGROUND PATTERN: High-Tech Wave Radar Arcs & Micro-Grid ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#0284c7 1.2px, transparent 1.2px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Decorative Ambient Radial Wave Circles (Left and Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 opacity-45"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-blue-500/30 fill-none" strokeWidth="1.2">
          <circle cx="100" cy="100" r="80" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="140" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="200" />
          <circle cx="100" cy="100" r="260" strokeDasharray="4 4" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 opacity-45"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-blue-500/30 fill-none" strokeWidth="1.2">
          <circle cx="300" cy="300" r="80" strokeDasharray="4 4" />
          <circle cx="300" cy="300" r="140" strokeDasharray="6 6" />
          <circle cx="300" cy="300" r="200" />
          <circle cx="300" cy="300" r="260" strokeDasharray="4 4" />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-400/20 rounded-full blur-[120px]"
      />

      {/* ── Section Header in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 text-center w-full">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          The Kada Experience
        </span>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          What&apos;s waiting for you on the{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kada app
          </span>
          ?
        </h2>

        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-semibold text-slate-600 max-w-lg mx-auto leading-relaxed">
          Our app is packed with features designed to make hyperlocal food delivery & dining seamless across Kerala
        </p>
      </div>

      {/* ── Staggered 3-Column App Tiles Grid Redesigned for Equal Size ── */}
      <div className="relative z-10 mx-auto max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 mt-6 sm:mt-8 w-full">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-start pt-2">
          {FEATURE_COLUMNS.map((column, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-3 sm:gap-4 md:gap-5 ${
                colIdx === 1 ? "-translate-y-2.5 sm:-translate-y-3.5" : ""
              }`}
            >
              {column.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Link
                    to={item.to}
                    className="group flex flex-col items-center justify-between p-2.5 sm:p-3 md:p-3.5 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-white shadow-[0_8px_24px_rgba(2,132,199,0.08)] hover:shadow-[0_16px_36px_rgba(37,99,235,0.16)] hover:border-primary/40 transition-all duration-300 text-center min-h-[96px] sm:min-h-[116px] md:min-h-[124px] w-full ring-1 ring-black/5"
                  >
                    <div className="flex-1 flex items-center justify-center w-full py-1">
                      <div className="h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="mt-1">
                      <span className="block text-[11px] sm:text-xs md:text-sm font-black text-slate-800 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom Feature Highlights Pill Bar ── */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-700 bg-white/60 backdrop-blur-sm border border-white/80 py-2 px-5 rounded-full shadow-xs">
          <span className="flex items-center gap-1.5">
            <Navigation className="h-3.5 w-3.5 text-primary" />
            Live Rider GPS Tracking
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            Instant Order Scheduling
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5">
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
            Zero Cancellation Fee
          </span>
        </div>
      </div>
    </section>
  );
}

export default AppFeaturesShowcase;
