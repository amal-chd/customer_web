import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, MapPin, ArrowRight } from "lucide-react";
import { Logo, Brand } from "./bits";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "How it works", to: "/how-it-works" },
  { label: "About", to: "/about" },
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
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <div className="flex min-h-[100dvh] flex-col font-sans selection:bg-primary/20 selection:text-primary-dark">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm py-2"
            : "bg-transparent border-transparent py-4"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 transform transition-transform hover:scale-105 active:scale-95">
            <Brand light={false} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "text-[15px] font-bold transition-colors hover:text-primary",
                  pathname === n.to ? "text-primary" : "text-slate-500"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/login"
              className="text-[15px] font-bold text-slate-600 transition-colors hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link 
              to="/order" 
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-2.5 text-[15px] font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95"
            >
              Order now
            </Link>
          </div>

          <button
            className="text-slate-900 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="absolute inset-x-0 top-full border-b border-slate-100 bg-white px-4 py-4 md:hidden shadow-2xl">
            <div className="flex flex-col gap-2">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-xl px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                  {n.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-100" />
              <Link to="/login" className="rounded-xl px-4 py-3 text-base font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                Sign in
              </Link>
              <Link to="/order" className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3.5 text-base font-bold text-white">
                Order now
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[#5c4fff] text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white p-2 rounded-xl">
                <Logo className="text-2xl text-primary" />
              </div>
              <span className="text-2xl font-black tracking-tight">KadaDine</span>
            </div>
            <p className="max-w-md text-[15px] font-medium text-indigo-100 leading-relaxed mb-8">
              Order food from the best kitchens near you, with live tracking from
              the stove to your doorstep.
            </p>
            
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-sm backdrop-blur-md">
              <p className="text-sm font-bold mb-3 uppercase tracking-wider text-indigo-200">Newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-colors"
                />
                <button className="bg-white text-indigo-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterCol title="Company" links={[["About Us", "/about"], ["Investor Relations", "/investor-relations"], ["Contact Us", "/contact"], ["How It Works", "/how-it-works"]]} />
            <FooterCol title="Legal" links={[["Privacy Policy", "/legal/privacy"], ["Terms of Service", "/legal/terms"], ["Refund Policy", "/legal/refund"], ["Delete Account", "/delete-account"]]} />
            <FooterCol title="Get Started" links={[["Order Now", "/order"], ["Sign In", "/login"], ["Add Restaurant", "/add-restaurant"], ["Partner with us", "/partner"]]} />
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-indigo-200">
            © {new Date().getFullYear()} KadaDine Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span> All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-widest text-white mb-6">{title}</p>
      <ul className="space-y-4">
        {links.map(([label, to]) => (
          <li key={to}>
            <Link to={to} className="text-[15px] font-semibold text-indigo-100 transition-colors hover:text-white flex items-center gap-1 group">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
