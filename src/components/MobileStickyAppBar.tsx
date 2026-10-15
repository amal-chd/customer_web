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
      // Show immediately or after tiny scroll
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || isExcludedPage) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:hidden z-50 pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-[#0B0B0D]/95 backdrop-blur-xl border border-white/10 p-2.5 pl-3 pr-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        {/* Left Side: App Icon + Descriptive Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* App Squircle Icon */}
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-rose-500 to-[#E23744] p-1.5 flex items-center justify-center shadow-md">
            <span className="text-white font-black italic tracking-tighter text-xs">
              KADA
            </span>
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-[12px] font-bold text-white tracking-tight truncate">
              Online ordering and
            </p>
            <p className="text-[11px] font-semibold text-white/75 truncate">
              much more on the app
            </p>
          </div>
        </div>

        {/* Right Side: CTA Pill + Optional Dismiss */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to="/order"
            className="rounded-full bg-white px-4 py-2 text-[12px] font-black text-[#E23744] hover:bg-slate-100 active:scale-95 transition-all shadow-md tracking-tight whitespace-nowrap"
          >
            Order on app
          </Link>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss app banner"
            className="p-1 text-white/40 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
