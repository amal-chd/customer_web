import React from "react";
import { Link } from "react-router-dom";

interface EcosystemProduct {
  id: string;
  name: string;
  desc: string;
  logo: string;
  cardBg: string;
  borderCol: string;
  hoverBorder: string;
  href: string;
  isExternal: boolean;
}

const PRODUCTS: EcosystemProduct[] = [
  {
    id: "the-kada",
    name: "the kada",
    desc: "Get the app now to start ordering your favorite dishes!",
    logo: "/ecosystem/the-kada.png",
    cardBg: "from-[#FFF0F2] via-[#FFF8F9] to-white",
    borderCol: "border-[#FFE2E6]",
    hoverBorder: "hover:border-rose-300",
    href: "/order",
    isExternal: false,
  },
  {
    id: "kada-dine",
    name: "kada dine",
    desc: "Complete cloud POS, QR table ordering & operations for your restaurant",
    logo: "/ecosystem/kada-dine.png",
    cardBg: "from-[#FFFBEA] via-[#FFFEF6] to-white",
    borderCol: "border-[#FEF0C7]",
    hoverBorder: "hover:border-amber-300",
    href: "https://kadadine.thekada.in",
    isExternal: true,
  },
  {
    id: "kada-delivery",
    name: "kada delivery",
    desc: "The best fleet network for lightning-fast deliveries & flexible earnings",
    logo: "/ecosystem/kada-delivery.png",
    cardBg: "from-[#F3F0FF] via-[#FAF8FF] to-white",
    borderCol: "border-[#E9D5FF]",
    hoverBorder: "hover:border-purple-300",
    href: "https://rider.thekada.in",
    isExternal: true,
  },
  {
    id: "kada-stay",
    name: "kada stay",
    desc: "Offering complete QR room service & hotel operations for your stay",
    logo: "/ecosystem/kada-stay.png",
    cardBg: "from-[#FFF1F1] via-[#FFF8F8] to-white",
    borderCol: "border-[#FFE2E2]",
    hoverBorder: "hover:border-rose-300",
    href: "https://kada-stay.web.app",
    isExternal: true,
  },
];

export function EcosystemSection() {
  return (
    <section className="bg-white py-14 sm:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Brand Title (matching reference image) */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight lowercase">
          the kada
        </h2>

        {/* Subtitle with divider lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-3 mb-10 sm:mb-14">
          <div className="h-px bg-slate-200 flex-1 max-w-[60px] sm:max-w-[120px]" />
          <p className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] text-slate-400 uppercase">
            POWERING INDIA&apos;S CHANGING LIFESTYLES
          </p>
          <div className="h-px bg-slate-200 flex-1 max-w-[60px] sm:max-w-[120px]" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => {
            const cardContent = (
              <div
                className={`group h-full rounded-[2rem] bg-gradient-to-b ${prod.cardBg} border ${prod.borderCol} ${prod.hoverBorder} p-7 sm:p-8 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer`}
              >
                {/* App Squircle Logo */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[1.75rem] overflow-hidden shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105 bg-white">
                  <img
                    src={prod.logo}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Info */}
                <div className="mt-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight lowercase">
                      {prod.name}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-[220px] mx-auto min-h-[44px]">
                      {prod.desc}
                    </p>
                  </div>

                  {/* CTA matching reference image */}
                  <div className="mt-7 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 group-hover:gap-2.5 transition-all">
                    <span>Check it out</span>
                    <span className="text-[#E23744] text-[10px] sm:text-xs">▶</span>
                  </div>
                </div>
              </div>
            );

            return prod.isExternal ? (
              <a
                key={prod.id}
                href={prod.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full text-inherit no-underline"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={prod.id}
                to={prod.href}
                className="block h-full text-inherit no-underline"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
