import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ShieldCheck, Zap, Star } from "lucide-react";
import {
  fetchPlatformStats,
  DEFAULT_PLATFORM_STATS,
  type PlatformStats,
} from "@/services/platformStats";

interface StatItem {
  id: string;
  stat: string;
  mobileStat: string;
  label: string;
  mobileLabel: string;
  subtext: string;
  icon: string;
  iconAlt: string;
  badgeIcon: typeof Star;
  badgeColor: string;
  badgeBg: string;
  badgeText: string;
  badgeMobileText: string;
  highlight?: boolean;
}

export function BetterFoodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [statsData, setStatsData] = useState<PlatformStats>(DEFAULT_PLATFORM_STATS);

  useEffect(() => {
    let isMounted = true;
    fetchPlatformStats().then((data) => {
      if (isMounted) {
        setStatsData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const stats: StatItem[] = [
    {
      id: "restaurants",
      stat: statsData.restaurants.stat,
      mobileStat: statsData.restaurants.mobileStat,
      label: "Top Restaurants",
      mobileLabel: "Restaurants",
      subtext: "Curated local eateries, heritage spots & cloud kitchens",
      icon: "/zomato_assets/store_icon.png",
      iconAlt: "Restaurants",
      badgeIcon: Star,
      badgeColor: "text-amber-500 fill-amber-500",
      badgeBg: "bg-amber-50 text-amber-900 border-amber-200/80",
      badgeText: statsData.restaurants.badgeText,
      badgeMobileText: statsData.restaurants.badgeMobileText,
      highlight: false,
    },
    {
      id: "districts",
      stat: statsData.districts.stat,
      mobileStat: statsData.districts.mobileStat,
      label: "Across Kerala",
      mobileLabel: "Districts",
      subtext: "Statewide fast network delivering fresh to your doorstep",
      icon: "/zomato_assets/pin_icon.png",
      iconAlt: "Districts",
      badgeIcon: Zap,
      badgeColor: "text-primary fill-primary",
      badgeBg: "bg-blue-50 text-blue-900 border-blue-200/80",
      badgeText: statsData.districts.badgeText,
      badgeMobileText: statsData.districts.badgeMobileText,
      highlight: true,
    },
    {
      id: "orders",
      stat: statsData.orders.stat,
      mobileStat: statsData.orders.mobileStat,
      label: "Orders Delivered",
      mobileLabel: "Delivered",
      subtext: "Trusted daily with live tracking & contactless care",
      icon: "/zomato_assets/bag_icon.png",
      iconAlt: "Orders delivered",
      badgeIcon: ShieldCheck,
      badgeColor: "text-emerald-500",
      badgeBg: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
      badgeText: statsData.orders.badgeText,
      badgeMobileText: statsData.orders.badgeMobileText,
      highlight: false,
    },
  ];

  // Scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for floating stickers at varied speeds
  const basilY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [30, -30]);
  const burgerY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [45, -35]);
  const dimsumY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [35, -40]);
  const tomato1Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [20, -25]);
  const tomato2Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [30, -20]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [50, -35]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-5, 8]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden select-none z-20 py-3 sm:py-5"
    >
      {/* ── SPECIAL BACKGROUND PATTERN: Precision Micro-Dot Matrix + Ambient Radial Bloom ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#0284c7 1.2px, transparent 1.2px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-sky-400/20 rounded-full blur-[110px]"
      />

      {/* ── Scroll-Linked Parallax Food Stickers ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        {/* 1. Fresh Basil Leaf (Top Left) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-3 left-4 sm:top-6 sm:left-14 w-8 h-8 sm:w-12 sm:h-12 max-w-[48px] max-h-[48px] opacity-80 will-change-transform"
        >
          <img
            src="/zomato_assets/basil.png"
            alt="Basil leaf"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 2. Juicy Burger (Mid-Left) */}
        <motion.div
          style={{ y: burgerY }}
          className="absolute top-24 -left-1 sm:top-32 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
        >
          <img
            src="/zomato_assets/burger.png"
            alt="Burger"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </motion.div>

        {/* 3. Steaming Dim Sum Basket (Top Right) */}
        <motion.div
          style={{ y: dimsumY }}
          className="absolute top-3 -right-1 sm:top-6 sm:right-14 w-12 h-12 sm:w-15 sm:h-15 max-w-[56px] max-h-[56px] opacity-90 will-change-transform"
        >
          <img
            src="/zomato_assets/dimsum.png"
            alt="Dim sum"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </motion.div>

        {/* 4. Tomato Slice (Mid Right) */}
        <motion.div
          style={{ y: tomato1Y }}
          className="absolute top-36 right-3 sm:top-44 sm:right-16 w-7 h-7 sm:w-9 sm:h-9 max-w-[36px] max-h-[36px] opacity-85 will-change-transform"
        >
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato slice"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 5. Cherry Tomato (Bottom Left) */}
        <motion.div
          style={{ y: tomato2Y }}
          className="absolute bottom-4 left-4 sm:bottom-6 sm:left-16 w-6 h-6 sm:w-8 sm:h-8 max-w-[32px] max-h-[32px] opacity-85 will-change-transform"
        >
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 6. Crispy Pizza Slice (Bottom Right) */}
        <motion.div
          style={{ y: pizzaY, rotate: pizzaRotate }}
          className="absolute bottom-3 right-3 sm:bottom-6 sm:right-12 w-12 h-12 sm:w-18 sm:h-18 max-w-[68px] max-h-[68px] opacity-90 will-change-transform"
        >
          <img
            src="/zomato_assets/pizza.png"
            alt="Pizza slice"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* ── Section Content in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center w-full flex flex-col items-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-300/20 text-sky-200 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-2 sm:mb-2.5 backdrop-blur-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>The Kada Network</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Better food for{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
              everyone
            </span>
          </h2>

          <p className="mt-2 sm:mt-2.5 text-xs sm:text-base md:text-lg font-medium text-blue-100/85 max-w-lg mx-auto leading-relaxed">
            Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
          </p>
        </div>

        {/* ── MOBILE VIEW: Single Sleek Unified Metrics Card (sm:hidden) ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.35 }}
          className="sm:hidden mt-5 w-full mx-auto rounded-2xl bg-white/95 backdrop-blur-md p-3.5 shadow-[0_12px_32px_rgba(3,13,34,0.22)] border border-white"
        >
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {stats.map((item) => {
              const BadgeIcon = item.badgeIcon;
              return (
                <div key={`mobile-${item.id}`} className="flex flex-col items-center text-center px-1">
                  <div
                    className={`h-9 w-9 rounded-xl border flex items-center justify-center p-1.5 shadow-xs mb-1.5 ${
                      item.highlight ? "bg-blue-50 border-blue-100" : "bg-sky-50 border-sky-100"
                    }`}
                  >
                    <img
                      src={item.icon}
                      alt={item.iconAlt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p
                    className={`text-lg font-black tracking-tight leading-none ${
                      item.highlight ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    {item.mobileStat}
                  </p>
                  <p className="text-[10px] font-bold text-slate-600 mt-1">
                    {item.mobileLabel}
                  </p>
                  <div className={`mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${item.badgeBg}`}>
                    <BadgeIcon className={`h-2.5 w-2.5 ${item.badgeColor}`} />
                    <span>{item.badgeMobileText}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Statewide fast delivery · 100% contactless</span>
          </div>
        </motion.div>

        {/* ── DESKTOP VIEW: 3 Balanced Cards Grid (hidden sm:grid) ── */}
        <div className="hidden sm:grid mt-8 sm:grid-cols-3 gap-4 lg:gap-5 w-full max-w-3xl lg:max-w-4xl mx-auto select-none">
          {stats.map((item, index) => {
            const BadgeIcon = item.badgeIcon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className={`group relative rounded-3xl bg-white/95 backdrop-blur-md p-5 lg:p-6 shadow-[0_12px_32px_rgba(3,13,34,0.18)] border transition-all duration-300 text-left flex flex-col justify-between ${
                  item.highlight
                    ? "border-blue-200/90 ring-1 ring-blue-500/10 shadow-[0_16px_36px_rgba(37,99,235,0.18)]"
                    : "border-white/80 hover:border-sky-200/80"
                }`}
              >
                <div>
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={item.icon}
                      alt={item.iconAlt}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-4">
                    <p
                      className={`text-3xl lg:text-4xl font-black tracking-tight leading-none ${
                        item.highlight ? "text-primary" : "text-slate-900"
                      }`}
                    >
                      {item.stat}
                    </p>
                    <p className="text-sm font-bold text-slate-700 mt-1">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {item.subtext}
                    </p>
                  </div>
                </div>

                {/* Desktop Trust Badge at bottom of card */}
                <div className="mt-4 pt-3.5 border-t border-slate-100/90 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.badgeBg}`}
                  >
                    <BadgeIcon className={`h-3.5 w-3.5 ${item.badgeColor}`} />
                    <span>{item.badgeText}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
