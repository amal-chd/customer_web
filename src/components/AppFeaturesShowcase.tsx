import { Link } from "react-router-dom";
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
    <section className="relative overflow-hidden w-full flex flex-col justify-start items-center py-7 sm:py-11 select-none z-10 text-white">
      {/* Decorative Ambient Radial Wave Circles (Left and Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 opacity-45"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-sky-300/30 fill-none" strokeWidth="1.2">
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
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-sky-300/30 fill-none" strokeWidth="1.2">
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
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          What&apos;s waiting for you on the{" "}
          <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
            Kada app
          </span>
          ?
        </h2>

        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold text-blue-100/90 max-w-lg mx-auto leading-relaxed">
          Our app is packed with features designed to make hyperlocal food delivery & dining seamless across Kerala
        </p>
      </div>

      {/* ── Staggered 3-Column App Tiles Grid Redesigned for Equal Size ── */}
      <div className="relative z-10 mx-auto max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl px-4 mt-3 sm:mt-5 w-full">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 items-start pt-1">
          {FEATURE_COLUMNS.map((column, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-2 sm:gap-3 ${
                colIdx === 1 ? "-translate-y-2 sm:-translate-y-3" : ""
              }`}
            >
              {column.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Link
                    to={item.to}
                    className="group flex flex-col items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.16)] hover:border-primary/40 transition-all duration-300 text-center min-h-[82px] sm:min-h-[96px] md:min-h-[105px] w-full ring-1 ring-black/5"
                  >
                    <div className="flex-1 flex items-center justify-center w-full py-0.5">
                      <div className="h-7 w-7 sm:h-9 sm:w-9 md:h-10 md:w-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <div className="mt-0.5">
                      <span className="block text-[10px] sm:text-xs md:text-sm font-black text-slate-800 tracking-tight leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AppFeaturesShowcase;
