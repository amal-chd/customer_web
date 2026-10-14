import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, MapPin, Search as SearchIcon, Bell, Frown } from "lucide-react";
import type { Restaurant } from "@/types";
import { discoverNearby, getCachedResults } from "@/services/discovery";
import { getDiscoveryLocation, requestBrowserLocation, type DeliveryLocation } from "@/services/location";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard } from "@/components/bits";
import { toast } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  { name: "Biryani", emoji: "🍛", bg: "from-amber-100 to-orange-100 text-amber-900 border-amber-200" },
  { name: "Pizza", emoji: "🍕", bg: "from-yellow-100 to-red-100 text-red-900 border-red-200" },
  { name: "Burger", emoji: "🍔", bg: "from-orange-100 to-amber-200 text-orange-900 border-orange-200" },
  { name: "Chinese", emoji: "🍜", bg: "from-red-100 to-rose-100 text-rose-900 border-rose-200" },
  { name: "Dosa", emoji: "🥞", bg: "from-orange-50 to-amber-100 text-amber-900 border-amber-200" },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function useMyLocation() {
    try {
      const l = await requestBrowserLocation();
      setLoc(l);
      load(l);
    } catch {
      toast("Location access denied. Showing nearby restaurants by default.");
    }
  }

  const filtered = query.trim()
    ? list.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          (r.cuisine ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : list;

  return (
    <div className="bg-slate-50 min-h-[100dvh] pb-6">
      {/* Premium Glowing Header */}
      <div className="relative bg-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-sm mb-6 border-b border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/50 via-indigo-50/30 to-transparent rounded-b-[2.5rem] pointer-events-none" />
        
        <div className="relative flex items-start justify-between">
          <button onClick={useMyLocation} className="min-w-0 text-left flex-1">
            <div className="flex items-center gap-1 text-slate-900">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="truncate text-xl font-black">{loc.label}</span>
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
            <p className="ml-6 mt-0.5 truncate text-xs font-bold text-slate-500">
              {loc.isGps ? "Delivering to your current location" : "Tap to use your location"}
            </p>
          </button>
          <div className="flex items-center gap-3">
            <Link to="/orders" className="flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm text-slate-600 hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
            </Link>
            <Link to="/account" className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 shadow-md text-sm font-black text-white transform hover:scale-105 transition-transform">
              {(user?.displayName?.[0] ?? user?.email?.[0] ?? "K").toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Mascot Greeting */}
        <div className="relative mt-6 flex items-center justify-between bg-gradient-to-r from-primary to-indigo-600 rounded-[1.5rem] p-4 shadow-lg shadow-indigo-200">
           <div className="flex-1 pr-4 text-white">
             <h2 className="text-lg font-black tracking-tight mb-1">Hey foodie! 👋</h2>
             <p className="text-sm font-medium text-indigo-100 line-clamp-2">What are we craving today? Our delivery partners are ready.</p>
           </div>
           <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-white/20 p-1">
             <img src="/character-2.jpg" alt="Mascot" className="w-full h-full object-cover rounded-xl" />
           </div>
        </div>

        <button
          onClick={() => navigate("/search")}
          className="relative mt-6 flex w-full items-center gap-3 rounded-2xl bg-white border border-slate-200 px-5 py-4 text-left shadow-sm hover:shadow-md transition-shadow"
        >
          <SearchIcon className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-slate-400">Search for dishes or restaurants...</span>
        </button>
      </div>

      {/* Categories */}
      <div className="px-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Explore</h3>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate(`/search?q=${encodeURIComponent(c.name)}`)}
              className="flex shrink-0 flex-col items-center gap-3 transition-transform hover:-translate-y-1"
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${c.bg} shadow-sm border text-3xl`}>
                {c.emoji}
              </div>
              <span className="text-xs font-bold text-slate-700">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="px-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Featured near you</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <ShimmerCard key={i} />)
        ) : error ? (
          <div className="col-span-2 py-16 bg-white rounded-3xl border border-slate-100 text-center">
            <Frown className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-base font-bold text-slate-700">{error}</p>
            <button onClick={useMyLocation} className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md">
              Try my location
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 py-16 bg-white rounded-3xl border border-slate-100 text-center">
            <Frown className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-base font-bold text-slate-700">No restaurants nearby yet.</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Try changing your location.</p>
          </div>
        ) : (
          filtered.map((r) => <RestaurantCard key={r.id} r={r} />)
        )}
      </div>
    </div>
  );
}
