export interface DeliveryLocation {
  lat: number;
  lng: number;
  label: string;
  isGps: boolean;
}

const KEY = "kada_web_location";
// Sensible default centre so discovery still works if the user denies GPS.
const DEFAULT: DeliveryLocation = { lat: 12.9716, lng: 77.5946, label: "Bengaluru", isGps: false };

export function getSavedLocation(): DeliveryLocation | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DeliveryLocation) : null;
  } catch {
    return null;
  }
}

export function saveLocation(loc: DeliveryLocation) {
  localStorage.setItem(KEY, JSON.stringify(loc));
}

export function requestBrowserLocation(): Promise<DeliveryLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: DeliveryLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "Current location",
          isGps: true,
        };
        saveLocation(loc);
        resolve(loc);
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

/** Best-known location: saved → default. Caller can upgrade to GPS explicitly. */
export function getDiscoveryLocation(): DeliveryLocation {
  return getSavedLocation() ?? DEFAULT;
}

export interface PlaceSuggestion {
  label: string;
  lat: number;
  lng: number;
}

/**
 * Geocode a free-text address to real coordinates via OpenStreetMap Nominatim
 * (free, key-less). Biased to India. Returns the best matches so the caller can
 * show suggestions or take the first. Previously the web hard-coded Bengaluru
 * for any typed address, so "Edachira" (or anywhere) silently searched the wrong
 * city — this makes location search actually work.
 */
export async function searchPlaces(queryText: string): Promise<PlaceSuggestion[]> {
  const q = queryText.trim();
  if (q.length < 3) return [];
  try {
    const url =
      "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1" +
      "&limit=6&countrycodes=in&q=" +
      encodeURIComponent(q);
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    return data.map((d) => ({
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
      // Trim the long OSM display name to the first couple of segments.
      label: d.display_name.split(",").slice(0, 3).join(",").trim(),
    }));
  } catch {
    return [];
  }
}

/** Geocode an address and return the single best match (or null). */
export async function geocodeAddress(
  queryText: string
): Promise<DeliveryLocation | null> {
  const [best] = await searchPlaces(queryText);
  return best ? { ...best, isGps: false } : null;
}
