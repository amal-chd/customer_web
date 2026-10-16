import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Star } from "lucide-react";

export function BetterFoodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            The Kada Quality
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Better food for{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              everyone
            </span>
          </h2>

          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-lg font-semibold text-slate-600 max-w-lg mx-auto leading-relaxed">
            Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
          </p>
        </div>

        {/* ── Overlapping / Playful Stat Badges Stack Redesigned for Equal Size ── */}
        <div className="relative mt-7 sm:mt-10 mx-auto w-full max-w-xs sm:max-w-md md:max-w-xl h-48 sm:h-56 select-none">
          {/* Card 1: 500+ Top Restaurants (Top-Left) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 left-1 sm:left-6 z-10 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)] border border-white w-[190px] sm:w-[250px] text-left -rotate-1 hover:rotate-0 transition-transform duration-300 ring-1 ring-black/5"
          >
            <div>
              <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                500+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                top restaurants
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 p-1.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
              <img
                src="/zomato_assets/store_icon.png"
                alt="Restaurants"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 2: 14 Districts Across Kerala (Mid-Right, Overlapping, Tilted) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="absolute top-12 sm:top-14 right-1 sm:right-6 z-20 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 shadow-[0_16px_36px_rgba(37,99,235,0.14)] border border-blue-100 w-[190px] sm:w-[250px] text-left rotate-[4deg] hover:rotate-0 transition-transform duration-300 ring-1 ring-blue-500/10"
          >
            <div>
              <p className="text-xl sm:text-3xl font-black text-primary tracking-tight leading-none">
                14 Districts
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                across Kerala
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 p-1.5 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center">
              <img
                src="/zomato_assets/pin_icon.png"
                alt="Districts"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 3: 1 Million+ Orders Delivered (Bottom-Left, Overlapping) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="absolute top-26 sm:top-30 left-3 sm:left-12 z-15 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)] border border-white w-[200px] sm:w-[260px] text-left -rotate-[2deg] hover:rotate-0 transition-transform duration-300 ring-1 ring-black/5"
          >
            <div>
              <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                1 Million+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                orders delivered
              </p>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 p-1.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center">
              <img
                src="/zomato_assets/bag_icon.png"
                alt="Orders delivered"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* ── Bottom Trust Chips for Balanced Height ── */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-slate-600 bg-white/60 backdrop-blur-sm border border-white/80 py-2 px-4 rounded-full shadow-xs">
          <span className="flex items-center gap-1 text-slate-700">
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            Avg 28-min delivery
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
            4.9/5 Food quality
          </span>
          <span className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Hygiene verified
          </span>
        </div>
      </div>
    </section>
  );
}
