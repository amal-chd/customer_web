import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search as SearchIcon,
  Bell,
  Frown,
  SlidersHorizontal,
  Star,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Store,
  Bike,
  Plus,
  Minus,
  ArrowRight,
  X,
} from "lucide-react";
import type { Restaurant, MenuItem, CustomerOrder, MenuVariant } from "@/types";
import { discoverNearby, getCachedResults, fetchMenuForRestaurants } from "@/services/discovery";
import {
  getDiscoveryLocation,
  onLocationChange,
  type DeliveryLocation,
} from "@/services/location";
import { subscribeMyOrders } from "@/services/orders";
import { RestaurantCard } from "@/components/RestaurantCard";
import { ShimmerCard, VegDot } from "@/components/bits";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { LocationPickerSheet } from "@/components/LocationPickerSheet";
import { menuItemImage } from "@/lib/foodImages";
import { formatMoney } from "@/lib/currency";
import { toast } from "@/components/Toast";
import {
  fetchActiveAds,
  recordAdImpression,
  recordAdClick,
  type PlatformAd,
} from "@/services/ads";

// Fallback promo slides if no admin ad campaigns are active
const DEFAULT_BANNER_SLIDES: PlatformAd[] = [
  {
    id: "default-banner-1",
    type: "banner",
    title: "Feast More, Spend Less",
    subtitle: "Flat 50% OFF up to ₹100 on your first food order. Use code KADA50.",
    tag: "SPECIAL OFFER",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80",
    searchQuery: "Biryani",
    priority: 100,
    active: true,
  },
  {
    id: "default-banner-2",
    type: "banner",
    title: "Gourmet Dining & Cloud Kitchens",
    subtitle: "Authentic flavors, chef specials, and late-night feasts delivered hot.",
    tag: "GOURMET SELECTION",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop&q=80",
    searchQuery: "Gourmet",
    priority: 90,
    active: true,
  },
  {
    id: "default-banner-3",
    type: "banner",
    title: "Zero Delivery Fee on ₹199+",
    subtitle: "Enjoy free doorstep delivery from verified neighborhood kitchens & restaurants.",
    tag: "KADA PERK",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&auto=format&fit=crop&q=80",
    searchQuery: "",
    priority: 80,
    active: true,
  },
];

