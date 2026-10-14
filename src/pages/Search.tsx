import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, Frown, Sparkles, Star, SlidersHorizontal } from "lucide-react";
import type { Restaurant } from "@/types";
import { discoverNearby, getCachedResults } from "@/services/discovery";
import { getDiscoveryLocation } from "@/services/location";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard, VegDot } from "@/components/bits";
import { displayRating } from "@/types";

const TRENDING = ["Biryani", "Pizza", "Burger", "Ice Cream", "Healthy", "North Indian", "South Indian", "Dessert"];

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
      (r.cuisine ?? "").toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q)
    );
  });

  if (vegOnly) {
    filtered = filtered.filter((r) => r.cuisine?.toLowerCase().includes("veg"));
  }

  if (topRated) {
    filtered = filtered.filter((r) => (displayRating(r) ?? 0) >= 4.0);
  }

  if (sortBy === "distance") {
    filtered.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => (displayRating(b) ?? -1) - (displayRating(a) ?? -1));
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                autoFocus
              />
            </div>
          </div>

          {/* Filter Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setVegOnly((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                vegOnly
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <VegDot veg /> Pure Veg
            </button>

            <button
              onClick={() => setTopRated((r) => !r)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                topRated
                  ? "border-amber-500 bg-amber-50 text-amber-800 shadow-xs"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Top Rated (4.0+)
            </button>

            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700">
              <span className="text-slate-400">Sort:</span>
              <button
                onClick={() => setSortBy("distance")}
                className={sortBy === "distance" ? "text-primary font-black" : "text-slate-600"}
              >
                Nearest
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setSortBy("rating")}
                className={sortBy === "rating" ? "text-primary font-black" : "text-slate-600"}
              >
                Rating
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : !query.trim() ? (
          /* Empty / Idle State with Trending suggestions */
          <div className="py-12 space-y-8 max-w-2xl mx-auto text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
              <img
                src="/character-1.jpg"
                alt="Search Mascot"
                className="relative w-full h-full object-cover rounded-full mix-blend-multiply"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">What are you craving?</h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Search for favorite restaurants, biryani, burgers, cakes and more.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Trending Searches
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {TRENDING.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleSearch(t)}
                    className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:border-primary hover:text-primary transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-slate-100 bg-white p-8 shadow-xs">
            <Frown className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-black text-slate-800">No restaurants found</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Try searching with another keyword or resetting filters.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Found {filtered.length} matching place{filtered.length === 1 ? "" : "s"}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
