import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  Navigation,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  Wine,
  Store,
  Compass,
  CheckCircle2,
  ChevronUp,
  Mail,
  Loader2,
  Flame,
} from "lucide-react";
import {
  getDiscoveryLocation,
  saveLocation,
  requestBrowserLocation,
  searchPlaces,
  POPULAR_AREAS,
  type DeliveryLocation,
  type PlaceSuggestion,
} from "@/services/location";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/bits";
import { getVendorOnboardingUrl } from "@/lib/urls";
import { EcosystemSection } from "@/components/EcosystemSection";
import { AppFeaturesShowcase } from "@/components/AppFeaturesShowcase";
import { sendAppDownloadEmail } from "@/services/appLink";
import { handleFoodImageError } from "@/lib/foodImages";

const POPULAR_LOCALITIES = [
  { name: "Kakkanad", places: "148 places", lat: 10.0159, lng: 76.3419 },
  { name: "Edachira & Infopark", places: "92 places", lat: 10.0094, lng: 76.3619 },
  { name: "Kaloor & Palarivattom", places: "124 places", lat: 9.9934, lng: 76.2929 },
  { name: "MG Road & Marine Drive", places: "110 places", lat: 9.9675, lng: 76.2841 },
  { name: "Fort Kochi & Mattancherry", places: "85 places", lat: 9.9638, lng: 76.2435 },
  { name: "Panampilly Nagar", places: "64 places", lat: 9.9602, lng: 76.2952 },
  { name: "Aluva & Kalamassery", places: "105 places", lat: 10.1076, lng: 76.3516 },
  { name: "Koramangala, Bengaluru", places: "210 places", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar, Bengaluru", places: "175 places", lat: 12.9784, lng: 77.6408 },
];

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  places: string;
  image: string;
  badge: string;
  badgeColor: string;
  category: "all" | "trending" | "biryani" | "cafes" | "dining" | "veg";
  to: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "trending",
    title: "Top Trending Spots",
    subtitle: "The most popular dining destinations this week",
    places: "28 Places",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    badge: "🔥 TRENDING",
    badgeColor: "bg-rose-500/95 text-white",
    category: "trending",
    to: "/search?q=Trending",
  },
  {
    id: "biryani",
    title: "Best Biryani in Town",
    subtitle: "Aromatic dum, Malabar, & Thalassery biryanis",
    places: "24 Places",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    badge: "👑 ICONIC MUST-TRY",
    badgeColor: "bg-amber-500/95 text-white",
    category: "biryani",
    to: "/search?q=Biryani",
  },
  {
    id: "cafes",
    title: "Cafes & Sweet Spots",
    subtitle: "Artisanal brews, cheesecakes, and cozy corners",
    places: "19 Places",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    badge: "☕ AESTHETIC VIBES",
    badgeColor: "bg-blue-600/95 text-white",
    category: "cafes",
    to: "/search?q=Cafe",
  },
  {
    id: "dining",
    title: "Table Booking & Fine Dine",
    subtitle: "Reserve premium tables with zero booking fee",
    places: "16 Places",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    badge: "🥂 TABLE BOOKING",
    badgeColor: "bg-indigo-600/95 text-white",
    category: "dining",
    to: "/order?vertical=dining",
  },
  {
    id: "veg",
    title: "Pure Veg Delights",
    subtitle: "Crispy dosas, paneer delicacies, and thalis",
    places: "22 Places",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80",
    badge: "🌿 100% PURE VEG",
    badgeColor: "bg-emerald-600/95 text-white",
    category: "veg",
    to: "/order?veg=true",
  },
  {
    id: "budget",
    title: "Pocket-Friendly Bites",
    subtitle: "Satisfying snacks & meals under ₹149",
    places: "31 Places",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badge: "⚡ UNDER ₹149",
    badgeColor: "bg-cyan-600/95 text-white",
    category: "all",
    to: "/order",
  },
  {
    id: "seafood",
    title: "Coastal Seafood Specials",
    subtitle: "Fresh catch karimeen, prawns, and fish curries",
    places: "15 Places",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    badge: "🦐 COASTAL FLAVORS",
    badgeColor: "bg-sky-600/95 text-white",
    category: "all",
    to: "/search?q=Seafood",
  },
  {
    id: "new",
    title: "Newly Opened Kitchens",
    subtitle: "Discover fresh cuisines that just landed in town",
    places: "12 Places",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    badge: "✨ NEW DISCOVERY",
    badgeColor: "bg-purple-600/95 text-white",
    category: "trending",
    to: "/search?q=Popular",
  },
];

