export function BetterFoodSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-10 sm:pt-16 pb-12 sm:pb-16 z-20 select-none">
      {/* ── Floating Playful Food Stickers (Smooth multi-speed float keyframes) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* 1. Fresh Basil Leaf (Top Left) */}
        <div className="absolute top-4 sm:top-8 left-[18%] sm:left-[26%] w-7 h-7 sm:w-10 sm:h-10 animate-float-slow opacity-95">
          <img
            src="/zomato_assets/basil.png"
            alt="Basil leaf"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </div>

        {/* 2. Juicy Burger (Mid-Left) */}
        <div className="absolute top-16 sm:top-20 left-2 sm:left-[8%] w-16 h-16 sm:w-24 sm:h-24 animate-float opacity-95">
          <img
            src="/zomato_assets/burger.png"
            alt="Burger"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </div>

        {/* 3. Steaming Dim Sum Basket (Top Right) */}
        <div className="absolute top-4 sm:top-6 right-3 sm:right-[10%] w-18 h-18 sm:w-26 sm:h-26 animate-float-reverse opacity-95">
          <img
            src="/zomato_assets/dimsum.png"
            alt="Dim sum"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </div>

        {/* 4. Tomato Slice (Mid Right) */}
        <div className="absolute top-28 sm:top-36 right-[10%] sm:right-[18%] w-6 h-6 sm:w-8 sm:h-8 animate-float-fast opacity-90">
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato slice"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </div>

        {/* 5. Cherry Tomato (Bottom Left) */}
        <div className="absolute bottom-20 sm:bottom-24 left-[10%] sm:left-[20%] w-5 h-5 sm:w-7 sm:h-7 animate-float opacity-90">
          <img
            src="/zomato_assets/tomato.png"
            alt="Tomato"
            className="w-full h-full object-contain filter drop-shadow-sm"
            loading="lazy"
          />
        </div>

        {/* 6. Crispy Pizza Slice (Bottom Right) */}
        <div className="absolute bottom-10 sm:bottom-12 right-2 sm:right-[8%] w-20 h-20 sm:w-28 sm:h-28 animate-wobble-slow opacity-95">
          <img
            src="/zomato_assets/pizza.png"
            alt="Pizza slice"
            className="w-full h-full object-contain filter drop-shadow-md"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── Section Content in The Kada Style ── */}
      <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
          The Kada Quality
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Better food for{" "}
          <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            everyone
          </span>
        </h2>

        <p className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-500 max-w-md mx-auto leading-relaxed">
          Connecting you with authentic restaurants, cloud kitchens, and iconic food spots delivered fresh across the state
        </p>

        {/* ── Stacked & Tilted Playful Stat Badges in The Kada Royal Blue Palette ── */}
        <div className="relative mx-auto mt-10 sm:mt-12 w-full max-w-xs sm:max-w-sm h-52 sm:h-60">
          {/* Card 1: 500+ Verified Restaurants (Top-Left, tilted -2deg) */}
          <div className="absolute top-0 left-0 z-10 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-slate-100 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 w-[240px] sm:w-[260px]">
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                500+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                top restaurants
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
              <img
                src="/zomato_assets/store_icon.png"
                alt="Restaurants"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Card 2: 14 Districts Covered (Tilted +4.5deg, overlapping right) */}
          <div className="absolute top-12 sm:top-14 right-0 z-20 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_12px_36px_rgba(37,99,235,0.08)] border border-blue-50 transform rotate-[4.5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 w-[205px] sm:w-[225px]">
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                14 Districts
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                across Kerala
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
              <img
                src="/zomato_assets/pin_icon.png"
                alt="Districts"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Card 3: 1 Million+ orders delivered (Tilted -1deg, overlapping bottom) */}
          <div className="absolute top-26 sm:top-30 left-3 sm:left-5 z-30 flex items-center justify-between gap-4 rounded-2xl bg-white px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_14px_40px_rgba(15,23,42,0.08)] border border-slate-100 transform -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 w-[250px] sm:w-[270px]">
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1 Million+
              </p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">
                orders delivered
              </p>
            </div>
            <div className="h-10 w-10 shrink-0">
              <img
                src="/zomato_assets/bag_icon.png"
                alt="Orders delivered"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
