import { Link } from "react-router-dom";
import { Sparkles, Calendar, Clock, Utensils, Tag, HeartHandshake, ShieldCheck, ArrowRight } from "lucide-react";

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white pt-16 sm:pt-20 pb-16 sm:pb-20 select-none border-t border-blue-100/60">
      {/* ── Ambient Glow Elements ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute top-12 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* ── Section Header ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          The Kada Experience
        </span>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          What&apos;s waiting for you<br className="hidden sm:inline" /> on the{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kada app
          </span>
          ?
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-semibold text-slate-500 max-w-xl mx-auto leading-relaxed">
          Our app is packed with features that enable you to experience food delivery & dining like never before
        </p>
      </div>

      {/* ── Main Showcase Stage ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        {/* Desktop / Tablet Layout: 3 Columns (Left Features | Central Phone | Right Features) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
          {/* Left Feature Column (4 Cards) */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {/* Card 1: Healthy */}
            <Link
              to="/search?q=Healthy"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Healthy Bowl Graphic */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <path
                    d="M12 34C12 46 22 54 32 54C42 54 52 46 52 34H12Z"
                    fill="#FDE68A"
                    stroke="#D97706"
                    strokeWidth="2.5"
                  />
                  <ellipse cx="32" cy="34" rx="20" ry="6" fill="#F59E0B" opacity="0.3" />
                  {/* Leaves */}
                  <path
                    d="M20 28C18 20 26 18 28 26C30 18 38 20 36 28"
                    fill="#10B981"
                    stroke="#047857"
                    strokeWidth="2"
                  />
                  {/* Tomato / berries */}
                  <circle cx="25" cy="30" r="4" fill="#EF4444" />
                  <circle cx="38" cy="29" r="4.5" fill="#F97316" />
                  <circle cx="32" cy="27" r="3.5" fill="#84CC16" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Healthy
              </span>
            </Link>

            {/* Card 2: Veg Mode */}
            <Link
              to="/order?veg=true"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Green iOS-style Switch Toggle */}
                <div className="w-12 h-7 bg-emerald-600 rounded-full flex items-center justify-end px-1 shadow-md">
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  </div>
                </div>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                Veg Mode
              </span>
            </Link>

            {/* Card 3: Plan a Party */}
            <Link
              to="/search?q=Party"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-amber-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Party Feast Graphic */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  {/* Drinks */}
                  <path d="M16 22L19 40H27L30 22H16Z" fill="#3B82F6" />
                  <path d="M21 16L24 22H27" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                  {/* Burger / Feast */}
                  <path d="M30 42C30 36 48 36 48 42H30Z" fill="#F59E0B" />
                  <rect x="32" y="44" width="14" height="3" rx="1.5" fill="#10B981" />
                  <path d="M30 49C30 52 48 52 48 49H30Z" fill="#D97706" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Plan a Party
              </span>
            </Link>

            {/* Card 4: Gift Cards */}
            <Link
              to="/account"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Blue Gift Envelope with Gold Ribbon */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <rect x="14" y="22" width="36" height="26" rx="4" fill="#2563EB" />
                  <path d="M14 26L32 38L50 26" stroke="#BFDBFE" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="32" cy="38" r="3" fill="#FBBF24" />
                  {/* Golden Sparkles */}
                  <path d="M42 16L44 20L48 22L44 24L42 28L40 24L36 22L40 20Z" fill="#F59E0B" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Gift Cards
              </span>
            </Link>
          </div>

          {/* Center Column: iPhone Mockup with "Schedule your order" */}
          <div className="col-span-4 flex justify-center">
            <div className="relative w-72 sm:w-80 rounded-[3rem] bg-slate-950 p-3 shadow-2xl shadow-primary/20 border-4 border-slate-800 ring-1 ring-white/20">
              {/* Dynamic Island Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3 border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
                <div className="w-2 h-2 rounded-full bg-blue-500/80 animate-pulse" />
              </div>

              {/* Phone Screen */}
              <div className="relative rounded-[2.3rem] overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-indigo-50/40 pt-14 pb-8 px-5 min-h-[460px] flex flex-col items-center justify-center text-center">
                {/* Status Bar */}
                <div className="absolute top-4 inset-x-8 flex items-center justify-between text-[10px] font-black text-slate-600">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>5G</span>
                  </div>
                </div>

                {/* "Schedule your order" Centerpiece Card */}
                <div className="w-full rounded-3xl bg-white p-6 shadow-xl border border-blue-100/80 flex flex-col items-center justify-center transform transition-transform hover:scale-105 duration-300">
                  {/* Calendar Graphic with Clock Badge */}
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none">
                        {/* Calendar Body */}
                        <rect x="12" y="16" width="40" height="36" rx="6" fill="#3B82F6" opacity="0.9" />
                        <rect x="12" y="24" width="40" height="28" rx="4" fill="#FFFFFF" />
                        {/* Rings */}
                        <circle cx="20" cy="14" r="2.5" fill="#1D4ED8" />
                        <circle cx="32" cy="14" r="2.5" fill="#1D4ED8" />
                        <circle cx="44" cy="14" r="2.5" fill="#1D4ED8" />
                        {/* Calendar Grid dots */}
                        <circle cx="20" cy="32" r="2" fill="#93C5FD" />
                        <circle cx="28" cy="32" r="2" fill="#93C5FD" />
                        <circle cx="36" cy="32" r="2" fill="#93C5FD" />
                        <circle cx="44" cy="32" r="2" fill="#93C5FD" />
                        <circle cx="20" cy="40" r="2" fill="#93C5FD" />
                        <circle cx="28" cy="40" r="2" fill="#93C5FD" />
                        <circle cx="36" cy="40" r="2" fill="#3B82F6" />
                        <circle cx="44" cy="40" r="2" fill="#93C5FD" />
                      </svg>
                    </div>
                    {/* Clock badge in Primary Blue */}
                    <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-primary border-2 border-white shadow-md flex items-center justify-center text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    Schedule<br />your order
                  </h4>
                  <p className="mt-1 text-[11px] font-semibold text-slate-500">
                    Pre-order for family parties, office lunch & late dinners
                  </p>
                </div>

                <Link
                  to="/order"
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3 text-xs font-black text-white shadow-lg shadow-primary/25 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Order on App Now
                </Link>
              </div>
            </div>
          </div>

          {/* Right Feature Column (4 Cards) */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {/* Card 5: Gourmet */}
            <Link
              to="/search?q=Gourmet"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Gourmet Plate with Garnish */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <ellipse cx="32" cy="40" rx="22" ry="10" fill="#E2E8F0" />
                  <ellipse cx="32" cy="38" rx="18" ry="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                  {/* Pasta swirl */}
                  <ellipse cx="32" cy="35" rx="10" ry="5" fill="#FDE047" />
                  <path d="M28 34C32 30 36 34 38 31" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
                  {/* Mint leaf garnish */}
                  <path d="M32 28C30 25 34 24 35 27" fill="#10B981" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Gourmet
              </span>
            </Link>

            {/* Card 6: Offers */}
            <Link
              to="/order"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Discount Tag with % and Sparkles */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <path
                    d="M18 20L36 12L50 26L32 34L18 20Z"
                    fill="#3B82F6"
                    stroke="#1D4ED8"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="42" cy="20" r="2.5" fill="#FFFFFF" />
                  <text x="25" y="27" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">
                    %
                  </text>
                  <path d="M46 36L48 40L52 42L48 44L46 48L44 44L40 42L44 40Z" fill="#F59E0B" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                Offers
              </span>
            </Link>

            {/* Card 7: Table Booking (Replaced Food on Train) */}
            <Link
              to="/order?vertical=dining"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Dining Table with Cloche & Candle Graphic */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  {/* Table Surface */}
                  <rect x="14" y="38" width="36" height="4" rx="2" fill="#2563EB" />
                  <path d="M22 42L18 52H22L25 42H22Z" fill="#1D4ED8" />
                  <path d="M42 42L46 52H42L39 42H42Z" fill="#1D4ED8" />
                  {/* Food Cloche Dome */}
                  <path d="M22 38C22 28 42 28 42 38H22Z" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1.5" />
                  <circle cx="32" cy="27" r="2.5" fill="#1E40AF" />
                  {/* Sparkling Stars */}
                  <path d="M46 22L47.5 25.5L51 27L47.5 28.5L46 32L44.5 28.5L41 27L44.5 25.5Z" fill="#F59E0B" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Table Booking
              </span>
            </Link>

            {/* Card 8: Collections */}
            <Link
              to="/search"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-50 to-blue-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Stacked recipe / dish cards */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  {/* Back Card */}
                  <rect x="22" y="16" width="28" height="22" rx="4" fill="#FDE68A" transform="rotate(8 22 16)" />
                  {/* Front Card */}
                  <rect x="16" y="22" width="30" height="24" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  {/* Mini burger inside card */}
                  <ellipse cx="31" cy="34" rx="7" ry="3" fill="#F59E0B" />
                  <rect x="25" y="33" width="12" height="1.5" fill="#10B981" />
                  {/* Ribbon bookmark in blue */}
                  <path d="M38 22V30L41 28L44 30V22H38Z" fill="#2563EB" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                Collections
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile & Tablet Slider / Grid Layout */}
        <div className="lg:hidden space-y-6">
          {/* Phone Mockup Center for Mobile */}
          <div className="flex justify-center">
            <div className="relative w-64 rounded-[2.5rem] bg-slate-950 p-2.5 shadow-2xl shadow-primary/20 border-4 border-slate-800">
              <div className="rounded-[2rem] bg-gradient-to-b from-blue-50/60 to-indigo-50/40 p-4 pt-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-2 shadow-inner border border-blue-100 text-primary">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Schedule your order</h4>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">
                  Pre-order food for your exact arrival time
                </p>
                <Link
                  to="/order"
                  className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 py-2.5 text-[11px] font-black text-white shadow-md shadow-primary/25 active:scale-95 transition-transform"
                >
                  Order on App
                </Link>
              </div>
            </div>
          </div>

          {/* 8 Feature Pills Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {[
              { name: "Healthy", q: "Healthy", icon: "🥗", to: "/search?q=Healthy" },
              { name: "Veg Mode", q: "Pure Veg", icon: "🌿", to: "/order?veg=true" },
              { name: "Plan a Party", q: "Party", icon: "🎉", to: "/search?q=Party" },
              { name: "Gift Cards", q: "Gifts", icon: "🎁", to: "/account" },
              { name: "Gourmet", q: "Gourmet", icon: "🍷", to: "/search?q=Gourmet" },
              { name: "Offers", q: "Offers", icon: "🏷️", to: "/order" },
              { name: "Table Booking", q: "Dining", icon: "🍽️", to: "/order?vertical=dining" },
              { name: "Collections", q: "Collections", icon: "⭐", to: "/search" },
            ].map((f) => (
              <Link
                key={f.name}
                to={f.to}
                className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-primary/40 text-center transition-all active:scale-95"
              >
                <span className="text-xl sm:text-2xl mb-1">{f.icon}</span>
                <span className="text-[10px] sm:text-[11px] font-black text-slate-800 line-clamp-1 leading-tight">{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
