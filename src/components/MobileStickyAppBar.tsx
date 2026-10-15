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
    <div className="fixed bottom-3 left-3 right-3 sm:hidden z-50 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800/80 p-2.5 pl-3 pr-3 shadow-[0_16px_40px_rgba(15,23,42,0.5)]">
        {/* Left Side: App Icon + Descriptive Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* App Squircle Icon with The Kada Logo */}
          <div className="h-10 w-10 shrink-0 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shadow-black/10">
            <img
              src="/logo.png"
              alt="The Kada"
              className="h-7 w-7 object-contain"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-[12px] font-black text-white tracking-tight truncate">
              Order on The Kada App
            </p>
            <p className="text-[11px] font-semibold text-slate-400 truncate">
              Fast delivery · Best offers · Live GPS
            </p>
          </div>
        </div>

        {/* Right Side: CTA Pill + Optional Dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/order"
            className="rounded-full bg-primary hover:bg-primary-dark active:scale-95 text-white px-4 py-2 text-[12px] font-black shadow-md shadow-primary/30 transition-all tracking-tight whitespace-nowrap"
          >
            Order now
          </Link>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss app banner"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
