import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface DeliveryLocation {
  lat: number;
  lng: number;
  label: string;
  area?: string;
  line1?: string;
  pincode?: string;
  isGps: boolean;
}

export interface DeliveryAddress {
  id?: string;
  label: string; // 'Home' | 'Work' | 'Other'
  line1: string;
  area: string;
  landmark?: string;
  pincode: string;
  lat: number;
  lng: number;
}

export interface ReverseGeocodeResult {
  area: string;
  line1: string;
  landmark: string;
  pincode: string;
  fullAddress: string;
}

export interface PlaceSuggestion {
  label: string;
  secondary: string;
  lat: number;
  lng: number;
}

const LOCATION_KEY = "kada_web_location";
const SAVED_ADDRESSES_KEY = "kada_saved_addresses";

// Sensible default centre: Kochi / Kakkanad IT Corridor (fallback if GPS unavailable)
export const DEFAULT_LOCATION: DeliveryLocation = {
  lat: 10.0159,
  lng: 76.3419,
  label: "Kakkanad, Kochi",
  area: "Kakkanad",
  line1: "Infopark Road",
  pincode: "682030",
  isGps: false,
};

export const POPULAR_AREAS = [
  { name: "Kakkanad", city: "Kochi", lat: 10.0159, lng: 76.3419 },
  { name: "Edachira", city: "Kakkanad", lat: 10.0094, lng: 76.3619 },
  { name: "Infopark", city: "Kochi", lat: 10.0105, lng: 76.3653 },
  { name: "Kaloor", city: "Kochi", lat: 9.9934, lng: 76.2929 },
  { name: "MG Road", city: "Kochi", lat: 9.9675, lng: 76.2841 },
  { name: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar", city: "Bengaluru", lat: 12.9784, lng: 77.6408 },
  { name: "HSR Layout", city: "Bengaluru", lat: 12.9121, lng: 77.6446 },
  { name: "Calicut Town", city: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "Trivandrum City", city: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
];

export interface PopularLocality {
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export const POPULAR_LOCALITIES: PopularLocality[] = [
  { name: "Kakkanad", city: "Kochi", lat: 10.0159, lng: 76.3419 },
  { name: "Edachira & Infopark", city: "Kochi", lat: 10.0094, lng: 76.3619 },
  { name: "Kaloor & Palarivattom", city: "Kochi", lat: 9.9934, lng: 76.2929 },
  { name: "MG Road & Marine Drive", city: "Kochi", lat: 9.9675, lng: 76.2841 },
  { name: "Fort Kochi & Mattancherry", city: "Kochi", lat: 9.9638, lng: 76.2435 },
  { name: "Panampilly Nagar", city: "Kochi", lat: 9.9602, lng: 76.2952 },
  { name: "Aluva & Kalamassery", city: "Kochi", lat: 10.1076, lng: 76.3516 },
  { name: "Koramangala", city: "Bengaluru", lat: 12.9352, lng: 77.6245 },
  { name: "Indiranagar", city: "Bengaluru", lat: 12.9784, lng: 77.6408 },
];

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const km = calculateDistanceKm(lat1, lon1, lat2, lon2);
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getSavedLocation(): DeliveryLocation | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as DeliveryLocation) : null;
  } catch {
    return null;
  }
}

export function saveLocation(loc: DeliveryLocation) {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("kada_location_changed", { detail: loc }));
    }
  } catch (e) {
    console.error("Failed to save location to localStorage:", e);
  }
}

export function getDiscoveryLocation(): DeliveryLocation {
  return getSavedLocation() ?? DEFAULT_LOCATION;
}

export function onLocationChange(callback: (loc: DeliveryLocation) => void): () => void {
  const handler = (e: Event) => {
    const custom = e as CustomEvent<DeliveryLocation>;
    if (custom.detail) callback(custom.detail);
  };
  window.addEventListener("kada_location_changed", handler);
  return () => window.removeEventListener("kada_location_changed", handler);
}

/**
 * Request real browser GPS coordinates and reverse-geocode to a friendly area.
 */
