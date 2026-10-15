import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface FeatureTile {
  id: string;
  name: string;
  image: string;
  to: string;
}

const APP_FEATURES: FeatureTile[] = [
  {
    id: "veg",
    name: "Veg Mode",
    image: "/zomato_assets/veg_mode.png",
    to: "/order?veg=true",
  },
  {
    id: "schedule",
    name: "Schedule Order",
    image: "/zomato_assets/schedule_order.png",
    to: "/order",
  },
  {
    id: "train",
    name: "Express Delivery",
    image: "/zomato_assets/train_order.png",
    to: "/order",
  },
  {
    id: "healthy",
    name: "Healthy Bowls",
    image: "/zomato_assets/healthy.png",
    to: "/search?q=Healthy",
  },
  {
    id: "party",
    name: "Plan a Party",
    image: "/zomato_assets/party.png",
    to: "/search?q=Party",
  },
  {
    id: "gourmet",
    name: "Gourmet Dine",
    image: "/zomato_assets/gourmet.png",
    to: "/search?q=Gourmet",
  },
  {
    id: "collections",
    name: "Collections",
    image: "/zomato_assets/collections.png",
    to: "/search",
  },
  {
    id: "offers",
    name: "Super Offers",
    image: "/zomato_assets/offers.png",
    to: "/order",
  },
  {
    id: "gifts",
    name: "Gift Cards",
    image: "/zomato_assets/gift_cards.png",
    to: "/account",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 24,
    },
  },
};

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden rounded-t-[36px] sm:rounded-t-[48px] bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white border-t border-blue-100/60 pt-12 sm:pt-16 pb-14 sm:pb-20 select-none">
      {/* ── Section Header in The Kada Style ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          The Kada Experience
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          What&apos;s waiting for you on the{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kada app
          </span>
          ?
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
          Our app is packed with features that enable you to experience hyper-local food delivery & dining like never before
        </p>
      </motion.div>

      {/* ── Staggered App Tiles Grid in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-xs sm:max-w-md px-4 mt-8 sm:mt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-3 gap-3 sm:gap-4 items-stretch"
        >
          {APP_FEATURES.map((item) => (
            <motion.div
              key={item.id}
              variants={tileVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className="h-full"
            >
              <Link
                to={item.to}
                className="group flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.12)] hover:border-primary/40 transition-shadow duration-200 text-center aspect-square h-full w-full"
              >
                <div className="flex-1 flex items-center justify-center w-full">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>
                </div>

                <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                  {item.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-slate-700 font-extrabold text-sm sm:text-base mt-8 sm:mt-10 tracking-tight"
        >
          ...and a lot more features inside The Kada app
        </motion.p>
      </div>
    </section>
  );
}
