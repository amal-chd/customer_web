import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export function MobileStickyAppBar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Hide on checkout / order tracking / login pages to keep clear action space
  const isExcludedPage =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-tracking") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/delete-account");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || isExcludedPage) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[92%] md:hidden z-[100] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 p-2.5 pl-3 pr-3 shadow-[0_14px_40px_-8px_rgba(15,23,42,0.18),0_4px_12px_rgba(15,23,42,0.06)]">
        {/* Left Side: App Icon + Descriptive Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* App Squircle Icon with The Kada Logo */}
          <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center shadow-xs">
            <img
              src="/logo.png"
              alt="The Kada"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-[12px] font-black text-slate-900 tracking-tight truncate">
              Order food on The Kada app
            </p>
            <p className="text-[10px] font-semibold text-slate-500 truncate">
              Live GPS tracking & faster checkout
            </p>
          </div>
        </div>

        {/* Right Side: CTA Pill + Optional Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to="/order"
            className="rounded-full bg-primary hover:bg-blue-600 active:scale-95 text-white px-3.5 py-1.5 text-[11px] font-black shadow-md shadow-primary/25 transition-all tracking-tight whitespace-nowrap"
          >
            Open App
          </Link>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss app banner"
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
