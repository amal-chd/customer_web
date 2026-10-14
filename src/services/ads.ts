import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  increment,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AdType = "banner" | "sponsored_restaurant";

export interface PlatformAd {
  id: string;
  type: AdType;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  restaurantId?: string;
  restaurantName?: string;
  searchQuery?: string;
  priority: number;
  active: boolean;
  endAt?: Date | null;
  impressions?: number;
  clicks?: number;
}

let cachedAds: PlatformAd[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes session cache
const impressedIds = new Set<string>();

/**
 * Fetch active ad campaigns from Firestore (`platform_ads`).
 * Sorted by priority desc. Filtered to active & unexpired campaigns.
 */
export async function fetchActiveAds(force = false): Promise<PlatformAd[]> {
  const now = Date.now();
  if (!force && cachedAds && now - cachedAt < CACHE_TTL_MS) {
    return cachedAds;
  }

  try {
    const q = query(
      collection(db, "platform_ads"),
      where("active", "==", true),
      limit(30)
    );
    const snap = await getDocs(q);
    const nowDate = new Date();
    const ads: PlatformAd[] = [];

    for (const d of snap.docs) {
      const data = d.data();
      let endAtDate: Date | null = null;
      if (data.endAt?.toDate) {
        endAtDate = data.endAt.toDate();
      } else if (data.endAt) {
        endAtDate = new Date(data.endAt);
      }

      // Filter out past expiration
      if (endAtDate && endAtDate < nowDate) {
        continue;
      }

      ads.push({
        id: d.id,
        type: (data.type as AdType) || "banner",
        title: data.title || "",
        subtitle: data.subtitle || "",
        tag: data.tag || "SPONSORED",
        imageUrl: data.imageUrl || "",
        restaurantId: data.restaurantId || "",
        restaurantName: data.restaurantName || "",
        searchQuery: data.searchQuery || "",
        priority: typeof data.priority === "number" ? data.priority : 0,
        active: Boolean(data.active),
        endAt: endAtDate,
        impressions: data.impressions || 0,
        clicks: data.clicks || 0,
      });
    }

    ads.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    cachedAds = ads;
    cachedAt = now;
    return ads;
  } catch (err) {
    console.warn("fetchActiveAds error:", err);
    return cachedAds || [];
  }
}

/**
 * Track an impression for an ad campaign.
 * Fire-and-forget; counted at most once per ad ID per user session.
 */
export function recordAdImpression(adId: string) {
  if (!adId || impressedIds.has(adId)) return;
  impressedIds.add(adId);
  try {
    const ref = doc(db, "platform_ads", adId);
    updateDoc(ref, { impressions: increment(1) }).catch(() => {});
  } catch {
    // Ignore safe tracking errors
  }
}

/**
 * Track a click for an ad campaign.
 */
export function recordAdClick(adId: string) {
  if (!adId) return;
  try {
    const ref = doc(db, "platform_ads", adId);
    updateDoc(ref, { clicks: increment(1) }).catch(() => {});
  } catch {
    // Ignore safe tracking errors
  }
}
