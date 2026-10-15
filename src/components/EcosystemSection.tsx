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

  return (
    <section className="relative overflow-hidden rounded-t-[44px] sm:rounded-t-[60px] lg:rounded-t-[72px] bg-white border-t border-slate-200/80 shadow-[0_-16px_48px_rgba(15,23,42,0.04)] -mt-8 sm:-mt-12 pt-14 sm:pt-20 pb-16 sm:pb-24 z-20">
      {/* Top Side Curves Transition SVG */}
      <div className="absolute top-0 inset-x-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-6 sm:h-10 text-white fill-current block"
        >
          <path d="M0,40 C360,4 1080,4 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>

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
        {/* Brand Wordmark (matching reference: bold, lowercase, tight tracking) */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight lowercase">
          the kada
        </h2>

        {/* Subtitle flanked by horizontal lines */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-3 sm:mt-4 mb-10 sm:mb-14 px-4">
          <div className="h-px bg-slate-200 flex-1 max-w-[60px] sm:max-w-[120px]" />
          <p className="text-[10px] sm:text-xs md:text-sm font-extrabold tracking-[0.22em] text-slate-400 uppercase text-center whitespace-nowrap">
            POWERING INDIA&apos;S CHANGING LIFESTYLE
          </p>
          <div className="h-px bg-slate-200 flex-1 max-w-[60px] sm:max-w-[120px]" />
        </div>

        {/* Center Stage Card Container matching Reference Design in Kada Style */}
        <div className="relative mx-auto max-w-xs sm:max-w-[390px]">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative bg-white rounded-[32px] sm:rounded-[38px] border border-slate-100/90 shadow-[0_16px_50px_rgba(0,0,0,0.07)] p-6 sm:p-8 pt-8 sm:pt-10 pb-7 sm:pb-9 text-center overflow-hidden transition-all duration-300"
          >
            {/* Top Row: Left Peeking Icon, Center Active Icon, Right Peeking Icon */}
            <div className="relative h-28 sm:h-32 flex items-center justify-center mb-5 select-none">
              {/* Peeking Left App Icon (Click to select previous) */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label={`Previous: ${prevProduct.name}`}
                className="absolute -left-7 sm:-left-8 w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] sm:rounded-[26px] overflow-hidden opacity-40 hover:opacity-80 transition-all duration-300 cursor-pointer shadow-sm scale-90 -translate-y-0.5"
              >
                <img
                  src={prevProduct.logo}
                  alt={prevProduct.name}
                  className="w-full h-full object-cover rounded-[22px] sm:rounded-[26px]"
                />
              </button>

              {/* Center Active App Icon */}
              {renderCardLink(
                <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-lg ring-1 ring-black/5 transition-transform duration-300 hover:scale-105 group bg-white">
                  <img
                    key={activeProduct.id}
                    src={activeProduct.logo}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover rounded-[26px] sm:rounded-[30px] animate-in fade-in duration-300"
                  />
                </div>
              )}

              {/* Peeking Right App Icon (Click to select next) */}
              <button
                type="button"
                onClick={handleNext}
                aria-label={`Next: ${nextProduct.name}`}
                className="absolute -right-7 sm:-right-8 w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] sm:rounded-[26px] overflow-hidden opacity-40 hover:opacity-80 transition-all duration-300 cursor-pointer shadow-sm scale-90 -translate-y-0.5"
              >
                <img
                  src={nextProduct.logo}
                  alt={nextProduct.name}
                  className="w-full h-full object-cover rounded-[22px] sm:rounded-[26px]"
                />
              </button>
            </div>

            {/* App Title */}
            {renderCardLink(
              <span className="inline-block font-black text-2xl sm:text-[26px] text-slate-900 tracking-tight lowercase hover:text-primary transition-colors">
                {activeProduct.name}
              </span>
            )}

            {/* App Description */}
            <p className="mt-2 text-xs sm:text-[13px] font-medium text-slate-500 max-w-[270px] sm:max-w-[290px] mx-auto leading-relaxed min-h-[38px] sm:min-h-[40px]">
              {activeProduct.desc}
            </p>

            {/* Direct Call to Action with Brand Colored Arrow */}
            <div className="mt-5">
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

          {/* Slider Controls: Arrows and Dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous ecosystem app"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {PRODUCTS.map((prod, index) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to ${prod.name}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === activeIndex
                      ? "w-6 bg-slate-900"
                      : "w-2 bg-slate-200 hover:bg-slate-300"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next ecosystem app"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
