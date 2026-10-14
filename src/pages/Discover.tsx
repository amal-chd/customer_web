import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  MapPin,
  Search as SearchIcon,
  Bell,
  Frown,
  SlidersHorizontal,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import type { Restaurant } from "@/types";
import { discoverNearby, getCachedResults } from "@/services/discovery";
import {
  getDiscoveryLocation,
  onLocationChange,
  type DeliveryLocation,
} from "@/services/location";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard, VegDot } from "@/components/bits";
import { useAuth } from "@/context/AuthContext";
import { LocationPickerSheet } from "@/components/LocationPickerSheet";

const CATEGORIES = [
  { name: "Biryani", emoji: "🍛", bg: "from-amber-100 to-orange-100 text-amber-900 border-amber-200" },
  { name: "Pizza", emoji: "🍕", bg: "from-yellow-100 to-red-100 text-red-900 border-red-200" },
  { name: "Burger", emoji: "🍔", bg: "from-orange-100 to-amber-200 text-orange-900 border-orange-200" },
  { name: "Chinese", emoji: "🍜", bg: "from-red-100 to-rose-100 text-rose-900 border-rose-200" },
  { name: "South Indian", emoji: "🥞", bg: "from-orange-50 to-amber-100 text-amber-900 border-amber-200" },
  { name: "Cake", emoji: "🍰", bg: "from-pink-100 to-rose-100 text-pink-900 border-pink-200" },
  { name: "Rolls", emoji: "🌯", bg: "from-green-100 to-teal-100 text-teal-900 border-teal-200" },
  { name: "Dessert", emoji: "🍦", bg: "from-purple-100 to-indigo-100 text-indigo-900 border-indigo-200" },
];

export default function Discover() {
  const [loc, setLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [list, setList] = useState<Restaurant[]>(getCachedResults() ?? []);
  const [loading, setLoading] = useState(!getCachedResults());
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Filters
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  async function load(l: DeliveryLocation) {
    setLoading((prev) => (list.length === 0 ? true : prev));
    setError(null);
    try {
      const results = await discoverNearby(l.lat, l.lng);
      setList(results);
    } catch (e: any) {
      if (list.length === 0) setError(e?.message ?? "Could not load restaurants.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(loc);
    return onLocationChange((newLoc) => {
      setLoc(newLoc);
      load(newLoc);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return list.filter((r) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          (r.cuisine ?? "").toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (minRating && (r.ratingAvg ?? 0) < minRating) return false;
      if (fastDeliveryOnly && r.distanceKm > 4) return false;
      return true;
    });
  }, [list, query, minRating, fastDeliveryOnly]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Top Header (Hidden on Desktop since DesktopHeader handles it) */}
      <div className="md:hidden relative bg-white pt-5 pb-5 px-4 rounded-b-[2rem] shadow-xs border-b border-slate-100">
        <div className="flex items-start justify-between">
          <button
            onClick={() => setShowLocationPicker(true)}
            className="min-w-0 text-left flex-1 group"
          >
            <div className="flex items-center gap-1.5 text-slate-900">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="truncate text-lg font-black text-slate-900">
                {loc.label}
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
            </div>
            <p className="ml-8 mt-0.5 truncate text-xs font-bold text-slate-500">
              {loc.isGps ? "Using your current GPS location" : "Tap to change delivery address"}
            </p>
          </button>

          <div className="flex items-center gap-2">
            <Link
              to="/orders"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-primary transition-colors"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Link
              to="/account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-sm shadow-md shadow-primary/20"
            >
              {(user?.displayName?.[0] ?? user?.email?.[0] ?? "K").toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Mascot Greeting Banner on Mobile */}
        <div className="relative mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary to-indigo-600 p-4 text-white shadow-lg shadow-primary/20">
          <div className="flex-1 pr-3">
            <div className="flex items-center gap-1.5 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> Craving delicious food?
            </div>
            <h2 className="text-base font-black">Fast delivery to your door!</h2>
          </div>
          <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/20 p-1 shrink-0">
            <img src="/character-2.jpg" alt="Mascot" className="h-full w-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <button
          onClick={() => navigate("/search")}
          className="relative mt-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all hover:bg-white hover:border-primary"
        >
          <SearchIcon className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-slate-400">Search dishes or restaurants...</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Desktop Welcome Banner */}
        <div className="hidden md:flex relative items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-primary/20 mb-8">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-indigo-100 backdrop-blur-xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Delivering to {loc.label}
            </div>
            <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
              Order your favourite food in minutes.
            </h1>
            <p className="mt-2 text-sm font-medium text-indigo-100/90 leading-relaxed">
              Explore the finest kitchens, fast delivery, and real-time tracking with The Kada.
            </p>
          </div>
          <div className="relative z-10 hidden lg:block h-36 w-36 overflow-hidden rounded-2xl bg-white/10 p-2 backdrop-blur-xs shadow-inner">
            <img src="/character-2.jpg" alt="The Kada Mascot" className="h-full w-full object-cover rounded-xl" />
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">What's on your mind?</h2>
            <Link to="/search" className="text-xs font-bold text-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(c.name)}`)}
                className="flex shrink-0 flex-col items-center gap-2.5 transition-transform hover:-translate-y-1 group"
              >
                <div
                  className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${c.bg} shadow-xs border text-3xl sm:text-4xl group-hover:shadow-md transition-shadow`}
                >
                  {c.emoji}
                </div>
                <span className="text-xs font-extrabold text-slate-700 group-hover:text-primary transition-colors">
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5 pb-2">
          <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-400 mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
          </div>

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
            onClick={() => setMinRating((r) => (r === 4.0 ? null : 4.0))}
            className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              minRating === 4.0
                ? "border-amber-500 bg-amber-50 text-amber-800 shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Rating 4.0+
          </button>

          <button
            onClick={() => setFastDeliveryOnly((f) => !f)}
            className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              fastDeliveryOnly
                ? "border-primary bg-primary/10 text-primary shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Clock className="h-3.5 w-3.5" /> Fast Delivery (&lt; 30 min)
          </button>

          {(vegOnly || minRating || fastDeliveryOnly) && (
            <button
              onClick={() => {
                setVegOnly(false);
                setMinRating(null);
                setFastDeliveryOnly(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-red-500 underline ml-2"
            >
              Reset
            </button>
          )}
        </div>

        {/* Section Heading */}
        <div className="mt-6 flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Featured restaurants near {loc.label.split(",")[0]}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {filtered.length} place{filtered.length === 1 ? "" : "s"} ready to deliver
            </p>
          </div>
        </div>

        {/* Restaurants Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <ShimmerCard key={i} />)
          ) : error ? (
            <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-100 text-center shadow-xs">
              <Frown className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-base font-bold text-slate-700">{error}</p>
              <button
                onClick={() => setShowLocationPicker(true)}
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20"
              >
                Change location
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-16 bg-white rounded-3xl border border-slate-100 text-center shadow-xs">
              <Frown className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-base font-bold text-slate-700">No restaurants found in this area.</p>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Try selecting Kakkanad, Infopark, or searching for other locations.
              </p>
              <button
                onClick={() => setShowLocationPicker(true)}
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:scale-105 transition-all"
              >
                Pick different location
              </button>
            </div>
          ) : (
            filtered.map((r) => <RestaurantCard key={r.id} r={r} />)
          )}
        </div>
      </div>

      {/* Location Picker Sheet Modal */}
      <LocationPickerSheet
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onLocationSelected={(selected) => {
          setLoc(selected);
          load(selected);
        }}
      />
    </div>
  );
}
