import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  Smartphone,
  Navigation,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  Wine,
  Store,
  Compass,
  CheckCircle2,
  Globe,
  ChevronUp,
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

const COLLECTIONS = [
  {
    title: "Top Trending Spots",
    places: "28 Places",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    query: "Trending",
  },
  {
    title: "Best Biryani in Town",
    places: "24 Places",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    query: "Biryani",
  },
  {
    title: "Cafes & Sweet Spots",
    places: "18 Places",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    query: "Cafe",
  },
  {
    title: "Newly Opened Kitchens",
    places: "14 Places",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    query: "Popular",
  },
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

  // App Link Form State
  const [contactMode, setContactMode] = useState<"email" | "phone">("email");
  const [contactVal, setContactVal] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  function handleSendAppLink(e: React.FormEvent) {
    e.preventDefault();
    if (!contactVal.trim()) {
      toast("Please enter your email or phone number.");
      return;
    }
    setLinkSent(true);
    toast("Download link sent to your device!");
  }

  function scrollToApp() {
    const el = document.getElementById("get-app-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* ─── 1. HERO SECTION WITH VIDEO BACKGROUND ─────────────────────────── */}
      <section className="relative min-h-[580px] sm:min-h-[640px] md:min-h-[700px] w-full overflow-hidden flex flex-col justify-between">
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

        {/* ── Top Zomato Navigation Bar ── */}
        <header className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex items-center justify-between text-white text-sm font-semibold">
            {/* Get the App Button */}
            <button
              onClick={scrollToApp}
              className="flex items-center gap-2 hover:text-white/80 transition-colors py-1 text-sm font-bold"
            >
              <Smartphone className="h-4 w-4" />
              <span>Get the App</span>
            </button>

            {/* Right Nav Links */}
            <div className="flex items-center gap-6 sm:gap-8 text-[15px] font-medium">
              <Link
                to="/investor-relations"
                className="hidden sm:inline-block hover:text-white/80 transition-colors"
              >
                Investor Relations
              </Link>
              <Link
                to="/add-restaurant"
                className="hidden sm:inline-block hover:text-white/80 transition-colors font-bold"
              >
                Add restaurant
              </Link>
              <Link
                to="/login"
                className="hover:text-white/80 transition-colors font-bold"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="hover:text-white/80 transition-colors font-bold"
              >
                Sign up
              </Link>
            </div>
          </div>
        </header>

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

      {/* ─── 2. ZOMATO 3 SERVICE OFFERINGS CARDS ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Order Online */}
          <Link
            to="/order"
            className="group rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                alt="Order Online"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                Order Online
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Stay home and order food directly to your doorstep.
              </p>
            </div>
          </Link>

          {/* Card 2: Dining */}
          <Link
            to="/order"
            className="group rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Dining Out"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                Dining Out
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                View the city&apos;s favourite dining venues & reserve tables.
              </p>
            </div>
          </Link>

          {/* Card 3: Nightlife & Stays */}
          <Link
            to="/order"
            className="group rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80"
                alt="Nightlife & Stays"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                Nightlife & Stays
              </h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Explore top nightlife, events, resort getaways & Kada Stays.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 3. COLLECTIONS SECTION (ZOMATO SIGNATURE) ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Collections</h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Explore curated lists of top restaurants, cafes, pubs, and bars in {currentLoc.label.split(",")[0]}, based on trends
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-1 text-sm font-black text-primary hover:underline shrink-0"
          >
            <span>All collections in {currentLoc.label.split(",")[0]}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.title}
              to={`/search?q=${encodeURIComponent(c.query)}`}
              className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-md"
            >
              <img
                src={c.image}
                alt={c.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base sm:text-lg font-black tracking-tight">{c.title}</h3>
                <p className="text-xs font-bold text-white/80 flex items-center gap-1 mt-0.5">
                  <span>{c.places}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 4. POPULAR LOCALITIES SECTION (ZOMATO GRID) ──────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-8">
          Popular localities in and around{" "}
          <span className="text-slate-900">{currentLoc.label.split(",")[0]}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_LOCALITIES.map((loc) => (
            <div
              key={loc.name}
              onClick={() => handleSelectLocality(loc)}
              className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold text-slate-800 group-hover:text-primary transition-colors">
                  {loc.name}
                </h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{loc.places}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          ))}

          {/* Explore all locality card */}
          <Link
            to="/order"
            className="flex items-center justify-center p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition-colors text-center"
          >
            <span className="text-sm font-black text-primary">see more localities &rarr;</span>
          </Link>
        </div>
      </section>

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
                    <div className="h-20 w-20 mx-auto rounded-2xl overflow-hidden shadow-md">
                      <img src="/character-2.jpg" alt="Mascot" className="h-full w-full object-cover" />
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
                  Get the The Kada App
                </h2>
                <p className="mt-2 text-sm font-medium text-slate-600 leading-relaxed">
                  We will send you a link, open it on your phone to download the app directly.
                </p>
              </div>

              {/* Radio Selector */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                  <input
                    type="radio"
                    name="mode"
                    checked={contactMode === "email"}
                    onChange={() => setContactMode("email")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700">
                  <input
                    type="radio"
                    name="mode"
                    checked={contactMode === "phone"}
                    onChange={() => setContactMode("phone")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span>Phone</span>
                </label>
              </div>

              {/* Form Input */}
              {linkSent ? (
                <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-sm font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Link sent! Check your {contactMode} to download the app.</span>
                </div>
              ) : (
                <form onSubmit={handleSendAppLink} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type={contactMode === "email" ? "email" : "tel"}
                    value={contactVal}
                    onChange={(e) => setContactVal(e.target.value)}
                    placeholder={contactMode === "email" ? "Enter your email address" : "Enter 10-digit mobile number"}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                  >
                    Share App Link
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

      {/* ─── 7. ZOMATO SIGNATURE FOOTER ────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-14 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar with Brand and Country / Language Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">
              The Kada
            </h2>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700">
                <span>🇮🇳 India</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span>English</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* 5 Footer Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                About Kada
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/about" className="hover:text-slate-900">Who We Are</Link></li>
                <li><Link to="/blog" className="hover:text-slate-900">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-slate-900">Work With Us</Link></li>
                <li><Link to="/investor-relations" className="hover:text-slate-900 font-bold text-blue-600">Investor Relations</Link></li>
                <li><Link to="/contact" className="hover:text-slate-900">Report Fraud</Link></li>
                <li><Link to="/contact" className="hover:text-slate-900">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                Kadaverse
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/order" className="hover:text-slate-900">The Kada</Link></li>
                <li><Link to="/order" className="hover:text-slate-900">Kada Host</Link></li>
                <li><Link to="/order" className="hover:text-slate-900">Kada Vendor</Link></li>
                <li><Link to="/order" className="hover:text-slate-900">Kada Rider</Link></li>
                <li><Link to="/order" className="hover:text-slate-900">Kada Stays</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                For Restaurants
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/add-restaurant" className="hover:text-slate-900 font-bold text-primary">Partner With Us</Link></li>
                <li><a href={getVendorOnboardingUrl("/signup")} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Register Restaurant</a></li>
                <li><a href={getVendorOnboardingUrl("/login")} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">Vendor Dashboard</a></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                Learn More
              </p>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/legal/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-slate-900">Terms of Service</Link></li>
                <li><Link to="/legal/refund" className="hover:text-slate-900">Refund Policy</Link></li>
                <li><Link to="/faq" className="hover:text-slate-900">Security & Safety</Link></li>
                <li><Link to="/delete-account" className="hover:text-slate-900">Delete Account</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">
                Social Links
              </p>
              <div className="flex items-center gap-3 mb-6">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-primary transition-colors text-xs font-bold">
                  IG
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-primary transition-colors text-xs font-bold">
                  X
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-primary transition-colors text-xs font-bold">
                  YT
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-primary transition-colors text-xs font-bold">
                  IN
                </a>
              </div>

              <div className="space-y-2">
                <a href="https://apple.com" target="_blank" rel="noreferrer" className="block text-[11px] font-bold rounded-xl bg-slate-900 text-white py-2 px-3 text-center hover:bg-slate-800">
                  App Store
                </a>
                <a href="https://play.google.com" target="_blank" rel="noreferrer" className="block text-[11px] font-bold rounded-xl bg-slate-900 text-white py-2 px-3 text-center hover:bg-slate-800">
                  Google Play
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Legal Disclaimer */}
          <div className="pt-6 border-t border-slate-200/80 text-[11px] text-slate-400 font-medium leading-relaxed">
            <p>
              By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners. 2026 © The Kada™ Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
