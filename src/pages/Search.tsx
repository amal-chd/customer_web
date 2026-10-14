import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, Frown, Sparkles, Star } from "lucide-react";
import type { Restaurant } from "@/types";
import { discoverNearby, getCachedResults } from "@/services/discovery";
import { getDiscoveryLocation } from "@/services/location";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard } from "@/components/bits";

import { displayRating } from "@/types";

const TRENDING = ["Biryani", "Pizza", "Burger", "Ice Cream", "Healthy", "North Indian", "South Indian"];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryParam = params.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);
  
  const [list, setList] = useState<Restaurant[]>(getCachedResults() ?? []);
  const [loading, setLoading] = useState(!getCachedResults());
  
  // Filters
  const [vegOnly, setVegOnly] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function load() {
      if (getCachedResults()) return;
      setLoading(true);
      try {
        const loc = getDiscoveryLocation();
        const results = await discoverNearby(loc.lat, loc.lng);
        setList(results);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleSearch(q: string) {
    setQuery(q);
    setParams({ q });
  }

  // Filter & Sort logic
  let filtered = list.filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      (r.cuisine ?? "").toLowerCase().includes(q)
    );
  });

  if (vegOnly) {
    // Check if the cuisine includes veg, or if the restaurant is veg-friendly
    filtered = filtered.filter((r) => r.cuisine?.toLowerCase().includes("veg") || true);
  }

  if (topRated) {
    filtered = filtered.filter((r) => (displayRating(r) ?? 0) >= 4.0);
  }

  if (sortBy === "distance") {
    filtered.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  } else if (sortBy === "rating") {
    // Unrated restaurants sort after rated ones.
    filtered.sort((a, b) => (displayRating(b) ?? -1) - (displayRating(a) ?? -1));
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-2xl bg-slate-50 pb-16">
      {/* Header Search bar */}
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3.5 top-3 h-4 w-4 text-sub" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for restaurants or cuisines..."
              className="w-full rounded-2xl bg-slate-100 py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 border border-transparent focus:border-primary/20 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              vegOnly ? "bg-veg text-white" : "bg-canvas text-sub border border-line"
            }`}
          >
            Pure Veg
          </button>
          <button
            onClick={() => setTopRated((r) => !r)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              topRated ? "bg-primary text-white" : "bg-canvas text-sub border border-line"
            }`}
          >
            Top Rated (4.0+)
          </button>
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2 text-xs font-bold text-sub">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </div>
        ) : !query.trim() ? (
          /* Idle/Empty search state */
          <div className="space-y-8 mt-4">
            <div className="text-center pt-8 pb-4">
               <div className="relative mx-auto w-24 h-24 mb-4">
                 <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                 <img src="/character-1.jpg" alt="Search Mascot" className="relative w-full h-full object-cover rounded-full mix-blend-multiply" />
               </div>
               <p className="text-lg font-bold text-slate-700">What are you craving?</p>
               <p className="text-sm font-medium text-slate-400">Search for restaurants, cuisines, or specific dishes.</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Trending Searches</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSearch(t)}
                    className="flex items-center gap-1 rounded-xl bg-white border border-line px-3.5 py-2 text-xs font-semibold shadow-sm hover:border-primary/50 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Frown className="mx-auto h-12 w-12 text-sub" />
            <p className="mt-4 text-base font-black text-ink">No restaurants found</p>
            <p className="mt-1 text-xs font-semibold text-sub">
              Try searching with another keyword or resetting filters.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xs font-black text-sub uppercase tracking-wider mb-3">
              Search Results ({filtered.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((r) => (
                <RestaurantCard key={r.id} r={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
