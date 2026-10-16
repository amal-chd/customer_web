import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EcosystemProduct {
  id: string;
  name: string;
  category: string;
  desc: string;
  logo: string;
  href: string;
  cta: string;
  accent: string;
  isExternal: boolean;
}

const PRODUCTS: EcosystemProduct[] = [
  {
    id: "the-kada",
    name: "the kada",
    category: "Hyperlocal Food & Grocery",
    desc: "Hyperlocal food delivery, dining & live GPS tracking",
    logo: "/ecosystem/the-kada.png",
    href: "/order",
    cta: "Order now",
    accent: "#38BDF8",
    isExternal: false,
  },
  {
    id: "kada-dine",
    name: "kada dine",
    category: "Restaurant POS & QR Dine-in",
    desc: "Cloud POS, QR table ordering & automated billing",
    logo: "/ecosystem/kada-dine.png",
    href: "https://kadadine.thekada.in",
    cta: "Explore dine",
    accent: "#FBBF24",
    isExternal: true,
  },
  {
    id: "kada-delivery",
    name: "kada delivery",
    category: "Fleet Logistics & Rider Shifts",
    desc: "Hyperlocal fleet delivery network & flexible shifts",
    logo: "/ecosystem/kada-delivery.png",
    href: "https://rider.thekada.in",
    cta: "Deliver with us",
    accent: "#34D399",
    isExternal: true,
  },
  {
    id: "kada-host",
    name: "kada host",
    category: "Hotels & QR Room Service",
    desc: "Front desk PMS, QR room service & guest bookings",
    logo: "/ecosystem/kada-host.png",
    href: "https://host.thekada.in",
    cta: "Host guests",
    accent: "#A78BFA",
    isExternal: true,
  },
];

