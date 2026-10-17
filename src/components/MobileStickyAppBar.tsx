import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export function MobileStickyAppBar() {
  // Once dismissed, stay dismissed for the visit.
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem("kada_app_bar_dismissed") !== "1";
    } catch {
      return true;
    }
  });
  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem("kada_app_bar_dismissed", "1");
    } catch {
      // ignore
    }
  }
  const { pathname } = useLocation();

  // Hide on checkout / order tracking / login pages to keep clear action space
  const isExcludedPage =
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-tracking") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/delete-account");

  if (!visible || isExcludedPage) return null;

  return (
    <>
    {/* Keeps the end of the page (footer) from hiding under the bar. */}
    <div aria-hidden="true" className="h-20 md:hidden" />
    <div className="fixed bottom-3 left-3 right-3 max-w-md mx-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[92%] md:hidden z-[100] pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200/90 p-2.5 pl-3 pr-3 shadow-[0_14px_40px_-8px_rgba(15,23,42,0.18),0_4px_12px_rgba(15,23,42,0.06)]">
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
              Order on The Kada
            </p>
            <p className="text-[10px] font-semibold text-slate-500 truncate">
              Live order tracking
            </p>
          </div>
        </div>

        {/* Right Side: CTA Pill + Optional Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            to="/order"
            className="rounded-full bg-primary hover:bg-blue-600 active:scale-95 text-white px-4 py-2 text-xs font-black shadow-md shadow-primary/25 transition-all tracking-tight whitespace-nowrap"
          >
            Order now
          </Link>
          <button
            onClick={dismiss}
            aria-label="Dismiss app banner"
            className="-mr-1.5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
