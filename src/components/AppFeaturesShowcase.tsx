import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureTile {
  id: string;
  name: string;
  image: string;
  to: string;
}

const FEATURE_COLUMNS: FeatureTile[][] = [
  // Column 1
  [
    {
      id: "veg",
      name: "Veg Mode",
      image: "/zomato_assets/veg_mode.png",
      to: "/order?veg=true",
    },
    {
      id: "healthy",
      name: "Healthy Bowls",
      image: "/zomato_assets/healthy.png",
      to: "/search?q=Healthy",
    },
    {
      id: "collections",
      name: "Collections",
      image: "/zomato_assets/collections.png",
      to: "/search",
    },
  ],
  // Column 2 (Elevated Center Column as in Reference)
  [
    {
      id: "schedule",
      name: "Schedule Order",
      image: "/zomato_assets/schedule_order.png",
      to: "/order",
    },
    {
      id: "party",
      name: "Plan a Party",
      image: "/zomato_assets/party.png",
      to: "/search?q=Party",
    },
    {
      id: "offers",
      name: "Super Offers",
      image: "/zomato_assets/offers.png",
      to: "/order",
    },
  ],
  // Column 3
  [
    {
      id: "train",
      name: "Express Delivery",
      image: "/zomato_assets/train_order.png",
      to: "/order",
    },
    {
      id: "gourmet",
      name: "Gourmet Dine",
      image: "/zomato_assets/gourmet.png",
      to: "/search?q=Gourmet",
    },
    {
      id: "gifts",
      name: "Gift Cards",
      image: "/zomato_assets/gift_cards.png",
      to: "/account",
    },
  ],
];

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden bg-transparent py-4 sm:py-8 select-none z-10 w-full">
      {/* Top Decorative Ambient Side Curves (Left and Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="100" cy="100" r="140" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="190" />
          <circle cx="100" cy="100" r="240" strokeDasharray="4 4" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="300" cy="100" r="140" strokeDasharray="6 6" />
          <circle cx="300" cy="100" r="190" />
          <circle cx="300" cy="100" r="240" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* ── Section Header in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-primary mb-2 sm:mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          The Kada Experience
        </span>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          What&apos;s waiting for you on the{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kada app
          </span>
          ?
        </h2>

        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
          Our app is packed with features that enable you to experience hyper-local food delivery & dining like never before
        </p>
      </div>

      {/* ── Staggered 3-Column App Tiles Grid (Zomato Signature Offset) ── */}
      <div className="relative z-10 mx-auto max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-4 mt-6 sm:mt-9">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 items-start pt-2 sm:pt-3">
          {FEATURE_COLUMNS.map((column, colIdx) => (
            <div
              key={colIdx}
              className={`flex flex-col gap-2.5 sm:gap-3.5 md:gap-4 ${
                colIdx === 1 ? "-translate-y-2 sm:-translate-y-3" : ""
              }`}
            >
              {column.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full"
                >
                  <Link
                    to={item.to}
                    className="group flex flex-col items-center justify-between p-2 sm:p-3 md:p-3.5 rounded-2xl sm:rounded-3xl bg-white border border-slate-100 shadow-[0_6px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.12)] hover:border-primary/40 transition-all duration-300 text-center min-h-[92px] sm:min-h-[112px] md:min-h-[122px] w-full"
                  >
                    <div className="flex-1 flex items-center justify-center w-full py-0.5">
                      <div className="h-9 w-9 sm:h-11 sm:w-11 md:h-13 md:w-13 flex items-center justify-center transform group-hover:scale-108 transition-transform duration-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-xs md:text-sm font-black text-slate-800 tracking-tight leading-tight line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-slate-700 font-extrabold text-xs sm:text-sm md:text-base mt-4 sm:mt-6 tracking-tight">
          ...and a lot more features inside The Kada app
        </p>
      </div>
    </section>
  );
}
