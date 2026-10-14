import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Store, CheckCircle2 } from "lucide-react";
import { Brand } from "./bits";
import { cn } from "@/lib/utils";
import { getVendorOnboardingUrl } from "@/lib/urls";
import { toast } from "@/components/Toast";

const NAV = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Investor Relations", to: "/investor-relations" },
  { label: "Contact", to: "/contact" },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

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

  if (pathname === "/") {
    return (
      <div className="min-h-[100dvh] w-full font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col font-sans bg-slate-50 selection:bg-primary/20 selection:text-primary-dark">
      {/* Sticky, non-overlapping header with clean backdrop blur */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200 border-b",
          scrolled
            ? "bg-white/95 backdrop-blur-md border-slate-200/80 shadow-xs py-2.5 sm:py-3"
            : "bg-white border-slate-100 py-3 sm:py-3.5"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95"
          >
            <Brand light={false} />
          </Link>

          <nav className="hidden items-center gap-7 lg:gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-primary",
                  pathname === n.to ? "text-primary font-black" : "text-slate-600"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:gap-4 md:flex">
            <Link
              to="/add-restaurant"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 text-xs font-black text-slate-700 hover:text-primary transition-all"
            >
              <Store className="h-3.5 w-3.5 text-primary" />
              <span>Add restaurant</span>
            </Link>

            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 transition-colors hover:text-slate-900 px-2 py-1"
            >
              Sign in
            </Link>

            <Link
              to="/order"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white shadow-md shadow-slate-900/15 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              Order now
            </Link>
          </div>

          <button
            className="text-slate-900 md:hidden p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle Navigation Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="absolute inset-x-0 top-full border-b border-slate-200 bg-white px-4 py-4 md:hidden shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {NAV.map((n) => (
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
              ))}

              <Link
                to="/add-restaurant"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Store className="h-4 w-4 text-primary" />
                <span>Add Restaurant (Partner with us)</span>
              </Link>

              <hr className="my-2 border-slate-100" />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/order"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20"
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

function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Please enter a valid email address");
      return;
    }
    toast("Thank you for subscribing to The Kada updates!");
    setEmail("");
  };

  return (
    <footer className="bg-slate-950 text-white overflow-hidden relative border-t border-slate-800">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-block">
              <Brand light={true} />
            </Link>

            <p className="max-w-md text-sm font-medium text-slate-400 leading-relaxed">
              Order food and essentials from top local kitchens and stores near you. Built for transparent pricing, live kitchen tracking, and lightning-fast hyperlocal delivery.
            </p>

            <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 max-w-sm backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Stay updated
              </p>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-400 outline-none focus:bg-white/15 focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol
              title="Company"
              links={[
                ["About Us", "/about"],
                ["Investor Relations", "/investor-relations"],
                ["How It Works", "/how-it-works"],
                ["Contact Us", "/contact"],
                ["Help & FAQs", "/faq"],
              ]}
            />

            <FooterCol
              title="For Partners"
              links={[
                ["Add Restaurant", "/add-restaurant"],
                ["Partner With Us", "/partner"],
                ["Vendor Onboarding", getVendorOnboardingUrl("/signup"), true],
                ["Vendor Dashboard", getVendorOnboardingUrl("/login"), true],
              ]}
            />

            <FooterCol
              title="Legal"
              links={[
                ["Privacy Policy", "/legal/privacy"],
                ["Terms of Service", "/legal/terms"],
                ["Refund Policy", "/legal/refund"],
                ["Shipping & Delivery", "/legal/shipping"],
                ["Delete Account", "/delete-account"],
              ]}
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>
            © {new Date().getFullYear()} The Kada™ Ltd. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-slate-300 bg-white/[0.05] border border-white/10 px-3.5 py-1.5 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-[11px]">All platform systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string, boolean?][];
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-300 mb-4">
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map(([label, to, isExternal]) => (
          <li key={to}>
            {isExternal ? (
              <a
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-white"
              >
                {label}
              </a>
            ) : (
              <Link
                to={to}
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-white"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