export async function requestBrowserLocation(): Promise<DeliveryLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let label = "Current location";
        let area = "Current location";
        let pincode = "";
        let line1 = "";

        try {
          const rev = await reverseGeocode(lat, lng);
          label = rev.area || rev.landmark || "Current location";
          area = rev.area;
          line1 = rev.line1;
          pincode = rev.pincode;
        } catch {
          // fallback to lat/lng label
        }

        const loc: DeliveryLocation = {
          lat,
          lng,
          label,
          area,
          line1,
          pincode,
          isGps: true,
        };
        saveLocation(loc);
        resolve(loc);
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/**
 * Reverse geocode latitude and longitude using OpenStreetMap Nominatim.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Reverse geocode HTTP ${res.status}`);
    }

    const data = await res.json();
    const addr = data.address || {};

    const area =
      addr.suburb ||
      addr.neighbourhood ||
      addr.residential ||
      addr.city_district ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      "Pinned Area";

    const line1 = [
      addr.building || addr.amenity || addr.shop || "",
      addr.house_number || "",
      addr.road || "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const landmark =
      addr.commercial ||
      addr.industrial ||
      addr.attraction ||
      addr.quarter ||
      "";

    const pincode = addr.postcode ? String(addr.postcode) : "";
    const fullAddress = data.display_name || [line1, area, pincode].filter(Boolean).join(", ");

    return {
      area,
      line1: line1 || area,
      landmark,
      pincode,
      fullAddress,
    };
  } catch (e) {
    console.warn("Reverse geocode fallback:", e);

    // Find closest popular locality if within ~15 km
    let bestName = "";
    let bestDist = Infinity;
    for (const p of POPULAR_LOCALITIES) {
      const d = calculateDistanceKm(lat, lng, p.lat, p.lng);
      if (d < bestDist) {
        bestDist = d;
        bestName = p.name;
      }
    }

    const fallbackArea = bestDist <= 15 && bestName ? bestName : "Pinned location";

    return {
      area: fallbackArea,
      line1: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      landmark: "",
      pincode: "",
      fullAddress: `${fallbackArea} (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
    };
  }
}

/**
 * Autocomplete / place search via OpenStreetMap Nominatim.
 */
export async function searchPlaces(queryText: string): Promise<PlaceSuggestion[]> {
  const q = queryText.trim();
  if (q.length < 2) return [];

  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=in&q=` +
      encodeURIComponent(q);
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
      address?: any;
    }>;

    return data.map((d) => {
      const parts = d.display_name.split(",").map((s) => s.trim());
      const primary = parts.slice(0, 2).join(", ");
      const secondary = parts.slice(2, 5).join(", ");

      return {
        label: primary,
        secondary: secondary || parts.slice(1).join(", "),
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon),
      };
    });
  } catch {
    return [];
  }
}

/**
 * Local and cloud storage for user's delivery addresses.
 */
export async function getSavedAddresses(uid?: string): Promise<DeliveryAddress[]> {
  const localList: DeliveryAddress[] = [];
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_KEY);
    if (raw) {
      localList.push(...JSON.parse(raw));
    }
  } catch {}

  if (!uid) return localList;

  try {
    const snap = await getDoc(doc(db, "customer_users", uid));
    if (snap.exists()) {
      const data = snap.data();
      const firestoreAddresses = (data.addresses || []) as any[];
      const mapped = firestoreAddresses.map((a, idx) => ({
        id: a.id || `addr_${idx}`,
        label: a.label || "Home",
        line1: a.line1 || "",
        area: a.area || "",
        landmark: a.landmark || "",
        pincode: a.pincode || "",
        lat: Number(a.lat || 0),
        lng: Number(a.lng || 0),
      }));

      // Combine unique addresses
      const combined = [...localList];
      for (const m of mapped) {
        if (!combined.some((c) => c.line1 === m.line1 && c.area === m.area)) {
          combined.push(m);
        }
      }
      return combined;
    }
  } catch (err) {
    console.warn("Could not fetch remote addresses:", err);
  }

  return localList;
}

export async function saveAddressToStorage(
  addr: DeliveryAddress,
  uid?: string
): Promise<DeliveryAddress[]> {
  const addresses = await getSavedAddresses(uid);
  const newAddr = {
    ...addr,
    id: addr.id || `addr_${Date.now()}`,
  };

  const existingIdx = addresses.findIndex(
    (a) => a.id === newAddr.id || (a.line1 === newAddr.line1 && a.area === newAddr.area)
  );

  let updated: DeliveryAddress[];
  if (existingIdx >= 0) {
    updated = [...addresses];
    updated[existingIdx] = newAddr;
  } else {
    updated = [newAddr, ...addresses];
  }

  try {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
  } catch {}

  if (uid) {
    try {
      const userDocRef = doc(db, "customer_users", uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        await updateDoc(userDocRef, {
          addresses: updated,
          primaryArea: newAddr.area,
          primaryPincode: newAddr.pincode,
          primaryLat: newAddr.lat,
          primaryLng: newAddr.lng,
        });
      } else {
        await setDoc(
          userDocRef,
          {
            addresses: updated,
            primaryArea: newAddr.area,
            primaryPincode: newAddr.pincode,
            primaryLat: newAddr.lat,
            primaryLng: newAddr.lng,
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn("Could not sync address to firestore:", e);
    }
  }

  return updated;
}

export async function deleteAddressFromStorage(
  addrId: string,
  uid?: string
): Promise<DeliveryAddress[]> {
  const addresses = await getSavedAddresses(uid);
  const updated = addresses.filter((a) => a.id !== addrId);

  try {
    localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
  } catch {}

  if (uid) {
    try {
      await updateDoc(doc(db, "customer_users", uid), {
        addresses: updated,
      });
    } catch (e) {
      console.warn("Could not sync address deletion to firestore:", e);
    }
  }

  return updated;
}

/** Geocode an address and return the single best match (or null). */
export async function geocodeAddress(
  queryText: string
): Promise<DeliveryLocation | null> {
  const [best] = await searchPlaces(queryText);
  return best
    ? {
        lat: best.lat,
        lng: best.lng,
        label: best.label,
        area: best.label,
        isGps: false,
      }
    : null;
}