export function EcosystemSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = PRODUCTS.length;
  const prevIndex = (activeIndex - 1 + count) % count;
  const nextIndex = (activeIndex + 1) % count;

  const activeProduct = PRODUCTS[activeIndex];
  const prevProduct = PRODUCTS[prevIndex];
  const nextProduct = PRODUCTS[nextIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, count]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 45) {
      handlePrev();
    } else if (diff < -45) {
      handleNext();
    }
    touchStartX.current = null;
  };

  const renderCardLink = (content: React.ReactNode, className?: string) => {
    return activeProduct.isExternal ? (
      <a
        href={activeProduct.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    ) : (
      <Link to={activeProduct.href} className={className}>
        {content}
      </Link>
    );
  };

  const renderAppIcon = (prod: EcosystemProduct) => {
    if (prod.id === "the-kada") {
      return (
        <div className="w-full h-full bg-white p-2.5 sm:p-3 flex items-center justify-center rounded-2xl sm:rounded-3xl shadow-sm">
          <img
            src={prod.logo}
            alt={prod.name}
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-blue-600 flex items-center justify-center">
        <img
          src={prod.logo}
          alt={prod.name}
          className="w-full h-full object-cover scale-[1.12]"
        />
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden w-full flex flex-col justify-start items-center py-3 sm:py-5 select-none z-10 text-white bg-gradient-to-b from-[#1d4ed8] via-[#2563eb] to-[#38bdf8]">
      {/* ── SPECIAL BACKGROUND PATTERN: Deep Space Orbit Rings + Constellation Matrix Grid ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.25) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Planetary Orbit Vector Rings (Left & Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-30"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-cyan-200/40 fill-none" strokeWidth="1.2">
          <circle cx="120" cy="120" r="70" />
          <circle cx="120" cy="120" r="130" strokeDasharray="6 6" />
          <circle cx="120" cy="120" r="190" />
          <circle cx="120" cy="120" r="250" strokeDasharray="4 4" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 opacity-30"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-cyan-200/40 fill-none" strokeWidth="1.2">
          <circle cx="280" cy="280" r="70" />
          <circle cx="280" cy="280" r="130" strokeDasharray="6 6" />
          <circle cx="280" cy="280" r="190" />
          <circle cx="280" cy="280" r="250" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Central Cyan Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-sky-300/20 rounded-full blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center z-10 w-full flex flex-col items-center">
        {/* Brand Wordmark (matching Zomato eternal reference: bold, lowercase, tight tracking) */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight lowercase">
          the <span className="text-cyan-200">kada</span>
        </h2>

        {/* Subtitle flanked by glowing gradient lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1.5 mb-6 sm:mb-8 px-4 w-full max-w-lg">
          <div className="h-px bg-gradient-to-r from-transparent to-white/60 flex-1" />
          <p className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-white/95 uppercase text-center whitespace-nowrap">
            POWERING INDIA&apos;S CHANGING LIFESTYLE
          </p>
          <div className="h-px bg-gradient-to-l from-transparent to-white/60 flex-1" />
        </div>

        {/* ── DESKTOP VIEW: Horizontal Listing of All 4 Ecosystem Products ── */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full mt-2 mb-6">
          {PRODUCTS.map((prod) => {
            const cardContent = (
              <div className="group h-full bg-white rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] p-5 lg:p-6 text-center flex flex-col items-center justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
                {/* Top: App Icon */}
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl shadow-md overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {renderAppIcon(prod)}
                </div>

                {/* Center: Title & Description */}
                <div className="my-3 flex-1 flex flex-col items-center justify-center">
                  <h3 className="text-base lg:text-lg font-black text-slate-900 tracking-tight lowercase">
                    {prod.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 font-medium leading-relaxed max-w-[220px]">
                    {prod.desc}
                  </p>
                </div>

                {/* Bottom: Direct CTA */}
                <div className="pt-2 border-t border-slate-100 w-full">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900 group-hover:text-primary transition-colors">
                    <span>{prod.cta}</span>
                    <span
                      className="text-[10px] transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: prod.accent }}
                    >
                      ▶
                    </span>
                  </span>
                </div>
              </div>
            );

            return prod.isExternal ? (
              <a
                key={prod.id}
                href={prod.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={prod.id} to={prod.href} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* ── MOBILE VIEW: Interactive Carousel Card & Pill Switcher ── */}
        <div className="md:hidden w-full flex flex-col items-center">
          {/* Center Stage Card Container */}
          <div className="relative mx-auto max-w-[300px] sm:max-w-[340px] w-full">
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative bg-white rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-6 sm:p-7 text-center overflow-hidden transition-all duration-300 touch-pan-y"
            >
              {/* Top Row: Left Peeking Icon, Center Active Icon, Right Peeking Icon */}
              <div className="relative h-32 sm:h-36 flex items-center justify-center mb-1 select-none">
                {/* Left Peeking Icon */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={`Previous: ${prevProduct.name}`}
                  className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden opacity-35 hover:opacity-90 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center"
                >
                  {renderAppIcon(prevProduct)}
                </button>

                {/* Center Active App Icon */}
                {renderCardLink(
                  <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-black/10 transition-transform duration-300 hover:scale-105 group bg-white flex items-center justify-center shrink-0">
                    <div key={activeProduct.id} className="w-full h-full animate-in fade-in duration-300 flex items-center justify-center overflow-hidden">
                      {renderAppIcon(activeProduct)}
                    </div>
                  </div>,
                  "relative z-10 inline-flex items-center justify-center shrink-0"
                )}

                {/* Right Peeking Icon */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={`Next: ${nextProduct.name}`}
                  className="absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden opacity-35 hover:opacity-90 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center"
                >
                  {renderAppIcon(nextProduct)}
                </button>
              </div>

              {/* Small Description Only */}
              <p className="mt-3 text-xs sm:text-[13px] font-semibold text-slate-600 max-w-[260px] mx-auto leading-relaxed">
                {activeProduct.desc}
              </p>

              {/* Direct Call to Action with Brand Colored Arrow */}
              <div className="mt-3">
                {renderCardLink(
                  <span className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-slate-900 hover:text-primary transition-colors">
                    <span>{activeProduct.cta}</span>
                    <span
                      className="text-[10px] sm:text-xs transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: activeProduct.accent }}
                    >
                      ▶
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Interactive Product Switcher Pills */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 w-full max-w-xl pb-10">
            {PRODUCTS.map((prod, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black lowercase tracking-tight transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-blue-900 shadow-md shadow-blue-900/25 scale-105"
                      : "bg-white/15 text-white/90 hover:bg-white/25 hover:text-white border border-white/25"
                  }`}
                >
                  {prod.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
