import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PlatformStats {
  restaurants: {
    stat: string;
    mobileStat: string;
    rating: string;
    badgeText: string;
    badgeMobileText: string;
    count: number;
  };
  districts: {
    stat: string;
    mobileStat: string;
    count: number;
    badgeText: string;
    badgeMobileText: string;
  };
  orders: {
    stat: string;
    mobileStat: string;
    count: number;
    badgeText: string;
    badgeMobileText: string;
  };
}

// Shown while loading or if Firestore is unreachable: never a made-up number.
export const DEFAULT_PLATFORM_STATS: PlatformStats = {
  restaurants: {
    stat: "—",
    mobileStat: "—",
    rating: "",
    badgeText: "Verified partners",
    badgeMobileText: "Verified",
    count: 0,
  },
  districts: {
    stat: "—",
    mobileStat: "—",
    count: 0,
    badgeText: "Live order tracking",
    badgeMobileText: "Live tracking",
  },
  orders: {
    stat: "—",
    mobileStat: "—",
    count: 0,
    badgeText: "Live order tracking",
    badgeMobileText: "Tracked",
  },
};

function formatCount(num: number, isOrders = false): { stat: string; mobileStat: string } {
  if (num >= 1000000) {
    const formatted = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1);
    return {
      stat: isOrders ? `${formatted} Million+` : `${formatted}M+`,
      mobileStat: `${formatted}M+`,
    };
  }
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
    return {
      stat: `${num.toLocaleString()}+`,
      mobileStat: `${formatted}K+`,
    };
  }
  return {
    stat: `${num}+`,
    mobileStat: `${num}+`,
  };
}

let cachedStats: PlatformStats | null = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

/**
 * Fetches real platform statistics directly from Firestore database.
 * Computes live active restaurants, real districts, average quality score,
 * and sums order counters across restaurants with support for platform config overrides.
 */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  const now = Date.now();
  if (cachedStats && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedStats;
  }

  // Try retrieving cached stats from sessionStorage for instantaneous rendering
  if (!cachedStats && typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("thekada_platform_stats");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.restaurants && parsed.districts && parsed.orders) {
          cachedStats = parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
  }

  try {
    // 1. Fetch platform config if available
    let configPlatform: Record<string, any> | null = null;
    try {
      const pSnap = await getDoc(doc(db, "config", "platform"));
      if (pSnap.exists()) {
        configPlatform = pSnap.data();
      }
    } catch {
      // Optional platform config read
    }

    // 2. Fetch live restaurants from database
    const restSnap = await getDocs(collection(db, "restaurants"));
    const activeRestaurants = restSnap.docs.filter((d) => {
      const data = d.data();
      return !data.isBlocked && !data.isDeleted && !data.isOutlet;
    });

    const realRestaurantCount = activeRestaurants.length;

    // 3. Extract unique districts and compute average rating
    const districts = new Set<string>();
    let totalRating = 0;
    let ratingCount = 0;

    for (const docSnap of activeRestaurants) {
      const data = docSnap.data();
      const districtStr = data.district || data.city;
      if (typeof districtStr === "string" && districtStr.trim()) {
        districts.add(districtStr.trim().toLowerCase());
      }

      const r = data.ratingAvg ?? data.rating;
      if (typeof r === "number" && r > 0) {
        totalRating += r;
        ratingCount++;
      }
    }

    const calculatedAvgRating = ratingCount > 0 ? totalRating / ratingCount : null;

    // 4. Sum orderCounter across active restaurants from Firestore
    const counterPromises = activeRestaurants.map(async (d) => {
      try {
        const snap = await getDoc(doc(db, "restaurants", d.id, "meta", "orderCounter"));
        return snap.exists() ? (Number(snap.data()?.seq) || 0) : 0;
      } catch {
        return 0;
      }
    });

    const orderCounts = await Promise.all(counterPromises);
    const calculatedTotalOrders = orderCounts.reduce((sum, n) => sum + n, 0);

    // Apply baseline / platform overrides if configured
    const finalRestCount = Math.max(
      realRestaurantCount,
      Number(configPlatform?.totalRestaurants ?? 0)
    );
    const finalOrders = Math.max(
      calculatedTotalOrders,
      Number(configPlatform?.totalOrders ?? 0)
    );
    const finalDistricts = Math.max(
      Math.max(districts.size, 1),
      Number(configPlatform?.districtsCount ?? 0)
    );
    const ratingRaw = configPlatform?.ratingAvg ?? calculatedAvgRating;
    const finalRating = ratingRaw != null && Number(ratingRaw) > 0 ? Number(ratingRaw) : null;
    const avgDeliveryMin =
      configPlatform?.avgDeliveryMinutes != null ? Number(configPlatform.avgDeliveryMinutes) : null;

    const restFmt = formatCount(finalRestCount);
    const ordFmt = formatCount(finalOrders, true);

    const stats: PlatformStats = {
      restaurants: {
        stat: restFmt.stat,
        mobileStat: restFmt.mobileStat,
        rating: finalRating != null ? finalRating.toFixed(1) : "",
        badgeText: finalRating != null ? `${finalRating.toFixed(1)}/5 avg rating` : "Verified partners",
        badgeMobileText: finalRating != null ? `${finalRating.toFixed(1)} rating` : "Verified",
        count: finalRestCount,
      },
      districts: {
        stat: `${finalDistricts} ${finalDistricts === 1 ? "District" : "Districts"}`,
        mobileStat: `${finalDistricts}`,
        count: finalDistricts,
        badgeText: avgDeliveryMin ? `Avg ${avgDeliveryMin}-min delivery` : "Live order tracking",
        badgeMobileText: avgDeliveryMin ? `${avgDeliveryMin}m Avg` : "Live tracking",
      },
      orders: {
        stat: ordFmt.stat,
        mobileStat: ordFmt.mobileStat,
        count: finalOrders,
        badgeText: "Live order tracking",
        badgeMobileText: "Tracked",
      },
    };

    cachedStats = stats;
    lastFetchedAt = now;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("thekada_platform_stats", JSON.stringify(stats));
      } catch {
        // ignore storage errors
      }
    }

    return stats;
  } catch (err) {
    console.warn("Error fetching real database platform stats, falling back to cached or default:", err);
    return cachedStats || DEFAULT_PLATFORM_STATS;
  }
}
