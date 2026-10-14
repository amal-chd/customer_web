import { useState, useEffect, useRef } from "react";
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

  // App Link Form State (Email only)
  const [emailVal, setEmailVal] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
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

      {/* ─── 2. COLLECTIONS SECTION (ZOMATO SIGNATURE) ─────────────────────── */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
