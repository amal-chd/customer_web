import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EcosystemProduct {
  id: string;
  name: string;
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
    desc: "Experience lightning-fast hyper-local food delivery, 1-tap table reservations & live GPS tracking.",
    logo: "/ecosystem/the-kada.png",
    href: "/order",
    cta: "Order now",
    accent: "#1E6EF4",
    isExternal: false,
  },
  {
    id: "kada-dine",
    name: "kada dine",
    desc: "Complete cloud POS, QR table ordering, kitchen displays & automated billing for modern restaurants.",
    logo: "/ecosystem/kada-dine.png",
    href: "https://kadadine.thekada.in",
    cta: "Explore dine",
    accent: "#F59E0B",
    isExternal: true,
  },
  {
    id: "kada-delivery",
    name: "kada delivery",
    desc: "The best fleet network for lightning-fast deliveries, daily automated payouts & flexible rider shifts.",
    logo: "/ecosystem/kada-delivery.png",
    href: "https://rider.thekada.in",
    cta: "Deliver with us",
    accent: "#10B981",
    isExternal: true,
  },
  {
    id: "kada-host",
    name: "kada host",
    desc: "Front desk check-ins, guest QR room service, automated housekeeping boards & direct hotel bookings.",
    logo: "/ecosystem/kada-host.png",
    href: "https://host.thekada.in",
    cta: "Host guests",
    accent: "#6366F1",
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

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 4500);
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
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-primary to-indigo-700 p-2.5 sm:p-3 flex items-center justify-center">
          <img
            src={prod.logo}
            alt={prod.name}
            className="w-full h-full object-contain filter brightness-0 invert"
          />
        </div>
      );
    }
    return (
      <img
        src={prod.logo}
        alt={prod.name}
        className="w-full h-full object-cover scale-110"
      />
    );
  };

  return (
    <section className="relative overflow-hidden bg-transparent pt-1 pb-2 sm:pb-4 z-10 w-full select-none">
      {/* Top Decorative Ambient Side Curves (Left and Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="120" cy="120" r="80" />
          <circle cx="120" cy="120" r="140" />
          <circle cx="120" cy="120" r="200" />
          <circle cx="120" cy="120" r="260" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="280" cy="120" r="80" />
          <circle cx="280" cy="120" r="140" />
          <circle cx="280" cy="120" r="200" />
          <circle cx="280" cy="120" r="260" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Brand Wordmark (matching Zomato eternal reference: bold, lowercase, tight tracking) */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight lowercase">
          the kada
        </h2>

        {/* Subtitle flanked by horizontal lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1 mb-3.5 sm:mb-5 px-4">
          <div className="h-px bg-slate-200 flex-1 max-w-[50px] sm:max-w-[100px]" />
          <p className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-slate-400 uppercase text-center whitespace-nowrap">
            POWERING INDIA&apos;S CHANGING LIFESTYLE
          </p>
          <div className="h-px bg-slate-200 flex-1 max-w-[50px] sm:max-w-[100px]" />
        </div>

        {/* Center Stage Card Container matching Reference Design in Zomato Style */}
        <div className="relative mx-auto max-w-[280px] sm:max-w-[330px]">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.06)] p-5 sm:p-6 text-center overflow-hidden transition-all duration-300"
          >
            {/* Top Row: Left Peeking Icon, Center Active Icon, Right Peeking Icon */}
            <div className="relative h-24 sm:h-28 flex items-center justify-center mb-3 select-none">
              {/* Left Peeking Icon (Tap to go previous) */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label={`Previous: ${prevProduct.name}`}
                className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden opacity-35 hover:opacity-75 transition-all cursor-pointer shadow-sm"
              >
                {renderAppIcon(prevProduct)}
              </button>

              {/* Center Active App Icon */}
              {renderCardLink(
                <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-105 group bg-white flex items-center justify-center">
                  <div key={activeProduct.id} className="w-full h-full animate-in fade-in duration-300 flex items-center justify-center">
                    {renderAppIcon(activeProduct)}
                  </div>
                </div>
              )}

              {/* Right Peeking Icon (Tap to go next) */}
              <button
                type="button"
                onClick={handleNext}
                aria-label={`Next: ${nextProduct.name}`}
                className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden opacity-35 hover:opacity-75 transition-all cursor-pointer shadow-sm"
              >
                {renderAppIcon(nextProduct)}
              </button>
            </div>

            {/* App Title */}
            {renderCardLink(
              <span className="inline-block font-black text-lg sm:text-xl text-slate-900 tracking-tight lowercase hover:text-primary transition-colors">
                {activeProduct.name}
              </span>
            )}

            {/* App Description */}
            <p className="mt-1 text-xs sm:text-[13px] font-medium text-slate-500 max-w-[240px] mx-auto leading-relaxed min-h-[34px]">
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
      </div>
    </section>
  );
}

export default EcosystemSection;
