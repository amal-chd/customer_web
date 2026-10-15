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
      {/* ── Continuous & Scroll-Linked Floating Food Stickers (Visible on mobile & desktop) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1. Fresh Basil Leaf (Top Left) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-4 sm:top-8 left-3 sm:left-12 lg:left-20 w-8 h-8 sm:w-11 sm:h-11 opacity-90 will-change-transform animate-float-slow"
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
          className="absolute top-20 sm:top-24 left-2 sm:left-8 lg:left-14 w-12 h-12 sm:w-18 sm:h-18 opacity-95 will-change-transform animate-float"
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
          className="absolute top-4 sm:top-8 right-3 sm:right-10 lg:right-16 w-14 h-14 sm:w-18 sm:h-18 opacity-95 will-change-transform animate-float-reverse"
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
          className="absolute top-28 sm:top-36 right-3 sm:right-16 lg:right-28 w-6 h-6 sm:w-8 sm:h-8 opacity-85 will-change-transform animate-float-fast"
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
          className="absolute bottom-16 sm:bottom-20 left-4 sm:left-14 lg:left-24 w-6 h-6 sm:w-7 sm:h-7 opacity-85 will-change-transform animate-float"
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
          className="absolute bottom-6 sm:bottom-10 right-3 sm:right-10 lg:right-16 w-14 h-14 sm:w-20 sm:h-20 opacity-95 will-change-transform animate-wobble-slow"
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
          viewport={{ once: true, amount: 0.1 }}
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

        {/* ── Stacked & Tilted Playful Stat Badges (Zomato Signature) ── */}
        <div className="relative mx-auto mt-10 sm:mt-12 w-full max-w-[310px] sm:max-w-md h-56 sm:h-64">
          {/* Card 1: 500+ top restaurants (Top-Left, tilted -2.5deg) */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className="absolute top-0 left-0 z-10 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3.5 sm:py-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-slate-100/90 transform transition-all w-[240px] sm:w-[270px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                500+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">
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

          {/* Card 2: 14 Districts across Kerala (Tilted +4deg, overlapping right) */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 8 }}
            whileInView={{ opacity: 1, y: 0, rotate: 4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className="absolute top-14 sm:top-16 right-0 z-20 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3.5 sm:py-4 shadow-[0_14px_36px_rgba(37,99,235,0.12)] border border-blue-100/80 transform transition-all w-[210px] sm:w-[240px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                14 Districts
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">
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

          {/* Card 3: 1 Million+ orders delivered (Tilted -1.5deg, overlapping bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 40 }}
            className="absolute top-28 sm:top-32 left-3 sm:left-6 z-30 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3.5 sm:py-4 shadow-[0_16px_40px_rgba(15,23,42,0.1)] border border-slate-100/90 transform transition-all w-[250px] sm:w-[280px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1 Million+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">
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
