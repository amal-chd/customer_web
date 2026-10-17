import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Search,
  ChevronDown,
  ChevronRight,
  Navigation,
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
  POPULAR_AREAS,
  POPULAR_LOCALITIES,
  onLocationChange,
  type DeliveryLocation,
} from "@/services/location";
import { toast } from "@/components/Toast";
import { getVendorOnboardingUrl } from "@/lib/urls";
import { EcosystemSection } from "@/components/EcosystemSection";
import { AppFeaturesShowcase } from "@/components/AppFeaturesShowcase";
import { BetterFoodSection } from "@/components/BetterFoodSection";
import { GetAppSection } from "@/components/GetAppSection";
import { handleFoodImageError } from "@/lib/foodImages";
import { LocationPickerSheet } from "@/components/LocationPickerSheet";
import { MapLocationPickerModal } from "@/components/LazyMapPicker";
import { SectionBackdrop, shadeBackground } from "@/components/SectionBackdrop";
import { StackCard } from "@/components/kada-kit/shades";

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  badgeColor: string;
  to: string;
}

const SEARCH_SUGGESTIONS = [
  "Biryani", "Burger", "Pizza", "Shawarma", "Fried Chicken", "Porotta", "Beef Fry", "Mandhi",
  "Al Faham", "Dosa", "Meals", "Thali", "Noodles", "Fried Rice", "Momos", "Rolls", "Sandwich",
  "Cakes", "Desserts", "Ice Cream", "Juices", "Tea & Snacks", "Coffee", "Kerala", "Chinese", "Arabic",
];

