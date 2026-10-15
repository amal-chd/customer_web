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
      className="relative w-full overflow-hidden bg-transparent py-4 sm:py-8 z-20 select-none"
    >
      {/* ── Scroll-Linked Parallax Food Stickers (Visible on Mobile & Desktop as in Reference) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1. Fresh Basil Leaf (Top Left Gutter) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-2 left-4 sm:top-6 sm:left-14 w-7 h-7 sm:w-12 sm:h-12 max-w-[48px] max-h-[48px] opacity-80 will-change-transform"
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
          className="absolute top-20 -left-1 sm:top-24 sm:left-10 w-11 h-11 sm:w-16 sm:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
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
          className="absolute top-3 -right-1 sm:top-8 sm:right-14 w-11 h-11 sm:w-14 sm:h-14 max-w-[56px] max-h-[56px] opacity-90 will-change-transform"
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
          className="absolute top-32 right-3 sm:top-36 sm:right-24 w-6 h-6 sm:w-9 sm:h-9 max-w-[36px] max-h-[36px] opacity-85 will-change-transform"
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
          className="absolute bottom-24 left-3 sm:bottom-20 sm:left-20 w-6 h-6 sm:w-8 sm:h-8 max-w-[32px] max-h-[32px] opacity-85 will-change-transform"
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
          className="absolute bottom-12 right-2 sm:bottom-8 sm:right-12 w-11 h-11 sm:w-16 sm:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
            The Kada Quality
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Better food for{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              everyone
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
            Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
          </p>
        </div>

        {/* ── Iconic Overlapping / Playful Stat Badges Stack (Zomato Signature) ── */}
        <div className="relative mt-8 sm:mt-12 mx-auto w-full max-w-sm sm:max-w-md h-52 sm:h-60 select-none">
          {/* Card 1: 500+ Top Restaurants (Top-Left) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, zIndex: 30 }}
            transition={{ duration: 0.35 }}
            className="absolute top-0 left-2 sm:left-4 z-10 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] border border-slate-100/90 w-[210px] sm:w-[240px] text-left -rotate-1 hover:rotate-0 transition-transform duration-300"
          >
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                500+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                top restaurants
              </p>
            </div>
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
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
            className="absolute top-14 sm:top-16 right-2 sm:right-4 z-20 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_14px_36px_rgba(37,99,235,0.12)] border border-blue-100 w-[205px] sm:w-[235px] text-left rotate-[4deg] hover:rotate-0 transition-transform duration-300 ring-1 ring-blue-500/10"
          >
            <div>
              <p className="text-xl sm:text-2xl font-black text-primary tracking-tight leading-none">
                14 Districts
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                across Kerala
              </p>
            </div>
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 p-1 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-center">
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
            className="absolute top-28 sm:top-32 left-4 sm:left-8 z-15 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] border border-slate-100/90 w-[215px] sm:w-[245px] text-left -rotate-[2deg] hover:rotate-0 transition-transform duration-300"
          >
            <div>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                1 Million+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1">
                orders delivered
              </p>
            </div>
            <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
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
