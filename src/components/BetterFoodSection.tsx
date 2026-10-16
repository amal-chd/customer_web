import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function BetterFoodSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets for floating stickers at varied speeds (desktop gutters only)
  const basilY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [25, -25]);
  const burgerY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [40, -30]);
  const dimsumY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [30, -35]);
  const tomato1Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [15, -20]);
  const tomato2Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [25, -15]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [45, -30]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-4, 6]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-transparent pt-1 pb-4 sm:pb-6 z-20 select-none"
    >
      {/* ── Scroll-Linked Parallax Food Stickers (Visible on Mobile & Desktop as in Reference) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1. Fresh Basil Leaf (Top Left Gutter) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-1 left-3 sm:top-3 sm:left-12 w-7 h-7 sm:w-11 sm:h-11 max-w-[48px] max-h-[48px] opacity-80 will-change-transform"
        >
          <img
            src="/zomato_assets/basil.png"
            alt="Basil leaf"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 2. Juicy Burger (Mid-Left Gutter) */}
        <motion.div
          style={{ y: burgerY }}
          className="absolute top-16 -left-1 sm:top-20 sm:left-8 w-11 h-11 sm:w-15 sm:h-15 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
        >
          <img
            src="/zomato_assets/burger.png"
            alt="Burger"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </motion.div>

        {/* 3. Steaming Dim Sum Basket (Top Right Gutter) */}
        <motion.div
          style={{ y: dimsumY }}
          className="absolute top-1 -right-1 sm:top-3 sm:right-12 w-11 h-11 sm:w-14 sm:h-14 max-w-[56px] max-h-[56px] opacity-90 will-change-transform"
        >
          <img
            src="/zomato_assets/dimsum.png"
            alt="Dim sum"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </motion.div>

        {/* 4. Tomato Slice (Mid Right Gutter) */}
        <motion.div
          style={{ y: tomato1Y }}
          className="absolute top-28 right-2 sm:top-32 sm:right-16 w-6 h-6 sm:w-8 sm:h-8 max-w-[36px] max-h-[36px] opacity-85 will-change-transform"
        >
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato slice"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 5. Cherry Tomato (Bottom Left Gutter) */}
        <motion.div
          style={{ y: tomato2Y }}
          className="absolute bottom-1 left-3 sm:bottom-2 sm:left-14 w-5 h-5 sm:w-7 sm:h-7 max-w-[32px] max-h-[32px] opacity-85 will-change-transform"
        >
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 6. Crispy Pizza Slice (Bottom Right Gutter) */}
        <motion.div
          style={{ y: pizzaY, rotate: pizzaRotate }}
          className="absolute bottom-0 right-2 sm:bottom-1 sm:right-10 w-11 h-11 sm:w-16 sm:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
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
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-primary mb-2 sm:mb-2.5">
            The Kada Quality
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Better food for{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              everyone
            </span>
          </h2>

          <p className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm md:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
            Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
          </p>
        </div>

        {/* ── Iconic Overlapping / Playful Stat Badges Stack (Zomato Signature) ── */}
        <div className="relative mt-4 sm:mt-6 mx-auto w-full max-w-xs sm:max-w-md h-44 sm:h-52 select-none">
          {/* Card 1: 500+ Top Restaurants (Top-Left) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 left-1 sm:left-4 z-10 flex items-center justify-between gap-2.5 sm:gap-4 rounded-2xl bg-white px-3.5 py-2.5 sm:px-4.5 sm:py-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-slate-100/90 w-[185px] sm:w-[230px] text-left -rotate-1 hover:rotate-0 transition-transform duration-300"
          >
            <div>
              <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                500+
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">
                top restaurants
              </p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
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
            className="absolute top-11 sm:top-13 right-1 sm:right-4 z-20 flex items-center justify-between gap-2.5 sm:gap-4 rounded-2xl bg-white px-3.5 py-2.5 sm:px-4.5 sm:py-3 shadow-[0_12px_28px_rgba(37,99,235,0.12)] border border-blue-100 w-[180px] sm:w-[225px] text-left rotate-[4deg] hover:rotate-0 transition-transform duration-300 ring-1 ring-blue-500/10"
          >
            <div>
              <p className="text-lg sm:text-2xl font-black text-primary tracking-tight leading-none">
                14 Districts
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">
                across Kerala
              </p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 p-1 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center">
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
            className="absolute top-22 sm:top-26 left-3 sm:left-8 z-15 flex items-center justify-between gap-2.5 sm:gap-4 rounded-2xl bg-white px-3.5 py-2.5 sm:px-4.5 sm:py-3 shadow-[0_10px_26px_rgba(15,23,42,0.08)] border border-slate-100/90 w-[190px] sm:w-[235px] text-left -rotate-[2deg] hover:rotate-0 transition-transform duration-300"
          >
            <div>
              <p className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                1 Million+
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">
                orders delivered
              </p>
            </div>
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img
                src="/zomato_assets/bag_icon.png"
                alt="Orders delivered"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