const COLLECTIONS: CollectionItem[] = [
  {
    id: "trending",
    title: "Top Trending Spots",
    subtitle: "The most popular dining destinations this week",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    badge: "🔥 TRENDING",
    badgeColor: "bg-rose-600 text-white",
    to: "/search?q=Trending",
  },
  {
    id: "biryani",
    title: "Best Biryani in Town",
    subtitle: "Aromatic dum, Malabar, & Thalassery biryanis",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    badge: "👑 ICONIC MUST-TRY",
    badgeColor: "bg-amber-400 text-amber-950",
    to: "/search?q=Biryani",
  },
  {
    id: "cafes",
    title: "Cafes & Sweet Spots",
    subtitle: "Artisanal brews, cheesecakes, and cozy corners",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    badge: "☕ AESTHETIC VIBES",
    badgeColor: "bg-blue-600/95 text-white",
    to: "/search?q=Cafe",
  },
  {
    id: "dining",
    title: "Table Booking & Fine Dine",
    subtitle: "Reserve premium tables with zero booking fee",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    badge: "🥂 TABLE BOOKING",
    badgeColor: "bg-indigo-600/95 text-white",
    to: "/order?vertical=dining",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [currentLoc, setCurrentLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showLocationSheet, setShowLocationSheet] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [locating, setLocating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ label: string; secondary: string }[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Phones get the 480p cut (~1.3 MB), larger screens 720p (~2.8 MB). Data
  // saver or reduced motion: just the poster frame, no download.
  const [heroVideoSrc] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
    return window.innerWidth < 768 ? "/hero-480.mp4" : "/hero-720.mp4";
  });

  // Pause the hero video once it's scrolled out of view. A playing, transformed
  // video kept the GPU busy under the stacked cards, so they painted late (dark
  // gaps for a moment) when scrolling quickly further down the page.
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = heroVideoRef.current;
    const hero = heroRef.current;
    if (!video || !hero || heroVideoSrc == null) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [heroVideoSrc]);

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
        setSuggestions([]);
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

  // Instant, local suggestions: the real matching happens on /search.
  function handleSearchChange(val: string) {
    setSearchQuery(val);
    const q = val.trim().toLowerCase();
    if (q.length < 1) {
      setSuggestions([]);
      return;
    }
    const matches = SEARCH_SUGGESTIONS.filter((t) => t.toLowerCase().includes(q))
      .filter((t) => t.toLowerCase() !== q)
      .slice(0, 5)
      .map((t) => ({ label: t, secondary: "Dish or cuisine" }));
    setSuggestions([{ label: val.trim(), secondary: "Search restaurants and dishes" }, ...matches]);
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
    <div className="min-h-screen bg-[#0f1f4f] text-slate-900 font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* ─── 1. HERO SECTION WITH VIDEO BACKGROUND ─────────────────────────── */}
      <section
        ref={heroRef}
        className={`relative ${showLocationDropdown || suggestions.length > 0 ? "z-40" : "z-10"} h-[75dvh] min-h-[520px] sm:h-auto sm:min-h-[540px] md:min-h-[600px] w-full flex flex-col justify-center pt-12 pb-14 sm:pt-20 sm:pb-20 select-none bg-slate-950`}
      >
        {/* Background Video Wrapper (Clipped strictly to hero bounds) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ scale: videoScale, y: videoY }}
            className="absolute inset-0 will-change-transform"
          >
            <video
              ref={heroVideoRef}
              autoPlay={heroVideoSrc != null}
              loop
              muted
              playsInline
              preload={heroVideoSrc ? "auto" : "none"}
              poster="/hero-poster.jpg"
              src={heroVideoSrc ?? undefined}
              className="absolute -top-16 sm:-top-24 md:-top-32 inset-x-0 h-[calc(100%+8rem)] sm:h-[calc(100%+12rem)] md:h-[calc(100%+16rem)] w-full object-cover object-center translate-y-16 sm:translate-y-24 md:translate-y-32 scale-110"
            >
            </video>

            {/* Ambient Overlay Gradient (Zomato style) */}
            <motion.div
              style={{ opacity: videoDim }}
              className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/55"
            />
          </motion.div>
        </div>

        {/* ── Hero Center Content ── */}
        <motion.div
          style={{ y: contentY, opacity: showLocationDropdown || suggestions.length > 0 ? 1 : contentOpacity }}
          className="relative z-20 mx-auto w-full max-w-4xl px-4 sm:px-6 text-center my-auto py-12 will-change-transform"
        >
          {/* Logo + wordmark: phones only, where the site header is hidden (md:block). */}
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 flex items-center justify-center md:hidden"
          >
            <Link
              to="/"
              aria-label="The Kada home"
              className="inline-flex items-center gap-3 transition-transform active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/40 bg-white p-2 shadow-2xl shadow-black/40">
                <img src="/logo.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
                The <span className="italic text-primary-light">Kada</span>
              </span>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white/95 tracking-tight drop-shadow-md text-balance"
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
            className="mt-2 text-sm sm:text-base md:text-lg font-medium text-white/85 max-w-lg mx-auto drop-shadow-sm text-balance"
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
                  className="flex-1 flex h-10 items-center justify-between text-left truncate outline-none cursor-pointer group"
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
                  enterKeyHint="search"
                  aria-label="Search for restaurant, cuisine or a dish"
                  onKeyDown={(e) => e.key === "Escape" && setSuggestions([])}
                  className="flex-1 h-10 min-w-0 bg-transparent text-base sm:text-sm font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="hidden sm:flex h-9 shrink-0 items-center rounded-xl bg-primary px-4 text-xs font-black text-white transition-colors hover:bg-primary-dark"
                >
                  Search
                </button>
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

      </section>

      {/* ─── CARD 1: BETTER FOOD FOR EVERYONE (SHADE 1: DEEP MIDNIGHT NAVY BLUE) ─── */}
      <StackCard fill className="z-10 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.22)] border-t border-white/10 w-full flex flex-col justify-center overflow-hidden pb-8 sm:pb-10" style={shadeBackground("navy")}>
        <SectionBackdrop variant="navy" fadeTop />
        <BetterFoodSection />
      </StackCard>

      {/* ─── CARD 2: CURATED CITY GUIDES / COLLECTIONS (SHADE 2: ROYAL SAPPHIRE BLUE) ─── */}
      <StackCard fill className="z-20 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.22)] border-t border-white/10 w-full flex flex-col justify-center overflow-hidden pt-7 pb-[3.75rem] sm:pt-11 sm:pb-[5.25rem]" style={shadeBackground("royal")}>
        <SectionBackdrop variant="royal" />
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full overflow-hidden flex flex-col justify-center">
          <div className="mb-4 sm:mb-6 text-center">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
                Collections in{" "}
                <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  {currentLoc.label.split(",")[0]}
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-100/90 mt-2 max-w-2xl mx-auto leading-relaxed text-balance">
                Explore handpicked lists of top-rated spots, iconic food trails, and hidden dining gems based on local trends
              </p>
            </div>
          </div>

          {/* Collections Cards: Smooth horizontal scroll snap rail on mobile, clean 4-col grid on desktop */}
          <div className="flex sm:hidden items-center justify-between text-[10px] font-black uppercase tracking-wider text-blue-200/80 mb-1.5 px-1">
            <span>Swipe collections</span>
            <span className="text-sky-300 font-bold">Scroll →</span>
          </div>
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-5 pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 no-scrollbar touch-pan-x-scroll">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.id}
                to={c.to}
                className="group relative snap-start shrink-0 w-[72vw] max-w-[260px] sm:w-auto h-[220px] sm:h-[250px] lg:h-[270px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 border border-white/20 transition-all duration-300 flex flex-col justify-end"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  onError={(e) => handleFoodImageError(e, c.title)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none" />

                {/* Floating Badge Tag at top */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${c.badgeColor}`}
                  >
                    {c.badge}
                  </span>
                </div>

                {/* Card Content at bottom */}
                <div className="relative z-20 p-3 sm:p-3.5 text-white">
                  <h3 className="text-xs sm:text-sm lg:text-base font-black tracking-tight leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium line-clamp-1 mt-0.5">
                    {c.subtitle}
                  </p>
                  <div className="mt-2 flex items-center justify-end text-xs font-bold text-white/90 pt-1.5 border-t border-white/10">
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-white/90 font-bold group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                      <span>Explore</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Bottom Trail Chips to anchor the section ── */}
          <div className="mt-3.5 sm:mt-4 hidden sm:flex items-center justify-center gap-2 text-xs font-bold text-blue-100 bg-white/10 backdrop-blur-sm border border-white/20 py-1.5 px-4 rounded-full shadow-xs mx-auto">
            <span className="text-white font-black">Trending Trails:</span>
            <span className="hover:text-sky-300 transition-colors cursor-pointer">Thalassery Dum Trail</span>
            <span className="text-blue-300/40">·</span>
            <span className="hover:text-sky-300 transition-colors cursor-pointer">Fort Kochi Heritage Cafes</span>
            <span className="text-blue-300/40">·</span>
            <span className="hover:text-sky-300 transition-colors cursor-pointer">Kozhikode Beach Snacks</span>
            <span className="text-blue-300/40">·</span>
            <span className="hover:text-sky-300 transition-colors cursor-pointer">Trivandrum Coastal Dine</span>
          </div>
        </section>
      </StackCard>

      {/* ─── CARD 3: APP FEATURES SHOWCASE (SHADE 3: COBALT CERULEAN OCEAN BLUE) ─── */}
      <StackCard fill className="z-30 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.22)] border-t border-white/10 w-full flex flex-col justify-center overflow-hidden pb-8 sm:pb-10" style={shadeBackground("vivid")}>
        <SectionBackdrop variant="vivid" />
        <AppFeaturesShowcase />
      </StackCard>

      {/* ─── CARD 4: THE KADAVERSE ECOSYSTEM SECTION (SHADE 4: BRIGHT AZURE SKY BLUE) ─── */}
      <StackCard fill className="z-40 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.22)] border-t border-white/10 w-full flex flex-col justify-center overflow-hidden pb-8 sm:pb-10" style={shadeBackground("azure")}>
        <SectionBackdrop variant="azure" />
        <EcosystemSection />
      </StackCard>

      {/* ─── CARD 5: DOWNLOAD THE KADA APP SECTION (SHADE 5: SOFT GLACIER ICE LIGHT BLUE) ─── */}
      <StackCard
        id="get-app-section"
        className="z-50 -mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.22)] border-t border-white/10 w-full flex flex-col justify-center overflow-hidden"
        style={shadeBackground("ice")}
      >
        <SectionBackdrop variant="ice" />
        <GetAppSection />
      </StackCard>

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

