import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Store, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Brand } from "./bits";
import { cn } from "@/lib/utils";
import { getVendorOnboardingUrl } from "@/lib/urls";
import { toast } from "@/components/Toast";
import { Footer } from "./Footer";
import { JoinUsDropdown, JOIN_PARTNERS } from "./JoinUsDropdown";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Get the App", to: "/#get-app-section", isAnchor: true },
  { label: "About", to: "/about" },
  { label: "Investor Relations", to: "/investor-relations" },
  { label: "Contact", to: "/contact" },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasHeroVideo, setHasHeroVideo] = useState(false);
  const { pathname } = useLocation();

  const isLanding = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isLanding) {
      const checkVideo = () => {
        const vid = document.querySelector("video");
        setHasHeroVideo(!!vid);
      };
      checkVideo();
      const observer = new MutationObserver(checkVideo);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    } else {
      setHasHeroVideo(false);
    }
  }, [isLanding]);

  const isTransparent = isLanding && hasHeroVideo;
  const isHeaderSolid = !isTransparent || scrolled || open;

  return (
    <div className="flex min-h-[100dvh] flex-col font-sans bg-slate-50 selection:bg-primary/20 selection:text-primary-dark">
      {/* Dynamic Header: Transparent over video on landing page, solid white on scroll / other pages */}
      <header
        className={cn(
          "transition-all duration-300 w-full",
          isTransparent
            ? "fixed top-0 left-0 right-0 z-50"
            : "sticky top-0 z-50 border-b",
          isTransparent
            ? (isHeaderSolid
                ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-2.5 sm:py-3 text-slate-900"
                : "bg-transparent border-b border-transparent py-3 sm:py-4 text-white")
            : (scrolled
                ? "bg-white/95 backdrop-blur-md border-slate-200/80 shadow-xs py-2.5 sm:py-3 text-slate-900"
                : "bg-white border-slate-100 py-3 sm:py-3.5 text-slate-900")
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95"
          >
            <Brand light={isTransparent && !isHeaderSolid} />
          </Link>

          <nav className="hidden items-center gap-7 lg:gap-8 md:flex">
            {NAV.map((n) =>
              n.isAnchor ? (
                <a
                  key={n.to}
                  href={n.to}
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      document.getElementById("get-app-section")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "text-sm font-bold transition-colors cursor-pointer",
                    isTransparent && !isHeaderSolid
                      ? "text-white/85 hover:text-white"
                      : "text-slate-600 hover:text-primary"
                  )}
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "text-sm font-bold transition-colors",
                    isTransparent && !isHeaderSolid
                      ? (pathname === n.to ? "text-white font-black" : "text-white/85 hover:text-white")
                      : (pathname === n.to ? "text-primary font-black" : "text-slate-600 hover:text-primary")
                  )}
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 sm:gap-4 md:flex">
            <JoinUsDropdown isTransparent={isTransparent} isHeaderSolid={isHeaderSolid} />

            <Link
              to="/order"
              className={cn(
                "inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95",
                isTransparent && !isHeaderSolid
                  ? "bg-primary hover:bg-primary-dark shadow-primary/25"
                  : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/15"
              )}
            >
              Order now
            </Link>
          </div>

          <button
            className={cn(
              "md:hidden p-1.5 rounded-xl transition-colors",
              isTransparent && !isHeaderSolid
                ? "text-white hover:bg-white/10"
                : "text-slate-900 hover:bg-slate-100"
            )}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle Navigation Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col gap-1.5">
              {NAV.map((n) =>
                n.isAnchor ? (
                  <a
                    key={n.to}
                    href={n.to}
                    onClick={(e) => {
                      setOpen(false);
                      if (pathname === "/") {
                        e.preventDefault();
                        document.getElementById("get-app-section")?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="rounded-xl px-4 py-2.5 text-sm font-bold transition-colors text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                      pathname === n.to
                        ? "bg-primary/10 text-primary font-black"
                        : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {n.label}
                  </Link>
                )
              )}

              <div className="pt-2 pb-1">
                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Join Us
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {JOIN_PARTNERS.map((partner) => {
                    const Icon = partner.icon;
                    const content = (
                      <div className="flex items-center justify-between rounded-xl p-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", partner.badgeColor)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 text-left">
                            <span className="block text-xs font-black text-slate-900">{partner.name}</span>
                            <span className="block text-[10px] font-medium text-slate-500 truncate">{partner.desc}</span>
                          </div>
                        </div>
                        {partner.isExternal && <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-1" />}
                      </div>
                    );

                    return partner.isExternal ? (
                      <a
                        key={partner.name}
                        href={partner.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link
                        key={partner.name}
                        to={partner.to!}
                        onClick={() => setOpen(false)}
                      >
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <hr className="my-2 border-slate-100" />

              <div className="pt-1">
                <Link
                  to="/order"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20"
                >
                  Order now
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Unified Professional Footer */}
      <Footer />
    </div>
  );
}