const COLLECTION_TABS = [
  { id: "all", label: "All Guides" },
  { id: "trending", label: "🔥 Trending" },
  { id: "biryani", label: "🍚 Biryani Trails" },
  { id: "cafes", label: "☕ Cafes & Bakes" },
  { id: "dining", label: "🥂 Table Booking" },
  { id: "veg", label: "🌿 Pure Veg" },
];

const CUISINES = [
  "Bakery",
  "Beverages",
  "Biryani",
  "Burger",
  "Chinese",
  "Continental",
  "Desserts",
  "Ice Cream",
  "Juices",
  "Kerala Sadya",
  "Lebanese",
  "Malabar",
  "North Indian",
  "Pizza",
  "Rolls",
  "Sandwich",
  "Seafood",
  "Shawarma",
  "South Indian",
  "Street Food",
];

const RESTAURANT_TYPES = [
  "Bakeries",
  "Bars & Pubs",
  "Beverage Shops",
  "Cafes",
  "Casual Dining",
  "Cloud Kitchens",
  "Dessert Parlours",
  "Dhabas",
  "Fine Dining",
  "Food Courts",
  "Kiosks",
  "Quick Bites",
  "Sweet Shops",
];

const CHAINS = [
  "Paragon",
  "Domino's Pizza",
  "Burger King",
  "KFC",
  "Haldiram's",
  "Chicking",
  "Subway",
  "Pizza Hut",
  "Baskin Robbins",
  "Thalassery Kitchens",
  "Madras Cafe",
  "Sagar",
];

