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

  // Parallax offsets for floating stickers at varied speeds (desktop only)
  const basilY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [30, -30]);
  const burgerY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [50, -30]);
  const dimsumY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [40, -40]);
  const tomato1Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [20, -20]);
  const tomato2Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [35, -20]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [60, -40]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-5, 8]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white pt-12 sm:pt-20 pb-16 sm:pb-24 z-20 select-none"
    >
      {/* ── Scroll-Linked Parallax Food Stickers (Desktop / Tablet only: hidden on mobile to prevent blocking text) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
        {/* 1. Fresh Basil Leaf (Top Left Gutters) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-6 left-8 lg:left-16 w-9 h-9 lg:w-11 lg:h-11 max-w-[44px] max-h-[44px] opacity-80 will-change-transform"
        >
          <img
            src="/zomato_assets/basil.png"
            alt="Basil leaf"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </motion.div>

        {/* 2. Juicy Burger (Mid-Left Gutter - far from text) */}
        <motion.div
          style={{ y: burgerY }}
          className="absolute top-20 left-4 lg:left-12 w-14 h-14 lg:w-16 lg:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
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
          className="absolute top-8 right-6 lg:right-14 w-12 h-12 lg:w-14 lg:h-14 max-w-[56px] max-h-[56px] opacity-90 will-change-transform"
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
          className="absolute top-36 right-16 lg:right-28 w-7 h-7 lg:w-8 lg:h-8 max-w-[32px] max-h-[32px] opacity-85 will-change-transform"
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
          className="absolute bottom-16 left-12 lg:left-24 w-6 h-6 lg:w-7 lg:h-7 max-w-[28px] max-h-[28px] opacity-85 will-change-transform"
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
          className="absolute bottom-8 right-6 lg:right-12 w-14 h-14 lg:w-16 lg:h-16 max-w-[64px] max-h-[64px] opacity-90 will-change-transform"
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto"
        >
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
        </motion.div>

        {/* ── Responsive 3-Card Stat Highlights Grid (No overlaps, clean on all screen sizes) ── */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl mx-auto text-left">
          {/* Card 1: 500+ Top Restaurants */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                500+
              </p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                top restaurants
              </p>
            </div>
            <div className="h-11 w-11 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img
                src="/zomato_assets/store_icon.png"
                alt="Restaurants"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 2: 14 Districts across Kerala */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_4px_20px_rgba(37,99,235,0.08)] border border-blue-50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-2xl font-black text-primary tracking-tight">
                14 Districts
              </p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                across Kerala
              </p>
            </div>
            <div className="h-11 w-11 shrink-0 p-1 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-center">
              <img
                src="/zomato_assets/pin_icon.png"
                alt="Districts"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 3: 1 Million+ Orders Delivered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -3, scale: 1.02 }}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_4px_20px_rgba(15,23,42,0.06)] border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                1 Million+
              </p>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                orders delivered
              </p>
            </div>
            <div className="h-11 w-11 shrink-0 p-1 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
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
