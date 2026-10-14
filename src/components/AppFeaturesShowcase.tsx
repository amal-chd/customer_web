import { Link } from "react-router-dom";
import { Sparkles, Calendar, Clock } from "lucide-react";

export function AppFeaturesShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff2f3] via-[#fff8f8] to-white pt-16 sm:pt-20 pb-12 select-none border-t border-rose-100/50">
      {/* ── Section Header ── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#e23744] tracking-tight leading-tight">
          What&apos;s waiting for you<br className="hidden sm:inline" /> on the app?
        </h2>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
          Our app is packed with features that enable you to experience food delivery like never before
        </p>
      </div>

      {/* ── Main Showcase Stage ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        {/* Desktop / Tablet Layout: 3 Columns (Left Features | Central Phone | Right Features) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-center">
          {/* Left Feature Column (4 Cards) */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            {/* Card 1: Healthy */}
            <Link
              to="/search?q=Healthy"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
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
              <span className="text-sm font-black text-slate-800 group-hover:text-[#e23744] transition-colors">
                Healthy
              </span>
            </Link>

            {/* Card 2: Veg Mode */}
            <Link
              to="/order?veg=true"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
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
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-50 to-amber-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Party Feast Graphic */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  {/* Drinks */}
                  <path d="M16 22L19 40H27L30 22H16Z" fill="#F43F5E" />
                  <path d="M21 16L24 22H27" stroke="#FDA4AF" strokeWidth="2" strokeLinecap="round" />
                  {/* Burger / Feast */}
                  <path d="M30 42C30 36 48 36 48 42H30Z" fill="#F59E0B" />
                  <rect x="32" y="44" width="14" height="3" rx="1.5" fill="#10B981" />
                  <path d="M30 49C30 52 48 52 48 49H30Z" fill="#D97706" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-[#e23744] transition-colors">
                Plan a Party
              </span>
            </Link>

            {/* Card 4: Gift Cards */}
            <Link
              to="/account"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Red Gift Envelope with Gold Ribbon */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <rect x="14" y="22" width="36" height="26" rx="4" fill="#E11D48" />
                  <path d="M14 26L32 38L50 26" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="32" cy="38" r="3" fill="#FBBF24" />
                  {/* Golden Sparkles */}
                  <path d="M42 16L44 20L48 22L44 24L42 28L40 24L36 22L40 20Z" fill="#F59E0B" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-[#e23744] transition-colors">
                Gift Cards
              </span>
            </Link>
          </div>

          {/* Center Column: iPhone Mockup with "Schedule your order" */}
          <div className="col-span-4 flex justify-center">
            <div className="relative w-72 sm:w-80 rounded-[3rem] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/20">
              {/* Speaker Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 mr-2" />
                <div className="w-8 h-1.5 rounded-full bg-slate-800" />
              </div>

              {/* Phone Screen */}
              <div className="relative rounded-[2.3rem] overflow-hidden bg-gradient-to-b from-slate-50 to-rose-50/30 pt-14 pb-8 px-5 min-h-[460px] flex flex-col items-center justify-center text-center">
                {/* "Schedule your order" Centerpiece Card */}
                <div className="w-full rounded-3xl bg-white p-6 shadow-xl border border-rose-100/60 flex flex-col items-center justify-center transform transition-transform hover:scale-105 duration-300">
                  {/* Calendar Graphic with Clock */}
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-100 flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none">
                        {/* Calendar Body */}
                        <rect x="12" y="16" width="40" height="36" rx="6" fill="#F87171" opacity="0.9" />
                        <rect x="12" y="24" width="40" height="28" rx="4" fill="#FFFFFF" />
                        {/* Rings */}
                        <circle cx="20" cy="14" r="2.5" fill="#B91C1C" />
                        <circle cx="32" cy="14" r="2.5" fill="#B91C1C" />
                        <circle cx="44" cy="14" r="2.5" fill="#B91C1C" />
                        {/* Calendar Grid dots */}
                        <circle cx="20" cy="32" r="2" fill="#FCA5A5" />
                        <circle cx="28" cy="32" r="2" fill="#FCA5A5" />
                        <circle cx="36" cy="32" r="2" fill="#FCA5A5" />
                        <circle cx="44" cy="32" r="2" fill="#FCA5A5" />
                        <circle cx="20" cy="40" r="2" fill="#FCA5A5" />
                        <circle cx="28" cy="40" r="2" fill="#FCA5A5" />
                        <circle cx="36" cy="40" r="2" fill="#FCA5A5" />
                        <circle cx="44" cy="40" r="2" fill="#FCA5A5" />
                      </svg>
                    </div>
                    {/* Clock badge */}
                    <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    Schedule<br />your order
                  </h4>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    Pre-order for family parties, office lunch & late dinners
                  </p>
                </div>

                <Link
                  to="/order"
                  className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#e23744] to-rose-600 py-3 text-xs font-black text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
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
              <span className="text-sm font-black text-slate-800 group-hover:text-[#e23744] transition-colors">
                Gourmet
              </span>
            </Link>

            {/* Card 6: Offers */}
            <Link
              to="/order"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
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

            {/* Card 7: Express Delivery / Food on Train */}
            <Link
              to="/order"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Modern Express Train Front */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  <path
                    d="M20 18C20 14 24 12 32 12C40 12 44 14 44 18V44C44 48 40 50 32 50C24 50 20 48 20 44V18Z"
                    fill="#1E40AF"
                  />
                  {/* Train windshield */}
                  <rect x="24" y="18" width="16" height="12" rx="3" fill="#93C5FD" />
                  {/* Headlights */}
                  <circle cx="26" cy="40" r="2.5" fill="#FDE047" />
                  <circle cx="38" cy="40" r="2.5" fill="#FDE047" />
                  <rect x="28" y="44" width="8" height="2" fill="#E2E8F0" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition-colors">
                Food on Train
              </span>
            </Link>

            {/* Card 8: Collections */}
            <Link
              to="/search"
              className="group flex flex-col items-center justify-center p-5 rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-50 to-rose-100 flex items-center justify-center p-2 mb-3 shadow-inner">
                {/* Stacked recipe / dish cards */}
                <svg viewBox="0 0 64 64" className="h-12 w-12" fill="none">
                  {/* Back Card */}
                  <rect x="22" y="16" width="28" height="22" rx="4" fill="#FDE68A" transform="rotate(8 22 16)" />
                  {/* Front Card */}
                  <rect x="16" y="22" width="30" height="24" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  {/* Mini burger inside card */}
                  <ellipse cx="31" cy="34" rx="7" ry="3" fill="#F59E0B" />
                  <rect x="25" y="33" width="12" height="1.5" fill="#10B981" />
                  {/* Ribbon bookmark */}
                  <path d="M38 22V30L41 28L44 30V22H38Z" fill="#E11D48" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800 group-hover:text-[#e23744] transition-colors">
                Collections
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile & Tablet Slider / Grid Layout */}
        <div className="lg:hidden space-y-6">
          {/* Phone Mockup Center for Mobile */}
          <div className="flex justify-center">
            <div className="relative w-64 rounded-[2.5rem] bg-slate-950 p-2.5 shadow-2xl border-4 border-slate-800">
              <div className="rounded-[2rem] bg-gradient-to-b from-slate-50 to-rose-50/40 p-4 pt-8 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-2 shadow-inner border border-rose-100">
                  <Calendar className="h-8 w-8 text-rose-500" />
                </div>
                <h4 className="text-sm font-black text-slate-900">Schedule your order</h4>
                <p className="mt-1 text-[10px] font-semibold text-slate-400">
                  Pre-order food for your exact arrival time
                </p>
                <Link
                  to="/order"
                  className="mt-4 w-full rounded-xl bg-[#e23744] py-2.5 text-[11px] font-black text-white shadow-md shadow-rose-500/25"
                >
                  Order on App
                </Link>
              </div>
            </div>
          </div>

          {/* 8 Feature Pills Grid */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { name: "Healthy", q: "Healthy", icon: "🥗" },
              { name: "Veg Mode", q: "Pure Veg", icon: "🌿" },
              { name: "Plan a Party", q: "Party", icon: "🎉" },
              { name: "Gift Cards", q: "Gifts", icon: "🎁" },
              { name: "Gourmet", q: "Gourmet", icon: "🍷" },
              { name: "Offers", q: "Offers", icon: "🏷️" },
              { name: "Food on Train", q: "Train", icon: "🚆" },
              { name: "Collections", q: "Collections", icon: "⭐" },
            ].map((f) => (
              <Link
                key={f.name}
                to={`/search?q=${encodeURIComponent(f.q)}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-rose-200 text-center"
              >
                <span className="text-2xl mb-1">{f.icon}</span>
                <span className="text-[11px] font-black text-slate-800 line-clamp-1">{f.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Decorative Arc with Kada Gold Coins ── */}
      <div className="relative mt-12 sm:mt-16 w-full">
        {/* Curving dark slope footer */}
        <div className="relative h-16 sm:h-24 w-full bg-slate-950 overflow-hidden rounded-t-[50%_100%]">
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10" />
        </div>

        {/* Left Golden Coin Accent */}
        <div className="absolute -bottom-6 left-4 sm:left-12 h-20 w-20 sm:h-32 sm:w-32 z-20 pointer-events-none transform -rotate-12 transition-transform hover:scale-105">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 p-1.5 shadow-2xl ring-4 ring-amber-200/50 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-2 border-dashed border-amber-600/40 bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-inner">
              <span className="text-2xl sm:text-4xl font-black text-amber-900 drop-shadow-sm">K</span>
            </div>
          </div>
        </div>

        {/* Right Golden Coin Accent */}
        <div className="absolute -bottom-6 right-4 sm:right-12 h-24 w-24 sm:h-36 sm:w-36 z-20 pointer-events-none transform rotate-12 transition-transform hover:scale-105">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 p-2 shadow-2xl ring-4 ring-amber-300/60 flex items-center justify-center">
            <div className="h-full w-full rounded-full border-2 border-dashed border-amber-700/40 bg-gradient-to-tr from-yellow-300 to-amber-500 flex items-center justify-center shadow-inner">
              <span className="text-3xl sm:text-5xl font-black text-amber-950 drop-shadow-sm">₹</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
