import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

interface FeatureTile {
  id: string;
  name: string;
  image: string;
  to: string;
  tag?: string;
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
    name: "Schedule your order",
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
    name: "Healthy",
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
    name: "Gourmet",
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
    name: "Offers",
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

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden rounded-t-[36px] sm:rounded-t-[48px] bg-[#FFF5F6] border-t border-rose-100/70 pt-12 sm:pt-16 pb-14 sm:pb-20 select-none">
      {/* ── Section Header ── */}
      <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-[#E23744] tracking-tight leading-tight">
          What&apos;s waiting for<br />you on the app?
        </h2>
        <p className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
          Our app is packed with features that enable you to experience food delivery like never before
        </p>
      </div>

      {/* ── 3-Column Staggered App Tiles Grid (Zomato Mobile Signature) ── */}
      <div className="relative z-10 mx-auto max-w-xs sm:max-w-md px-4 mt-8 sm:mt-10">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {APP_FEATURES.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="group flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl bg-white border border-rose-100/60 shadow-[0_4px_16px_rgba(226,55,68,0.06)] hover:shadow-[0_8px_24px_rgba(226,55,68,0.12)] hover:-translate-y-1 active:scale-95 transition-all duration-200 text-center aspect-square"
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <div className="h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    loading="lazy"
                  />
                </div>
              </div>

              <span className="text-[11px] sm:text-xs font-black text-slate-800 tracking-tight leading-tight line-clamp-2 mt-1">
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Tagline */}
        <p className="text-center text-slate-800 font-black text-base sm:text-lg mt-8 sm:mt-10 tracking-tight">
          ...and a lot more
        </p>
      </div>
    </section>
  );
}
