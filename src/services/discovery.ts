import {
  collection,
  endAt,
  getDocs,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { queryBounds, haversineKm } from "@/lib/geo";
import { restaurantFromDoc, menuItemFromDoc, type Restaurant, type MenuItem } from "@/types";

const DEFAULT_RADIUS_KM = 7;

let cachedResults: Restaurant[] | null = null;
let cachedMenu: MenuItem[] | null = null;
let cachedMenuKey = "";

export function getCachedResults() {
  return cachedResults;
}

/** Discover restaurants within radiusKm using geohash bounding boxes + haversine. */
export async function discoverNearby(
  lat: number,
  lng: number,
  radiusKm = DEFAULT_RADIUS_KM
): Promise<Restaurant[]> {
  const bounds = queryBounds(lat, lng, radiusKm);
  const col = collection(db, "restaurants");

  const snaps = await Promise.all(
    bounds.map((b) =>
      getDocs(query(col, orderBy("geohash"), startAt(b[0]), endAt(b[1])))
    )
  );

  const seen = new Set<string>();
  const results: Restaurant[] = [];
  for (const snap of snaps) {
    for (const doc of snap.docs) {
      if (seen.has(doc.id)) continue;
      seen.add(doc.id);
      const data = doc.data() as any;
      if (data.isBlocked === true || data.isDeleted === true || data.isOutlet === true) continue;
      const r = restaurantFromDoc(doc);
      if (r.lat == null || r.lng == null) continue;
      const d = haversineKm(lat, lng, r.lat, r.lng);
      if (d > radiusKm) continue;
      r.distanceKm = d;
      results.push(r);
    }
  }

  results.sort((a, b) => a.distanceKm - b.distanceKm);
  cachedResults = results;
  return results;
}

/** Menu items for a single restaurant. */
export async function fetchMenu(restaurantId: string): Promise<MenuItem[]> {
  const snap = await getDocs(
    query(collection(db, "menu"), where("restaurantId", "==", restaurantId))
  );
  return snap.docs.map(menuItemFromDoc).filter((m) => m.isAvailable);
}

/** Menu items across many restaurants (for dish-level search), batched + cached. */
export async function fetchMenuForRestaurants(ids: string[]): Promise<MenuItem[]> {
  if (ids.length === 0) return [];
  const key = [...ids].sort().join(",");
  if (cachedMenu && cachedMenuKey === key) return cachedMenu;

  const col = collection(db, "menu");
  const batches: Promise<any>[] = [];
  for (let i = 0; i < ids.length; i += 30) {
    const batch = ids.slice(i, i + 30);
    batches.push(getDocs(query(col, where("restaurantId", "in", batch))));
  }
  const snaps = await Promise.all(batches);
  const items: MenuItem[] = [];
  for (const snap of snaps) {
    for (const doc of snap.docs) {
      const item = menuItemFromDoc(doc);
      if (item.isAvailable) items.push(item);
    }
  }
  cachedMenu = items;
  cachedMenuKey = key;
  return items;
}
