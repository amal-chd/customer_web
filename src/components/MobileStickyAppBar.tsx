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
    <div className="fixed bottom-3 left-3 right-3 sm:hidden z-[100] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-black/95 backdrop-blur-xl border border-white/10 p-2.5 pl-3 pr-3 shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
        {/* Left Side: App Icon + Descriptive Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* App Squircle Icon with The Kada Logo */}
          <div className="h-9 w-9 shrink-0 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm shadow-black/10">
            <img
              src="/logo.png"
              alt="The Kada"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-[12px] font-bold text-white tracking-tight truncate">
              Online ordering and much more on the app
            </p>
          </div>
        </div>

        {/* Right Side: CTA Pill + Optional Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to="/order"
            className="rounded-full bg-white hover:bg-slate-100 active:scale-95 text-[#E23744] px-3.5 py-1.5 text-[11px] font-black shadow-sm transition-all tracking-tight whitespace-nowrap"
          >
            Order on app
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
