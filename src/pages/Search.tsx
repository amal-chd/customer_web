import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Search as SearchIcon,
  Frown,
  Sparkles,
  Star,
  SlidersHorizontal,
  Clock,
  History,
  X,
  Plus,
  Minus,
  UtensilsCrossed,
  Store,
} from "lucide-react";
import type { Restaurant, MenuItem, MenuVariant } from "@/types";
import { discoverNearby, getCachedResults, fetchMenuForRestaurants } from "@/services/discovery";
import { getDiscoveryLocation } from "@/services/location";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard, VegDot } from "@/components/bits";
import { displayRating } from "@/types";
import { useCart } from "@/context/CartContext";
import { menuItemImage } from "@/lib/foodImages";
import { formatMoney } from "@/lib/currency";
import { toast } from "@/components/Toast";

const TRENDING = [
  "Biryani",
  "Chicken Biryani",
  "Pizza",
  "Burger",
  "Shawarma",
  "Porotta",
  "Dosa",
  "Chinese",
  "Momos",
  "Cold Coffee",
  "Dessert",
  "Healthy",
];

const RECENT_KEY = "kada_recent_searches";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const cart = useCart();

  const queryParam = params.get("q") ?? "";
  const [query, setQuery] = useState(queryParam);

  const [restaurants, setRestaurants] = useState<Restaurant[]>(getCachedResults() ?? []);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "dishes" | "restaurants">("all");

  // Filters
  const [vegOnly, setVegOnly] = useState(false);
  const [topRated, setTopRated] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "distance" | "rating" | "price_asc">("relevance");

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [modalItem, setModalItem] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        let rests = getCachedResults();
        if (!rests || rests.length === 0) {
          const loc = getDiscoveryLocation();
          rests = await discoverNearby(loc.lat, loc.lng);
        }
        setRestaurants(rests);

        if (rests.length > 0) {
          const items = await fetchMenuForRestaurants(rests.slice(0, 15).map((r) => r.id));
          setMenuItems(items);
        }
      } catch (e) {
        console.error("Search data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  function handleSearch(q: string) {
    setQuery(q);
    setParams(q.trim() ? { q: q.trim() } : {});

    if (q.trim().length >= 2) {
      setRecentSearches((prev) => {
        const next = [q.trim(), ...prev.filter((item) => item.toLowerCase() !== q.trim().toLowerCase())].slice(0, 6);
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }

  function handleClearRecent() {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  }

  // Filter & Search Logic
  const filteredRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    let res = restaurants.filter((r) => {
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.cuisine ?? "").toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q)
      );
    });

    if (vegOnly) {
      res = res.filter((r) => (r.cuisine ?? "").toLowerCase().includes("veg"));
    }

    if (topRated) {
      res = res.filter((r) => (displayRating(r) ?? 0) >= 4.0);
    }

    if (sortBy === "distance") {
      res.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
    } else if (sortBy === "rating") {
      res.sort((a, b) => (displayRating(b) ?? -1) - (displayRating(a) ?? -1));
    }

    return res;
  }, [restaurants, query, vegOnly, topRated, sortBy]);

  const filteredDishes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    let res = menuItems.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        (m.description ?? "").toLowerCase().includes(q)
      );
    });

    if (vegOnly) {
      res = res.filter((m) => m.isVeg);
    }

    if (sortBy === "price_asc") {
      res.sort((a, b) => a.price - b.price);
    }

    return res;
  }, [menuItems, query, vegOnly, sortBy]);

  function handleAddDish(dish: MenuItem) {
    const parentRest = restaurants.find((r) => r.id === dish.restaurantId);
    if (!parentRest) {
      navigate(`/restaurant/${dish.restaurantId}`);
      return;
    }

    if (dish.variants.length > 0 || dish.addons.length > 0) {
      setModalItem({ item: dish, restaurant: parentRest });
      return;
    }

    if (cart.conflictsWith(parentRest)) {
      if (
        !confirm(
          `Your cart contains items from ${cart.restaurant?.name}. Replace cart with items from ${parentRest.name}?`
        )
      ) {
        return;
      }
      cart.clear();
    }

    cart.add(parentRest, dish);
    toast(`${dish.name} added to cart`);
  }

  const hasQuery = query.trim().length > 0;
  const totalResults = filteredRestaurants.length + filteredDishes.length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 antialiased selection:bg-primary/20 selection:text-primary">
      {/* Search Header */}
      <div className="sticky top-0 z-20 border-b border-slate-100 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for restaurants, groceries, biryani, pizza..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-10 text-sm font-bold text-slate-900 outline-none transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter & View Tabs */}
          {hasQuery && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                    activeTab === "all"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All ({totalResults})
                </button>
                <button
                  onClick={() => setActiveTab("dishes")}
                  className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                    activeTab === "dishes"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Dishes ({filteredDishes.length})
                </button>
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={`rounded-xl px-4 py-1.5 text-xs font-black transition-all ${
                    activeTab === "restaurants"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Restaurants ({filteredRestaurants.length})
                </button>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setVegOnly((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    vegOnly
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <VegDot veg /> Pure Veg
                </button>

                <button
                  onClick={() => setTopRated((r) => !r)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    topRated
                      ? "border-amber-500 bg-amber-50 text-amber-800 shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> 4.0+
                </button>

                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600">
                  <span className="text-slate-400">Sort:</span>
                  <button
                    onClick={() => setSortBy("relevance")}
                    className={sortBy === "relevance" ? "text-primary font-black" : "hover:text-slate-900"}
                  >
                    Relevance
                  </button>
                  <span className="text-slate-200">|</span>
                  <button
                    onClick={() => setSortBy("distance")}
                    className={sortBy === "distance" ? "text-primary font-black" : "hover:text-slate-900"}
                  >
                    Nearest
                  </button>
                  <span className="text-slate-200">|</span>
                  <button
                    onClick={() => setSortBy("rating")}
                    className={sortBy === "rating" ? "text-primary font-black" : "hover:text-slate-900"}
                  >
                    Rating
                  </button>
                </div>
              </div>
            </div>
          )}
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
        ) : !hasQuery ? (
          /* Empty / Idle State with Recent & Trending searches */
          <div className="py-8 space-y-8 max-w-2xl mx-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Recent Searches
                  </h3>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs font-bold text-slate-400 hover:text-red-500"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-all shadow-2xs"
                    >
                      <History className="h-3 w-3 text-slate-400" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Suggestions */}
            <div className="text-center pt-4">
              <div className="relative mx-auto w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                <img
                  src="/character-1.jpg"
                  alt="Search Mascot"
                  className="relative w-full h-full object-cover rounded-full mix-blend-multiply"
                />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                What are you craving today?
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1 max-w-md mx-auto">
                Search across top restaurants, supermarket staples, fresh bakes, and local favourites in your area.
              </p>

              <div className="mt-6">
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
          </div>
        ) : totalResults === 0 ? (
          <div className="py-20 text-center rounded-3xl border border-slate-100 bg-white p-8 shadow-xs max-w-xl mx-auto">
            <Frown className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-base font-black text-slate-800">No results found for &ldquo;{query}&rdquo;</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500 leading-relaxed">
              We couldn&apos;t find matching dishes or restaurants. Try searching with a different keyword or explore popular cuisines.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {TRENDING.slice(0, 4).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSearch(t)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* ── DISHES SECTION ── */}
            {(activeTab === "all" || activeTab === "dishes") && filteredDishes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    <span>Dishes ({filteredDishes.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredDishes.map((dish) => {
                    const rest = restaurants.find((r) => r.id === dish.restaurantId);
                    const inCartQty = cart.qtyOf(dish.id);
                    return (
                      <div
                        key={dish.id}
                        className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-100">
                            <img
                              src={menuItemImage(dish)}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <VegDot veg={dish.isVeg} />
                            </div>
                            {dish.isRecommended && (
                              <span className="absolute top-2 right-2 rounded-md bg-amber-500 text-white px-2 py-0.5 text-[10px] font-black uppercase">
                                Bestseller
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <h3 className="truncate text-sm font-black text-slate-900">
                              {dish.name}
                            </h3>
                            {rest && (
                              <Link
                                to={`/restaurant/${rest.id}`}
                                className="block truncate text-xs font-bold text-primary hover:underline mt-0.5"
                              >
                                {rest.name}
                              </Link>
                            )}
                            {dish.description && (
                              <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-400 leading-relaxed">
                                {dish.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-base font-black text-slate-900">
                            {formatMoney(dish.price, rest?.currency)}
                          </span>
                          <button
                            onClick={() => handleAddDish(dish)}
                            className="rounded-xl border border-primary bg-white px-4 py-1.5 text-xs font-black text-primary shadow-xs hover:bg-primary hover:text-white transition-all active:scale-95"
                          >
                            {inCartQty > 0 ? `ADD (${inCartQty})` : "ADD +"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── RESTAURANTS SECTION ── */}
            {(activeTab === "all" || activeTab === "restaurants") && filteredRestaurants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <span>Restaurants & Stores ({filteredRestaurants.length})</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredRestaurants.map((r) => (
                    <RestaurantCard key={r.id} r={r} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item Customization Modal */}
      {modalItem && (
        <SearchItemModal
          item={modalItem.item}
          restaurant={modalItem.restaurant}
          onClose={() => setModalItem(null)}
        />
      )}
    </div>
  );
}

function SearchItemModal({
  item,
  restaurant,
  onClose,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  onClose: () => void;
}) {
  const cart = useCart();
  const [variant, setVariant] = useState<MenuVariant | undefined>(item.variants[0]);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [qty, setQty] = useState(1);

  const unit =
    (variant?.price ?? item.price) +
    item.addons.filter((a) => addons.has(a.name)).reduce((s, a) => s + a.price, 0);

  function confirmAdd() {
    if (cart.conflictsWith(restaurant)) {
      if (
        !confirm(
          `Your cart contains items from ${cart.restaurant?.name}. Replace cart with items from ${restaurant.name}?`
        )
      ) {
        return;
      }
      cart.clear();
    }

    const selectedAddons = item.addons.filter((a) => addons.has(a.name));
    cart.add(restaurant, item, {
      variant,
      addons: selectedAddons,
      qty,
    });
    toast(`${qty}× ${item.name} added to cart!`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <VegDot veg={item.isVeg} />
          <div>
            <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{restaurant.name}</p>
          </div>
        </div>

        {/* Variants */}
        {item.variants.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Select Option
            </p>
            <div className="space-y-2">
              {item.variants.map((v) => (
                <label
                  key={v.name}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    variant?.name === v.name
                      ? "border-primary bg-primary/5 text-slate-900"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="variant"
                      checked={variant?.name === v.name}
                      onChange={() => setVariant(v)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-bold">{v.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    {formatMoney(v.price, restaurant.currency)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Addons */}
        {item.addons.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Add-ons (Optional)
            </p>
            <div className="space-y-2">
              {item.addons.map((a) => {
                const checked = addons.has(a.name);
                return (
                  <label
                    key={a.name}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                      checked
                        ? "border-primary bg-primary/5 text-slate-900"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const copy = new Set(addons);
                          if (e.target.checked) copy.add(a.name);
                          else copy.delete(a.name);
                          setAddons(copy);
                        }}
                        className="h-4 w-4 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-bold">{a.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">
                      +{formatMoney(a.price, restaurant.currency)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity and Add CTA */}
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="text-primary hover:text-primary-dark"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-black text-primary min-w-[16px] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="text-primary hover:text-primary-dark"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={confirmAdd}
            className="flex-1 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Add item · {formatMoney(unit * qty, restaurant.currency)}
          </button>
        </div>
      </div>
    </div>
  );
}
