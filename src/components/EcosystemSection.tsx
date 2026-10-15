import React from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";

interface EcosystemProduct {
  id: string;
  name: string;
  desc: string;
  logo: string;
  cardBg: string;
  borderCol: string;
  hoverBorder: string;
  hoverShadow: string;
  href: string;
  isExternal: boolean;
}

const PRODUCTS: EcosystemProduct[] = [
  {
    id: "the-kada",
    name: "the kada",
    desc: "Get the app now to start ordering your favorite dishes!",
    logo: "/ecosystem/the-kada.png",
    cardBg: "from-blue-50/80 via-white to-blue-100/50",
    borderCol: "border-blue-200/80",
    hoverBorder: "hover:border-primary/50",
    hoverShadow: "hover:shadow-[0_24px_50px_-15px_rgba(37,99,235,0.22)]",
    href: "/order",
    isExternal: false,
  },
  {
    id: "kada-dine",
    name: "kada dine",
    desc: "Complete cloud POS, QR table ordering & operations for your restaurant",
    logo: "/ecosystem/kada-dine.png",
    cardBg: "from-[#FFFBEA] via-[#FFFDF5] to-[#FEF3C7]",
    borderCol: "border-[#FDE68A]",
    hoverBorder: "hover:border-amber-300",
    hoverShadow: "hover:shadow-[0_24px_50px_-15px_rgba(245,158,11,0.22)]",
    href: "https://kadadine.thekada.in",
    isExternal: true,
  },
  {
    id: "kada-delivery",
    name: "kada delivery",
    desc: "The best fleet network for lightning-fast deliveries & flexible earnings",
    logo: "/ecosystem/kada-delivery.png",
    cardBg: "from-[#F5F1FF] via-[#FAF8FF] to-[#EDE5FF]",
    borderCol: "border-[#DDD6FE]",
    hoverBorder: "hover:border-purple-300",
    hoverShadow: "hover:shadow-[0_24px_50px_-15px_rgba(139,92,246,0.22)]",
    href: "https://rider.thekada.in",
    isExternal: true,
  },
  {
    id: "kada-host",
    name: "kada host",
    desc: "Front desk, housekeeping, operations & booking engine for hosts",
    logo: "/ecosystem/kada-host.png",
    cardBg: "from-[#EFF6FF] via-[#F8FBFF] to-[#DBEAFE]",
    borderCol: "border-[#BFDBFE]",
    hoverBorder: "hover:border-blue-300",
    hoverShadow: "hover:shadow-[0_24px_50px_-15px_rgba(59,130,246,0.22)]",
    href: "https://host.thekada.in",
    isExternal: true,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function EcosystemSection() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-100/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Wordmark (matching reference: bold, lowercase, tight tracking) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight lowercase">
            the kada
          </h2>

          {/* Subtitle with refined divider rules (matching reference image) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 mb-12 sm:mb-16">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-slate-300 flex-1 max-w-[80px] sm:max-w-[140px]" />
            <div className="text-center">
              <p className="text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.25em] text-slate-400 uppercase leading-snug">
                POWERING INDIA&apos;S<br className="sm:hidden" /> CHANGING LIFESTYLES
              </p>
            </div>
            <div className="h-px bg-gradient-to-l from-transparent via-slate-200 to-slate-300 flex-1 max-w-[80px] sm:max-w-[140px]" />
          </div>
        </motion.div>

        {/* Mobile Swipe Cue */}
        <div className="flex sm:hidden items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 px-1">
          <span>Explore Ecosystem</span>
          <span className="text-primary font-bold">Swipe →</span>
        </div>

        {/* 4 Cards: Mobile Horizontal Snap Rail, Desktop 4-col Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8 no-scrollbar touch-pan-x-scroll"
        >
          {PRODUCTS.map((prod) => {
            const cardContent = (
              <div
                className={`group h-full rounded-[32px] bg-gradient-to-b ${prod.cardBg} border ${prod.borderCol} ${prod.hoverBorder} ${prod.hoverShadow} p-8 sm:p-9 pt-10 pb-8 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden`}
              >
                {/* Subtle top inner sheen */}
                <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/60 to-transparent pointer-events-none rounded-t-[32px]" />

                {/* App Squircle Logo */}
                <div className="relative w-[124px] h-[124px] sm:w-[136px] sm:h-[136px] rounded-[28px] overflow-hidden shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12),0_4px_10px_-2px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] bg-white transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                  <img
                    src={prod.logo}
                    alt={prod.name}
                    className="w-full h-full object-cover rounded-[28px] scale-[1.03]"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="mt-7 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight lowercase">
                      {prod.name}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-[13px] font-medium text-slate-500 leading-relaxed max-w-[220px] mx-auto min-h-[44px]">
                      {prod.desc}
                    </p>
                  </div>

                  {/* Refined "Check it out ▶" CTA in Kada style */}
                  <div className="mt-8 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 transition-all">
                    <span>Check it out</span>
                    <span className="text-primary text-[10px] sm:text-xs transition-transform duration-300 group-hover:translate-x-1">
                      ▶
                    </span>
                  </div>
                </div>
              </div>
            );

            return prod.isExternal ? (
              <motion.a
                key={prod.id}
                variants={cardItemVariants}
                whileHover={{ y: -6 }}
                href={prod.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-auto h-full text-inherit no-underline"
              >
                {cardContent}
              </motion.a>
            ) : (
              <motion.div
                key={prod.id}
                variants={cardItemVariants}
                whileHover={{ y: -6 }}
                className="block snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-auto h-full"
              >
                <Link
                  to={prod.href}
                  className="block h-full text-inherit no-underline"
                >
                  {cardContent}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default EcosystemSection;
