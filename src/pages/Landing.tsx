import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
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
  ChevronUp,
  Check,
} from "lucide-react";
import {
  getDiscoveryLocation,
  saveLocation,
  requestBrowserLocation,
  searchPlaces,
  POPULAR_AREAS,
  POPULAR_LOCALITIES,
  onLocationChange,
  type DeliveryLocation,
  type PlaceSuggestion,
} from "@/services/location";
import { toast } from "@/components/Toast";
import { Spinner } from "@/components/bits";
import { getVendorOnboardingUrl } from "@/lib/urls";
import { EcosystemSection } from "@/components/EcosystemSection";
import { AppFeaturesShowcase } from "@/components/AppFeaturesShowcase";
import { BetterFoodSection } from "@/components/BetterFoodSection";
import { GetAppSection } from "@/components/GetAppSection";
import { handleFoodImageError } from "@/lib/foodImages";
import { LocationPickerSheet } from "@/components/LocationPickerSheet";
import { MapLocationPickerModal } from "@/components/MapLocationPickerModal";

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  places: string;
  image: string;
  badge: string;
  badgeColor: string;
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
    to: "/order?vertical=dining",
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
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-driven transforms for cinematic hero entrance and slide-up transition
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const videoScale = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [1, 1] : [1.02, 1.2]);
  const videoY = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [0, 0] : [0, 50]);
  const videoDim = useTransform(heroScroll, [0, 0.85], shouldReduceMotion ? [0.65, 0.65] : [0.6, 0.88]);
  const contentY = useTransform(heroScroll, [0, 1], shouldReduceMotion ? [0, 0] : [0, -60]);
  const contentOpacity = useTransform(heroScroll, [0, 0.68], shouldReduceMotion ? [1, 1] : [1, 0.05]);

  // Keep location in sync with global location updates across the app
  useEffect(() => {
    return onLocationChange((newLoc) => {
      setCurrentLoc(newLoc);
    });
  }, []);

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
      toast("Location access denied. Please select from the list or map.");
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
    toast(`Location set to ${loc.name}`);
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

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* ─── 1. HERO SECTION WITH VIDEO BACKGROUND ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-[560px] sm:min-h-[620px] md:min-h-[680px] w-full flex flex-col justify-center pt-20 pb-12 sm:pt-24 sm:pb-16 select-none"
      >
        {/* Background Video Wrapper (Clipped strictly to hero bounds) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ scale: videoScale, y: videoY }}
            className="absolute inset-0 will-change-transform"
          >
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
            <motion.div
              style={{ opacity: videoDim }}
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85"
            />
          </motion.div>
        </div>

        {/* ── Hero Center Content ── */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 mx-auto w-full max-w-4xl px-4 sm:px-6 text-center my-auto py-12 will-change-transform"
        >
          {/* Centered Brand Mark (Zomato Signature Hero) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 sm:mb-6 flex items-center justify-center gap-3.5"
          >
            <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center">
              <img src="/logo.png" alt="The Kada" className="h-full w-full object-contain" />
            </div>
            <span className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white drop-shadow-lg">
              The <span className="text-blue-400">Kada</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white/95 tracking-tight drop-shadow-md"
          >
            Discover the best food &amp; drinks in{" "}
            <span className="text-white underline decoration-primary decoration-4 underline-offset-4">
              {currentLoc.label.split(",")[0]}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-sm sm:text-base md:text-lg font-medium text-white/85 max-w-lg mx-auto drop-shadow-sm"
          >
            Experience fast &amp; easy online ordering on The Kada app
          </motion.p>

          {/* ── Iconic Dual-Part Search Box (Zomato Signature) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 max-w-3xl mx-auto relative"
            ref={dropdownRef}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row items-center h-auto sm:h-14 w-full rounded-2xl bg-white shadow-2xl p-2 sm:p-2 sm:px-4 border border-white/20 divide-y sm:divide-y-0 sm:divide-x divide-slate-200"
            >
              {/* Left: Location Selector Pill */}
              <div className="relative w-full sm:w-[35%] flex items-center gap-2 px-2 py-2 sm:py-0">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 640) {
                      setShowLocationSheet(true);
                    } else {
                      setShowLocationDropdown((prev) => !prev);
                    }
                  }}
                  className="flex-1 flex items-center justify-between text-left truncate outline-none cursor-pointer group"
                  title="Change location"
                >
                  <span className="truncate text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">
                    {currentLoc.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 group-hover:text-primary transition-transform duration-200 shrink-0 ml-1 ${
                      showLocationDropdown ? "rotate-180" : ""
                    }`}
                  />
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

            {/* Location Selector Dropdown (Desktop / Tablet) */}
            {showLocationDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full sm:w-96 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100/80 z-50 text-left animate-in fade-in duration-150">
                {/* Grouped Actions (Matches Mobile App Card) */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 overflow-hidden divide-y divide-slate-100">
                  {/* 1. Detect Location Button */}
                  <button
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="flex w-full items-center gap-3 p-3 hover:bg-white transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Navigation className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-primary leading-tight">
                        {locating ? "Locating with GPS..." : "Detect current location"}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">
                        {currentLoc.isGps ? "Using your GPS coordinates" : "Using GPS"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </button>

                  {/* 2. Select Location on Map */}
                  <button
                    onClick={() => {
                      setShowLocationDropdown(false);
                      setShowMapModal(true);
                    }}
                    className="flex w-full items-center gap-3 p-3 hover:bg-white transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">
                        Select location on map
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">
                        Drag pin to your exact building or gate
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </button>
                </div>

                <div className="my-2.5 border-t border-slate-100" />

                {/* Popular Localities Section */}
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Popular Localities
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationDropdown(false);
                      setShowLocationSheet(true);
                    }}
                    className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Search all...
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5 no-scrollbar">
                  {POPULAR_LOCALITIES.map((loc) => {
                    const isSelected =
                      currentLoc.label.toLowerCase().includes(loc.name.toLowerCase()) ||
                      currentLoc.area?.toLowerCase() === loc.name.toLowerCase();

                    return (
                      <button
                        key={loc.name}
                        onClick={() => handleSelectLocality(loc)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 text-primary font-black"
                            : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                        }`}
                      >
                        <span className="truncate pr-2">{loc.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                            {loc.places}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Search Area Footer Button */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLocationDropdown(false);
                      setShowLocationSheet(true);
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-lg hover:bg-slate-50"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search area, street or saved address</span>
                  </button>
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
          </motion.div>
        </motion.div>

        {/* Bottom spacer */}
        <div className="relative z-20 h-10" />
      </section>

      {/* ─── CARD 1: BETTER FOOD FOR EVERYONE (CRISP WHITE) ─── */}
      <div className="sticky top-0 z-10 min-h-[100svh] w-full flex flex-col justify-center bg-white rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.12)] -mt-8 sm:-mt-12 overflow-hidden pt-4 sm:pt-8 pb-20 sm:pb-16">
        <BetterFoodSection />
      </div>

      {/* ─── CARD 2: CURATED CITY GUIDES / COLLECTIONS (SLATE/ICE #F8FAFC) ─── */}
      <div className="sticky top-0 z-20 min-h-[100svh] w-full flex flex-col justify-center bg-[#F8FAFC] rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.14)] overflow-hidden pt-4 sm:pt-8 pb-20 sm:pb-16">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-primary mb-2 sm:mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Curated City Guides
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Collections in{" "}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {currentLoc.label.split(",")[0]}
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-500 mt-1 sm:mt-2 max-w-2xl leading-relaxed">
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

          {/* Collections Cards: Smooth horizontal scroll snap rail on mobile (Zomato-style), clean 4-col grid on desktop */}
          <div className="flex sm:hidden items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 px-1">
            <span>Swipe collections</span>
            <span className="text-primary font-bold">Scroll →</span>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6 no-scrollbar touch-pan-x-scroll">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.id}
                to={c.to}
                className="group relative snap-start shrink-0 w-[74vw] max-w-[270px] sm:w-auto h-[260px] sm:h-[320px] lg:h-[360px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-primary/40 border border-slate-200/80 transition-all duration-300 flex flex-col justify-end"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  onError={(e) => handleFoodImageError(e, c.title)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                {/* Floating Badge Tag at top */}
                <div className="absolute top-3 left-3 z-20">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${c.badgeColor}`}
                  >
                    {c.badge}
                  </span>
                </div>

                {/* Card Content at bottom */}
                <div className="relative z-20 p-3.5 sm:p-5 text-white">
                  <h3 className="text-sm sm:text-base lg:text-lg font-black tracking-tight leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                    {c.subtitle}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-white/90 pt-1.5 border-t border-white/10">
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
      </div>

      {/* ─── CARD 3: APP FEATURES SHOWCASE (SOFT ROYAL BLUE TINT #EFF6FF) ─── */}
      <div className="sticky top-0 z-30 min-h-[100svh] w-full flex flex-col justify-center bg-[#EFF6FF] rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.14)] overflow-hidden pt-4 sm:pt-8 pb-20 sm:pb-16">
        <AppFeaturesShowcase />
      </div>

      {/* ─── CARD 4: THE KADA ECOSYSTEM SECTION (SLATE/ICE #F8FAFC) ─── */}
      <div className="sticky top-0 z-40 min-h-[100svh] w-full flex flex-col justify-center bg-[#F8FAFC] rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.14)] overflow-hidden pt-4 sm:pt-8 pb-20 sm:pb-16">
        <EcosystemSection />
      </div>

      {/* ─── CARD 5: DOWNLOAD THE KADA APP SECTION (CRISP WHITE) ─── */}
      <div className="sticky top-0 z-50 min-h-[100svh] w-full flex flex-col justify-center bg-white rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.14)] overflow-hidden pt-4 sm:pt-8 pb-20 sm:pb-16">
        <GetAppSection />
      </div>

      {/* ─── SECTION 6: EXPLORE OPTIONS NEAR YOU (SLATE/ICE #F8FAFC - NATURAL FLOW TO FOOTER) ─── */}
      <div className="relative z-60 w-full bg-[#F8FAFC] rounded-t-[36px] sm:rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.14)] pt-12 sm:pt-16 pb-24 sm:pb-28">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
            Explore options near you
          </h2>

          {/* Accordion 1: Cuisines */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-sm transition-all">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
              className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800 cursor-pointer"
            >
              <span>Popular cuisines near me</span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                  openFaq === 1 ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 2: Restaurant Types */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-sm transition-all">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
              className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800 cursor-pointer"
            >
              <span>Popular restaurant types near me</span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                  openFaq === 2 ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 3: Top Restaurant Chains */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-sm transition-all">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
              className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800 cursor-pointer"
            >
              <span>Top Restaurant Chains</span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                  openFaq === 3 ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === 3 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accordion 4: Cities We Deliver To */}
          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-sm transition-all">
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
              className="flex w-full items-center justify-between p-5 text-left font-black text-base text-slate-800 cursor-pointer"
            >
              <span>Cities We Deliver To</span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                  openFaq === 4 ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openFaq === 4 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Interactive Map Picker Modal */}
      {showMapModal && (
        <MapLocationPickerModal
          initialLat={currentLoc.lat}
          initialLng={currentLoc.lng}
          onSelect={(res) => {
            setShowMapModal(false);
            const loc: DeliveryLocation = {
              lat: res.lat,
              lng: res.lng,
              label: res.label,
              area: res.area,
              line1: res.line1,
              pincode: res.pincode,
              isGps: false,
            };
            saveLocation(loc);
            setCurrentLoc(loc);
            toast(`Location set to ${loc.label}`);
          }}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Full Location Picker Sheet (Mobile bottom sheet / Desktop modal) */}
      <LocationPickerSheet
        isOpen={showLocationSheet}
        onClose={() => setShowLocationSheet(false)}
        onLocationSelected={(loc) => {
          setCurrentLoc(loc);
        }}
      />
    </div>
  );
}