// Rich Category Rail with Real Food Photos (matching customer mobile app)
const CATEGORIES = [
  { name: "Biryani", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80" },
  { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80" },
  { name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" },
  { name: "South Indian", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80" },
  { name: "Dosa", image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80" },
  { name: "Thali", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80" },
  { name: "Chicken", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80" },
  { name: "Shawarma", image: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=300&q=80" },
  { name: "Chinese", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80" },
  { name: "Momos", image: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=300&q=80" },
  { name: "Rolls", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=300&q=80" },
  { name: "Paratha", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80" },
  { name: "Paneer", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80" },
  { name: "Salad", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { name: "Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80" },
  { name: "Dessert", image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=300&q=80" },
  { name: "Coffee", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80" },
  { name: "Chai", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80" },
];

const ACTIVE_ORDER_STATUSES = [
  "new",
  "pending",
  "preparing",
  "cooking",
  "accepted",
  "in_progress",
  "ready",
  "out_for_delivery",
  "dispatched",
];

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useCart();

  const [loc, setLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [list, setList] = useState<Restaurant[]>(getCachedResults() ?? []);
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(!getCachedResults());
  const [dishesLoading, setDishesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active Order state
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);

  // Admin-managed platform ads
  const [ads, setAds] = useState<PlatformAd[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchActiveAds()
      .then((data) => setAds(data))
      .catch(() => {});
  }, []);

  const bannerSlides = useMemo(() => {
    const banners = ads.filter((a) => a.type === "banner");
    return banners.length > 0 ? banners : DEFAULT_BANNER_SLIDES;
  }, [ads]);

  const sponsoredAdsMap = useMemo(() => {
    const map = new Map<string, PlatformAd>();
    for (const ad of ads) {
      if (ad.type === "sponsored_restaurant" && ad.restaurantId) {
        map.set(ad.restaurantId, ad);
      }
    }
    return map;
  }, [ads]);

  // Auto-scroll hero ad banners every 5 seconds
  useEffect(() => {
    if (isPaused || bannerSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, bannerSlides.length]);

  // Track impressions on slide change
  useEffect(() => {
    const slide = bannerSlides[currentSlide];
    if (slide?.id && !slide.id.startsWith("default-banner-")) {
      recordAdImpression(slide.id);
    }
  }, [currentSlide, bannerSlides]);

  function handleBannerClick(ad: PlatformAd) {
    if (ad.id && !ad.id.startsWith("default-banner-")) {
      recordAdClick(ad.id);
    }
    if (ad.restaurantId) {
      navigate(`/restaurant/${ad.restaurantId}`);
    } else if (ad.searchQuery) {
      navigate(`/search?q=${encodeURIComponent(ad.searchQuery)}`);
    } else {
      document.getElementById("restaurants-feed")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handlePrevSlide(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  }

  function handleNextSlide(e: React.MouseEvent) {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }

  // Filters & Verticals
  const [activeVertical, setActiveVertical] = useState<string>(params.get("vertical") || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(params.get("category") || "");
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [fastDeliveryOnly, setFastDeliveryOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [modalItem, setModalItem] = useState<{ item: MenuItem; restaurant: Restaurant } | null>(null);

  async function load(l: DeliveryLocation) {
    setLoading((prev) => (list.length === 0 ? true : prev));
    setError(null);
    try {
      const results = await discoverNearby(l.lat, l.lng);
      setList(results);

      // Load dishes for the top nearby restaurants
      if (results.length > 0) {
        setDishesLoading(true);
        const topIds = results.slice(0, 8).map((r) => r.id);
        fetchMenuForRestaurants(topIds)
          .then((items) => setDishes(items))
          .catch(() => {})
          .finally(() => setDishesLoading(false));
      }
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

  // Subscribe to customer active orders for live status banner
  useEffect(() => {
    if (!user) {
      setActiveOrder(null);
      return;
    }
    return subscribeMyOrders((orders) => {
      const active = orders.find((o) =>
        ACTIVE_ORDER_STATUSES.includes(o.status.toLowerCase())
      );
      setActiveOrder(active || null);
    });
  }, [user]);

  // Filtered restaurants
  const filtered = useMemo(() => {
    return list.filter((r) => {
      // Category filter
      if (selectedCategory) {
        const q = selectedCategory.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(q) ||
          (r.cuisine ?? "").toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (minRating && (r.ratingAvg ?? 0) < minRating) return false;
      if (fastDeliveryOnly && r.distanceKm > 4) return false;
      return true;
    }).sort((a, b) => {
      const aIsSponsor = sponsoredAdsMap.has(a.id) ? 1 : 0;
      const bIsSponsor = sponsoredAdsMap.has(b.id) ? 1 : 0;
      if (aIsSponsor !== bIsSponsor) {
        return bIsSponsor - aIsSponsor;
      }
      if (sortBy === "rating") {
        return (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0);
      }
      return a.distanceKm - b.distanceKm;
    });
  }, [list, activeVertical, selectedCategory, minRating, fastDeliveryOnly, sortBy, sponsoredAdsMap]);

  // Curated lists
  const recommendedRestaurants = useMemo(() => {
    return list.filter((r) => (r.ratingAvg ?? 0) >= 4.0 || r.ratingCount >= 10).slice(0, 6);
  }, [list]);

  const popularDishes = useMemo(() => {
    return dishes.filter((d) => d.isRecommended || d.isAvailable).slice(0, 10);
  }, [dishes]);

  const budgetDishes = useMemo(() => {
    return dishes.filter((d) => d.price > 0 && d.price <= 149).slice(0, 10);
  }, [dishes]);

  function handleAddDish(dish: MenuItem) {
    const parentRest = list.find((r) => r.id === dish.restaurantId);
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

  return (
    <div className="min-h-screen bg-slate-50 antialiased selection:bg-primary/20 selection:text-primary pb-20">
      {/* ── Mobile Top Header ── */}
      <div className="md:hidden relative bg-white pt-5 pb-4 px-4 rounded-b-[2rem] shadow-xs border-b border-slate-100">
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
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:text-primary transition-colors"
            >
              <Bell className="h-5 w-5" />
              {activeOrder && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              )}
            </Link>
            <Link
              to="/account"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-sm shadow-md shadow-primary/20"
            >
              {(user?.displayName?.[0] ?? user?.email?.[0] ?? "K").toUpperCase()}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <button
          onClick={() => navigate("/search")}
          className="relative mt-4 flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all hover:bg-white hover:border-primary"
        >
          <SearchIcon className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-slate-400">Search restaurants, dishes, or cuisines...</span>
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        {/* ── 1. ACTIVE ORDER FLOATING LIVE BANNER ── */}
        {activeOrder && (
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
                  <Bike className="h-6 w-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                      Live Order in Progress
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                    {activeOrder.restaurantName || "Restaurant"} · {activeOrder.status.replace(/_/g, " ").toUpperCase()}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Delivering to {activeOrder.deliveryAddress ? activeOrder.deliveryAddress.split(",")[0] : "your address"}
                  </p>
                </div>
              </div>

              <Link
                to={`/orders/${activeOrder.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors shrink-0"
              >
                <span>Track Delivery Live</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}


        {/* ── 3. HERO AD BANNER CAROUSEL (Integrated with adminpanel platform_ads) ── */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 min-h-[280px] sm:min-h-[340px] md:min-h-[370px] lg:min-h-[390px] bg-slate-950 group select-none transition-all"
        >
          {bannerSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={slide.id || idx}
                onClick={() => handleBannerClick(slide)}
                className={`absolute inset-0 cursor-pointer transition-all duration-400 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10 pointer-events-auto visible"
                    : "opacity-0 z-0 pointer-events-none invisible"
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80"}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Gradient Overlays for High Contrast Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent sm:w-3/4" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent sm:hidden" />

                {/* Banner Content */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 md:p-10 max-w-2xl z-20">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-300 w-fit mb-2.5 sm:mb-3">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>{slide.tag || "FEATURED"}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-sm">
                    {slide.title}
                  </h2>

                  {slide.subtitle && (
                    <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base font-semibold text-slate-100/95 leading-normal sm:leading-relaxed drop-shadow-xs max-w-xl">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="rounded-2xl bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
                    >
                      <span>{slide.restaurantId ? "Order Now" : slide.searchQuery ? "Explore Deals" : "Explore Menu"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-300 hidden sm:inline">
                      Delivering to {loc.label.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Previous / Next Arrow Controls */}
          {bannerSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous Slide"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next Slide"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots */}
          {bannerSlides.length > 1 && (
            <div className="absolute bottom-4 right-4 sm:right-8 z-30 flex items-center gap-2">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-7 bg-white shadow-md shadow-white/30"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── 4. CATEGORY RAIL: "WHAT'S ON YOUR MIND?" ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              What&apos;s on your mind?
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory("")}
                className="text-xs font-black text-primary hover:underline"
              >
                Reset ({selectedCategory})
              </button>
            )}
          </div>

          <div className="no-scrollbar flex gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((c) => {
              const active = selectedCategory === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() =>
                    setSelectedCategory((prev) => (prev === c.name ? "" : c.name))
                  }
                  className="flex w-16 sm:w-20 shrink-0 flex-col items-center gap-2 transition-transform hover:-translate-y-1 group cursor-pointer"
                >
                  <div
                    className={`relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full overflow-hidden bg-slate-100 transition-all ${
                      active
                        ? "ring-4 ring-primary ring-offset-2 shadow-lg scale-105"
                        : "border-2 border-white shadow-xs group-hover:shadow-md group-hover:scale-105"
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <span
                    className={`text-xs font-black tracking-tight text-center truncate w-full transition-colors ${
                      active ? "text-primary font-black" : "text-slate-700 group-hover:text-primary"
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 6. RECOMMENDED FOR YOU (TOP RATED CAROUSEL) ── */}
        {recommendedRestaurants.length > 0 && !selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Recommended for You
                </h2>
                <p className="text-xs font-semibold text-slate-400">
                  Top-rated kitchens & stores based on customer reviews
                </p>
              </div>
              <Link to="/search?q=top" className="text-xs font-bold text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {recommendedRestaurants.map((r) => (
                <div key={r.id} className="w-64 sm:w-72 shrink-0">
                  <RestaurantCard r={r} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 7. POPULAR DISHES NEAR YOU (DIRECT ADD-TO-CART) ── */}
        {popularDishes.length > 0 && !selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Popular Dishes Near You
                </h2>
                <p className="text-xs font-semibold text-slate-400">
                  Add customer favourites straight to your cart
                </p>
              </div>
              <Link to="/search" className="text-xs font-bold text-primary hover:underline">
                Explore dishes
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {popularDishes.map((dish) => {
                const rest = list.find((r) => r.id === dish.restaurantId);
                const inCartQty = cart.qtyOf(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="w-56 sm:w-64 shrink-0 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={menuItemImage(dish)}
                          alt={dish.name}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
                      <div className="mt-2.5">
                        <h3 className="truncate text-sm font-black text-slate-900">
                          {dish.name}
                        </h3>
                        {rest && (
                          <p className="truncate text-xs font-medium text-slate-400 mt-0.5">
                            {rest.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-black text-slate-900">
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

        {/* ── 8. BUDGET PICKS (UNDER ₹149) ── */}
        {budgetDishes.length > 0 && !selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Pocket Friendly Picks (Under ₹149)
                </h2>
                <p className="text-xs font-semibold text-slate-400">
                  Delicious meals and snacks that fit every budget
                </p>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {budgetDishes.map((dish) => {
                const rest = list.find((r) => r.id === dish.restaurantId);
                const inCartQty = cart.qtyOf(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="w-52 sm:w-60 shrink-0 rounded-3xl border border-slate-200/80 bg-white p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={menuItemImage(dish)}
                          alt={dish.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <VegDot veg={dish.isVeg} />
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="truncate text-xs font-black text-slate-900">
                          {dish.name}
                        </h3>
                        {rest && (
                          <p className="truncate text-[11px] font-medium text-slate-400 mt-0.5">
                            {rest.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-black text-emerald-600">
                        {formatMoney(dish.price, rest?.currency)}
                      </span>
                      <button
                        onClick={() => handleAddDish(dish)}
                        className="rounded-xl border border-primary bg-white px-3 py-1 text-[11px] font-black text-primary shadow-xs hover:bg-primary hover:text-white transition-all active:scale-95"
                      >
                        {inCartQty > 0 ? `ADD (${inCartQty})` : "ADD"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 9. FILTER & SORTING TOOLBAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2">
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

            {(vegOnly || minRating || fastDeliveryOnly || selectedCategory) && (
              <button
                onClick={() => {
                  setVegOnly(false);
                  setMinRating(null);
                  setFastDeliveryOnly(false);
                  setSelectedCategory("");
                }}
                className="text-xs font-bold text-slate-500 hover:text-red-500 underline ml-2"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span className="text-slate-400">Sort by:</span>
            <button
              onClick={() => setSortBy("distance")}
              className={`rounded-lg px-2.5 py-1 ${
                sortBy === "distance" ? "bg-slate-900 text-white font-black" : "hover:text-slate-900"
              }`}
            >
              Distance
            </button>
            <button
              onClick={() => setSortBy("rating")}
              className={`rounded-lg px-2.5 py-1 ${
                sortBy === "rating" ? "bg-slate-900 text-white font-black" : "hover:text-slate-900"
              }`}
            >
              Rating
            </button>
          </div>
        </div>

        {/* ── 10. MAIN RESTAURANTS FEED ── */}
        <div id="restaurants-feed">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {selectedCategory
                  ? `${selectedCategory} places near ${loc.label.split(",")[0]}`
                  : `All Restaurants & Kitchens near ${loc.label.split(",")[0]}`}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {filtered.length} place{filtered.length === 1 ? "" : "s"} ready to deliver
              </p>
            </div>
          </div>

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
                  Try selecting Kakkanad, Infopark, or picking a different delivery location.
                </p>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary/20 hover:scale-105 transition-all"
                >
                  Pick different location
                </button>
              </div>
            ) : (
              filtered.map((r) => (
                <RestaurantCard
                  key={r.id}
                  r={r}
                  sponsorAd={sponsoredAdsMap.get(r.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── 11. PARTNER WITH THE KADA - ADD RESTAURANT CALLOUT ── */}
        <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shrink-0 shadow-sm border border-white/10">
              <Store className="h-7 w-7 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Own a restaurant or food business?</h3>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 border border-emerald-500/30">
                  PARTNER WITH US
                </span>
              </div>
              <p className="text-xs font-medium text-indigo-200 mt-1 max-w-xl">
                List your kitchen on The Kada Dine with 0% introductory commission. Get full cloud POS, predictive kitchen displays, and a dedicated hyperlocal delivery fleet.
              </p>
            </div>
          </div>

          <Link
            to="/add-restaurant"
            className="rounded-2xl bg-primary px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-primary/30 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 relative z-10"
          >
            <Store className="h-4 w-4" />
            <span>Add Your Restaurant</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ── Item Customization Modal (when adding dishes with variants) ── */}
      {modalItem && (
        <DiscoverItemModal
          item={modalItem.item}
          restaurant={modalItem.restaurant}
          onClose={() => setModalItem(null)}
        />
      )}

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

function DiscoverItemModal({
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
