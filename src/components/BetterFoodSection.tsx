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

  // Parallax offsets for floating stickers at varied speeds
  const basilY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [35, -35]);
  const burgerY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [80, -40]);
  const dimsumY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [55, -55]);
  const tomato1Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [25, -25]);
  const tomato2Y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [45, -20]);
  const pizzaY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [95, -60]);
  const pizzaRotate = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [-5, 8]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white pt-12 sm:pt-20 pb-16 sm:pb-24 z-20 select-none"
    >
      {/* ── Scroll-Linked Parallax Food Stickers ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1. Fresh Basil Leaf (Top Left) */}
        <motion.div
          style={{ y: basilY }}
          className="absolute top-6 sm:top-10 left-[16%] sm:left-[24%] w-8 h-8 sm:w-11 sm:h-11 opacity-90 will-change-transform"
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
          className="absolute top-20 sm:top-24 left-2 sm:left-[7%] w-16 h-16 sm:w-26 sm:h-26 opacity-95 will-change-transform"
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
          className="absolute top-6 sm:top-8 right-3 sm:right-[9%] w-18 h-18 sm:w-28 sm:h-28 opacity-95 will-change-transform"
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
          className="absolute top-32 sm:top-40 right-[12%] sm:right-[19%] w-7 h-7 sm:w-9 sm:h-9 opacity-90 will-change-transform"
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
          className="absolute bottom-20 sm:bottom-28 left-[11%] sm:left-[21%] w-6 h-6 sm:w-8 sm:h-8 opacity-90 will-change-transform"
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
          className="absolute bottom-8 sm:bottom-12 right-2 sm:right-[7%] w-22 h-22 sm:w-32 sm:h-32 opacity-95 will-change-transform"
        >
          <img
            src="/zomato_assets/pizza.png"
            alt="Pizza slice"
            className="w-full h-full object-contain filter drop-shadow-lg"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* ── Section Content in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
            The Kada Quality
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Better food for{" "}
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              everyone
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
            Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
          </p>
        </motion.div>

        {/* ── Stacked & Tilted Playful Stat Badges (Scroll-Revealed) ── */}
        <div className="relative mx-auto mt-10 sm:mt-14 w-full max-w-xs sm:max-w-sm h-56 sm:h-64">
          {/* Card 1: 500+ Verified Restaurants (Top-Left, tilted -2.5deg) */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -6 }}
            whileInView={{ opacity: 1, x: 0, rotate: -2.5 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute top-0 left-0 z-10 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.07)] border border-slate-100/90 transition-shadow duration-300 w-[240px] sm:w-[260px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                500+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                top restaurants
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
              <img
                src="/zomato_assets/store_icon.png"
                alt="Restaurants"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 2: 14 Districts Covered (Tilted +4.5deg, overlapping right) */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 8 }}
            whileInView={{ opacity: 1, x: 0, rotate: 4.5 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute top-12 sm:top-14 right-0 z-20 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_14px_38px_rgba(37,99,235,0.1)] border border-blue-50/80 transition-shadow duration-300 w-[205px] sm:w-[225px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                14 Districts
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                across Kerala
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
              <img
                src="/zomato_assets/pin_icon.png"
                alt="Districts"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Card 3: 1 Million+ orders delivered (Tilted -1deg, overlapping bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 35, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.7, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="absolute top-26 sm:top-32 left-3 sm:left-5 z-30 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_16px_44px_rgba(15,23,42,0.09)] border border-slate-100 transition-shadow duration-300 w-[250px] sm:w-[270px] cursor-pointer"
          >
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1 Million+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                orders delivered
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
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
