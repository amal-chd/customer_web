import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Globe, Heart, ArrowUp, ExternalLink } from "lucide-react";
import { getVendorOnboardingUrl } from "@/lib/urls";

export const Footer: React.FC = () => {
  const [country, setCountry] = useState("India");
  const [lang, setLang] = useState("EN");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 overflow-hidden relative border-t border-slate-800 selection:bg-blue-600/30 selection:text-white">
      {/* Ambient Top Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-10 sm:pb-12">
        {/* ─── 1. TOP BAR: BRAND + PRODUCT TAG + DYNAMIC STATUS + REGION ─────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-slate-800/80">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0">
                <img
                  src="/logo.png"
                  alt="The Kada Logo"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter text-white">
                The <span className="text-blue-500">Kada</span>
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Customer App
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Order food and chef specials from top local kitchens and restaurants near you. Built for transparent pricing, live kitchen tracking, and lightning-fast hyperlocal delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Region Switcher */}
            <button
              type="button"
              onClick={() => setCountry((c) => (c === "India" ? "Global" : "India"))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <span>{country === "India" ? "🇮🇳 India" : "🌐 Global"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang((l) => (l === "EN" ? "ML" : "EN"))}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>{lang === "EN" ? "English" : "മലയാളം"}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* ─── 2. 5-COLUMN LINK GRID DIRECTLY STANDARDIZED ───────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Col 1: About Platform */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white mb-4">
              About Platform
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Who We Are</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Our Mission</Link>
              </li>
              <li>
                <Link to="/investor-relations" className="hover:text-white transition-colors">Investor Relations</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-white transition-colors">Order Discovery</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Kadaverse */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white mb-4">
              Kadaverse
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/" className="text-blue-400 font-bold">The Kada</Link>
              </li>
              <li>
                <a href="https://kadadine.thekada.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Kada Dine</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://rider.thekada.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Kada Rider</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://host.thekada.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Kada Host</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://thekada.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>The Kada Corp</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: For Partners */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white mb-4">
              For Partners
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/add-restaurant" className="hover:text-white transition-colors">Add Restaurant</Link>
              </li>
              <li>
                <Link to="/partner" className="hover:text-white transition-colors">Partner With Us</Link>
              </li>
              <li>
                <a href={getVendorOnboardingUrl("/signup")} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Vendor Onboarding</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href={getVendorOnboardingUrl("/login")} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Vendor Dashboard</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://rider.thekada.in/join" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Apply to Deliver</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
              <li>
                <a href="https://host.thekada.in/login" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Hotel Host Portal</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal */}
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white mb-4">
              Trust & Legal
            </p>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-400">
              <li>
                <Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/legal/refund" className="hover:text-white transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/legal/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/delete-account" className="hover:text-white transition-colors">Delete Account</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Community & App Downloads */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs font-black uppercase tracking-widest text-white mb-4">
              Community & Apps
            </p>

            {/* Social Icons with Real Brand SVGs */}
            <div className="flex items-center gap-2.5 mb-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] transition-all hover:scale-110 active:scale-95 shadow-xs border border-slate-800"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-black hover:ring-1 hover:ring-slate-700 transition-all hover:scale-110 active:scale-95 shadow-xs border border-slate-800"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-[#FF0000] transition-all hover:scale-110 active:scale-95 shadow-xs border border-slate-800"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-[#0A66C2] transition-all hover:scale-110 active:scale-95 shadow-xs border border-slate-800"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            </div>

            {/* Official Store Download Badges */}
            <div className="space-y-2">
              <a
                href="https://apple.com/app-store"
                target="_blank"
                rel="noreferrer"
                aria-label="Download on the App Store"
                className="flex items-center gap-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white py-2 px-3 hover:bg-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              >
                <svg className="h-5 w-5 shrink-0 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.49 2.65-1.23z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">Download on the</span>
                  <span className="block text-xs font-black text-white">App Store</span>
                </div>
              </a>

              <a
                href="https://play.google.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Get it on Google Play"
                className="flex items-center gap-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white py-2 px-3 hover:bg-slate-800 hover:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.22-.924V2.738c0-.348.08-.667.22-.924z" />
                  <path fill="#34A853" d="M15.206 13.412l2.253 2.253-11.45 6.442 9.197-8.695z" />
                  <path fill="#EA4335" d="M15.206 10.588L6.01 1.892l11.45 6.442-2.254 2.254z" />
                  <path fill="#FBBC04" d="M16.62 12l3.52-1.98a1.996 1.996 0 0 1 0 3.96L16.62 12z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">GET IT ON</span>
                  <span className="block text-xs font-black text-white">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* ─── 4. BOTTOM LEGAL & ATTRIBUTION BAR ──────────────────────────────── */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <p>
              By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy, and Content Guidelines.
            </p>
            <p className="text-slate-400">
              © {new Date().getFullYear()} The Kada Digital Ventures Private Limited. All rights reserved. · Kannur, Kerala 670001, India
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1 text-slate-400">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for food lovers & local merchants</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
