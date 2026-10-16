import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
    desc: "Experience lightning-fast hyper-local food delivery, 1-tap table reservations & live GPS tracking.",
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
    desc: "Complete cloud POS, QR table ordering, kitchen displays & automated billing for modern restaurants.",
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
    desc: "The best fleet network for lightning-fast deliveries, daily automated payouts & flexible rider shifts.",
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
    desc: "Front desk check-ins, guest QR room service, automated housekeeping boards & direct hotel bookings.",
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
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-primary to-indigo-700 p-2.5 sm:p-3 flex items-center justify-center rounded-2xl sm:rounded-3xl shadow-inner">
          <img
            src={prod.logo}
            alt={prod.name}
            className="w-full h-full object-contain filter brightness-0 invert drop-shadow-sm"
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
    <section className="relative overflow-hidden w-full h-full flex flex-col justify-center items-center py-4 sm:py-8 select-none z-10 text-white">
      {/* ── SPECIAL BACKGROUND PATTERN: Deep Space Orbit Rings + Constellation Matrix Grid ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#38bdf8 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Planetary Orbit Vector Rings (Left & Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-30"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-cyan-400/40 fill-none" strokeWidth="1.2">
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
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-cyan-400/40 fill-none" strokeWidth="1.2">
          <circle cx="280" cy="280" r="70" />
          <circle cx="280" cy="280" r="130" strokeDasharray="6 6" />
          <circle cx="280" cy="280" r="190" />
          <circle cx="280" cy="280" r="250" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Central Cyan Ambient Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/15 rounded-full blur-[130px]"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10 w-full flex flex-col items-center">
        {/* Brand Tagline Badge */}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 mb-3 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          The Unified Platform
        </span>

        {/* Brand Wordmark (matching Zomato eternal reference: bold, lowercase, tight tracking) */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight lowercase">
          the <span className="text-cyan-400">kada</span>
        </h2>

        {/* Subtitle flanked by glowing gradient lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1.5 mb-6 sm:mb-8 px-4 w-full max-w-lg">
          <div className="h-px bg-gradient-to-r from-transparent to-cyan-400/60 flex-1" />
          <p className="text-[11px] sm:text-xs font-black tracking-[0.25em] text-cyan-200/90 uppercase text-center whitespace-nowrap">
            POWERING INDIA&apos;S CHANGING LIFESTYLE
          </p>
          <div className="h-px bg-gradient-to-l from-transparent to-cyan-400/60 flex-1" />
        </div>

        {/* Center Stage Card Container */}
        <div className="relative mx-auto max-w-[300px] sm:max-w-[340px] w-full">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative bg-white rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-6 sm:p-7 text-center overflow-hidden transition-all duration-300"
          >
            {/* Top Row: Left Peeking Icon, Center Active Icon, Right Peeking Icon */}
            <div className="relative h-24 sm:h-28 flex items-center justify-center mb-2 select-none">
              {/* Left Peeking Icon */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label={`Previous: ${prevProduct.name}`}
                className="absolute -left-5 sm:-left-7 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden opacity-40 hover:opacity-90 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center"
              >
                {renderAppIcon(prevProduct)}
              </button>

              {/* Center Active App Icon */}
              {renderCardLink(
                <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl ring-2 ring-black/10 transition-transform duration-300 hover:scale-105 group bg-white flex items-center justify-center shrink-0">
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
                className="absolute -right-5 sm:-right-7 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden opacity-40 hover:opacity-90 transition-all cursor-pointer shadow-md shrink-0 flex items-center justify-center"
              >
                {renderAppIcon(nextProduct)}
              </button>
            </div>

            {/* App Category Tag */}
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 mt-1">
              {activeProduct.category}
            </p>

            {/* App Title */}
            {renderCardLink(
              <span className="inline-block font-black text-xl sm:text-2xl text-slate-900 tracking-tight lowercase hover:text-primary transition-colors">
                {activeProduct.name}
              </span>
            )}

            {/* App Description */}
            <p className="mt-1 text-xs sm:text-[13px] font-medium text-slate-500 max-w-[260px] mx-auto leading-relaxed min-h-[36px]">
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

        {/* ── Bottom Interactive Product Switcher Pills ── */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-xl">
          {PRODUCTS.map((prod, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black lowercase tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25 scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10"
                }`}
              >
                {prod.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