const CITIES = [
  "Kochi",
  "Kozhikode",
  "Thiruvananthapuram",
  "Thrissur",
  "Kannur",
  "Kollam",
  "Kottayam",
  "Alappuzha",
  "Palakkad",
  "Malappuram",
  "Bengaluru",
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentLoc, setCurrentLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  // App Link Form State (Email only)
  const [emailVal, setEmailVal] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Collection Category Filter State
  const [selectedCollectionCategory, setSelectedCollectionCategory] = useState<string>("all");

  const filteredCollections = useMemo(() => {
    if (selectedCollectionCategory === "all") return COLLECTIONS;
    return COLLECTIONS.filter(
      (c) => c.category === selectedCollectionCategory || c.id === selectedCollectionCategory
    );
  }, [selectedCollectionCategory]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDetectLocation() {
    setLocating(true);
    try {
      const loc = await requestBrowserLocation();
      setCurrentLoc(loc);
      setShowLocationDropdown(false);
      toast(`Location set to ${loc.label}`);
    } catch {
      toast("Location access denied. Please select from the list.");
    } finally {
      setLocating(false);
    }
  }

  function handleSelectLocality(loc: { name: string; lat: number; lng: number }) {
    const deliveryLoc: DeliveryLocation = {
      lat: loc.lat,
      lng: loc.lng,
      label: loc.name,
      area: loc.name,
      isGps: false,
    };
    saveLocation(deliveryLoc);
    setCurrentLoc(deliveryLoc);
    setShowLocationDropdown(false);
    navigate("/order");
  }

  async function handleSearchChange(val: string) {
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const results = await searchPlaces(val);
    setSuggestions(results);
    setSearching(false);
  }

  function handleSelectCity(cityName: string) {
    const coords: Record<string, { lat: number; lng: number }> = {
      Kochi: { lat: 10.0159, lng: 76.3419 },
      Kozhikode: { lat: 11.2588, lng: 75.7804 },
      Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
      Thrissur: { lat: 10.5276, lng: 76.2144 },
      Kannur: { lat: 11.8745, lng: 75.3704 },
      Kollam: { lat: 8.8932, lng: 76.6141 },
      Kottayam: { lat: 9.5916, lng: 76.5222 },
      Alappuzha: { lat: 9.4981, lng: 76.3388 },
      Palakkad: { lat: 10.7867, lng: 76.6548 },
      Malappuram: { lat: 11.0732, lng: 76.0740 },
      Bengaluru: { lat: 12.9716, lng: 77.5946 },
    };
    const target = coords[cityName] || { lat: 10.0159, lng: 76.3419 };
    const deliveryLoc: DeliveryLocation = {
      lat: target.lat,
      lng: target.lng,
      label: `${cityName}, India`,
      area: cityName,
      isGps: false,
    };
    saveLocation(deliveryLoc);
    setCurrentLoc(deliveryLoc);
    toast(`Location set to ${cityName}`);
    navigate("/order");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/order");
    }
  }

  async function handleSendAppLink(e: React.FormEvent) {
    e.preventDefault();
    const email = emailVal.trim();
    if (!email) {
      toast("Please enter your email address.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast("Please enter a valid email address.");
      return;
    }
    setSendingLink(true);
    try {
      await sendAppDownloadEmail(email);
      setLinkSent(true);
      toast("Download link sent to your email!");
    } catch (err: any) {
      console.error("Failed to send download link:", err);
      toast(err?.message || "Could not send email. Please try again.");
    } finally {
      setSendingLink(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* ─── 1. HERO SECTION WITH VIDEO BACKGROUND ─────────────────────────── */}
      <section className="relative min-h-[560px] sm:min-h-[620px] md:min-h-[680px] w-full overflow-hidden flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-16">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png"
          className="absolute inset-0 h-full w-full object-cover scale-105"
        >
          <source src="/food-hero.mp4" type="video/mp4" />
        </video>

        {/* Ambient Overlay Gradient (Zomato style) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85" />

        {/* ── Hero Center Content ── */}
        <div className="relative z-20 mx-auto w-full max-w-4xl px-4 sm:px-6 text-center my-auto py-12">
          {/* Brand Wordmark (Zomato iconic bold centered logo) */}
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/order"
              className="text-5xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter text-white drop-shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              The Kada
            </Link>
          </div>

          <p className="mt-4 text-xl sm:text-3xl lg:text-4xl font-extrabold text-white/95 tracking-tight drop-shadow-sm">
            Discover the best food & drinks in{" "}
            <span className="text-white underline decoration-primary decoration-4 underline-offset-4">
              {currentLoc.label.split(",")[0]}
            </span>
          </p>

          {/* ── Iconic Dual-Part Search Box (Zomato Signature) ── */}
          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto relative" ref={dropdownRef}>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center h-auto sm:h-14 w-full rounded-2xl bg-white shadow-2xl p-2 sm:p-2 sm:px-4 border border-white/20 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
            >
              {/* Left: Location Selector Pill */}
              <div className="relative w-full sm:w-[35%] flex items-center gap-2 px-2 py-2 sm:py-0">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown((prev) => !prev)}
                  className="flex-1 flex items-center justify-between text-left truncate outline-none"
                >
                  <span className="truncate text-sm font-bold text-slate-800">
                    {currentLoc.label}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
                </button>
              </div>

              {/* Right: Search Input */}
              <div className="relative w-full sm:w-[65%] flex items-center gap-3 px-2 py-2 sm:py-0">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search for restaurant, cuisine or a dish"
                  className="flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searching && <Spinner className="h-4 w-4 text-primary shrink-0" />}
              </div>
            </form>

            {/* Location Selector Dropdown */}
            {showLocationDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full sm:w-80 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 z-30 text-left animate-in fade-in duration-150">
                {/* Detect Location Button */}
                <button
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="flex w-full items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-primary font-bold text-sm"
                >
                  <Navigation className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
                  <div>
                    <p className="leading-none">Detect current location</p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1">Using GPS</p>
                  </div>
                </button>

                <div className="my-2 border-t border-slate-100" />

                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Popular Localities
                </p>

                <div className="max-h-48 overflow-y-auto space-y-1">
                  {POPULAR_LOCALITIES.slice(0, 6).map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => handleSelectLocality(loc)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center justify-between"
                    >
                      <span>{loc.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{loc.places}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-[65%] rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 z-30 text-left max-h-60 overflow-y-auto animate-in fade-in duration-150">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSuggestions([]);
                      navigate(`/search?q=${encodeURIComponent(s.label)}`);
                    }}
                    className="flex w-full items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <Search className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-800">{s.label}</p>
                      {s.secondary && (
                        <p className="truncate text-[11px] font-medium text-slate-400">{s.secondary}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="relative z-20 h-10" />
      </section>

      {/* ─── 2. COLLECTIONS SECTION ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Curated City Guides
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Collections in{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {currentLoc.label.split(",")[0]}
              </span>
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-500 mt-2 max-w-2xl leading-relaxed">
              Explore handpicked lists of top-rated spots, iconic food trails, and hidden dining gems based on local trends
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-primary hover:text-blue-700 transition-colors group shrink-0"
          >
            <span>All collections in {currentLoc.label.split(",")[0]}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          {COLLECTION_TABS.map((tab) => {
            const isActive = selectedCollectionCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCollectionCategory(tab.id)}
                className={`shrink-0 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25 border border-primary"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredCollections.map((c) => (
            <Link
              key={c.id}
              to={c.to}
              className="group relative h-60 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 border border-slate-200/80 transition-all duration-300 flex flex-col justify-end"
            >
              <img
                src={c.image}
                alt={c.title}
                onError={(e) => handleFoodImageError(e, c.title)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Floating Badge Tag at top */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${c.badgeColor}`}
                >
                  {c.badge}
                </span>
              </div>

              {/* Card Content at bottom */}
              <div className="relative z-10 p-3 sm:p-5 text-white">
                <h3 className="text-sm sm:text-lg font-black tracking-tight leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                  {c.title}
                </h3>
                <p className="hidden sm:block text-xs text-slate-300 font-medium line-clamp-1 mt-1">
                  {c.subtitle}
                </p>
                <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs font-bold text-white/90 pt-1.5 sm:pt-2 border-t border-white/10">
                  <span className="text-[11px] sm:text-xs text-blue-300 font-black">{c.places}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-white/90 font-bold group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                    <span>Explore</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. WHAT'S WAITING FOR YOU ON THE APP? (FEATURE SHOWCASE) ───── */}
      <AppFeaturesShowcase />

      {/* ─── 4. THE KADA ECOSYSTEM SECTION (MATCHING REFERENCE) ─────────── */}
      <EcosystemSection />

      {/* ─── 5. GET THE KADA APP SECTION (ZOMATO PHONE MOCKUP) ─────────────── */}
      <section id="get-app-section" className="bg-[#fffbf7] border-y border-orange-100/80 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Phone Visual */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-64 h-96 rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl border-4 border-slate-800">
                <div className="h-full w-full rounded-[2rem] overflow-hidden bg-slate-50 relative flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-primary">The Kada</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="my-auto text-center space-y-2">
                    <div className="h-16 w-16 mx-auto rounded-2xl overflow-hidden p-2 bg-white shadow-md flex items-center justify-center">
                      <img src="/logo.png" alt="The Kada" className="h-full w-full object-contain" />
                    </div>
                    <p className="text-xs font-black text-slate-800">Food at your doorstep</p>
                    <p className="text-[10px] font-bold text-slate-400">Live GPS tracking active</p>
                  </div>
                  <div className="rounded-xl bg-primary py-2 text-center text-white text-[11px] font-black">
                    Order in 1-Tap
                  </div>
                </div>
              </div>
            </div>

            {/* Form & App Store Buttons */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Get The Kada App
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed">
                  Enter your email address and we'll send you a link to download the app directly to your phone.
                </p>
              </div>

              {/* Form Input */}
              {linkSent ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span>Download link sent! Check your inbox at <span className="font-black underline">{emailVal}</span>.</span>
                  </div>
                  <p className="text-xs text-emerald-700 pl-7">
                    Open the email on your phone to install directly from Google Play or the App Store.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setEmailVal("");
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline pl-7 pt-1"
                  >
                    Send to another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendAppLink} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={emailVal}
                      onChange={(e) => setEmailVal(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={sendingLink}
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary disabled:opacity-60 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingLink}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:pointer-events-none transition-all whitespace-nowrap"
                  >
                    {sendingLink ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Share App Link</span>
                    )}
                  </button>
                </form>
              )}

              {/* Store Badges */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Download app from
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.22-.924V2.738c0-.348.08-.667.22-.924zm11.597 11.598l2.253 2.253-11.45 6.442 9.197-8.695zm0-2.824L6.01 1.892l11.45 6.442-2.254 2.254zm1.414 1.414l3.52-1.98a1.996 1.996 0 0 1 0 3.96l-3.52-1.98z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">GET IT ON</p>
                      <p className="text-xs font-black leading-tight mt-0.5">Google Play</p>
                    </div>
                  </a>

                  <a
                    href="https://apple.com/app-store"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-2.5 text-white hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.49 2.65-1.23z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Download on the</p>
                      <p className="text-xs font-black leading-tight mt-0.5">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. EXPLORE OPTIONS NEAR YOU (ACCORDIONS) ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
          Explore options near you
        </h2>

        {/* Accordion 1: Cuisines */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
            className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800"
          >
            <span>Popular cuisines near me</span>
            {openFaq === 1 ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>
          {openFaq === 1 && (
            <div className="p-5 pt-0 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {CUISINES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(c)}`)}
                  className="hover:text-primary hover:underline transition-colors cursor-pointer text-xs font-semibold text-slate-600"
                >
                  {c}{i < CUISINES.length - 1 ? " ·" : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 2: Restaurant Types */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
            className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800"
          >
            <span>Popular restaurant types near me</span>
            {openFaq === 2 ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>
          {openFaq === 2 && (
            <div className="p-5 pt-0 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {RESTAURANT_TYPES.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(t)}`)}
                  className="hover:text-primary hover:underline transition-colors cursor-pointer text-xs font-semibold text-slate-600"
                >
                  {t}{i < RESTAURANT_TYPES.length - 1 ? " ·" : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 3: Top Restaurant Chains */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
            className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800"
          >
            <span>Top Restaurant Chains</span>
            {openFaq === 3 ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>
          {openFaq === 3 && (
            <div className="p-5 pt-0 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {CHAINS.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(c)}`)}
                  className="hover:text-primary hover:underline transition-colors cursor-pointer text-xs font-semibold text-slate-600"
                >
                  {c}{i < CHAINS.length - 1 ? " ·" : ""}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion 4: Cities We Deliver To */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <button
            onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
            className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800"
          >
            <span>Cities We Deliver To</span>
            {openFaq === 4 ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>
          {openFaq === 4 && (
            <div className="p-5 pt-0 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {CITIES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSelectCity(c)}
                  className="hover:text-primary hover:underline transition-colors cursor-pointer text-xs font-semibold text-slate-600"
                >
                  {c}{i < CITIES.length - 1 ? " ·" : ""}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
