// Geohash + distance helpers. Encoding matches the vendor web `src/lib/geo.ts`
// and the Flutter apps' `geo_utils.dart`, so restaurant `geohash` values are
// interoperable across all clients.

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
const EARTH_RADIUS_KM = 6371;

export function encodeGeohash(lat: number, lng: number, precision = 9): string {
  let isEven = true;
  let bit = 0;
  let ch = 0;
  let out = "";
  const latRange = [-90, 90];
  const lngRange = [-180, 180];

  while (out.length < precision) {
    if (isEven) {
      const mid = (lngRange[0] + lngRange[1]) / 2;
      if (lng >= mid) {
        ch |= 1 << (4 - bit);
        lngRange[0] = mid;
      } else {
        lngRange[1] = mid;
      }
    } else {
      const mid = (latRange[0] + latRange[1]) / 2;
      if (lat >= mid) {
        ch |= 1 << (4 - bit);
        latRange[0] = mid;
      } else {
        latRange[1] = mid;
      }
    }
    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      out += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return out;
}

function precisionForRadius(radiusKm: number): number {
  if (radiusKm <= 0.019) return 8;
  if (radiusKm <= 0.076) return 7;
  if (radiusKm <= 0.61) return 6;
  if (radiusKm <= 2.4) return 5;
  if (radiusKm <= 20) return 4;
  if (radiusKm <= 78) return 3;
  if (radiusKm <= 630) return 2;
  return 1;
}

/** Geohash prefixes (centre + 8 neighbours) covering a circle of radiusKm. */
export function queryBounds(lat: number, lng: number, radiusKm: number): [string, string][] {
  const precision = precisionForRadius(radiusKm);
  const prefixes = new Set<string>([encodeGeohash(lat, lng, precision)]);
  // A cell is not square: longitude gets the extra bit on odd bit counts, so
  // its latitude span is half its longitude span at even precisions. Stepping
  // both axes by the longitude span skipped the north/south neighbours.
  const bits = 5 * precision;
  const latCellDeg = 180 / Math.pow(2, Math.floor(bits / 2));
  const lngCellDeg = 360 / Math.pow(2, Math.ceil(bits / 2));
  const dirs = [-1, 0, 1];
  for (const dLat of dirs) {
    for (const dLng of dirs) {
      const nLat = Math.min(90, Math.max(-90, lat + dLat * latCellDeg));
      let nLng = lng + dLng * lngCellDeg;
      if (nLng > 180) nLng -= 360;
      if (nLng < -180) nLng += 360;
      prefixes.add(encodeGeohash(nLat, nLng, precision));
    }
  }
  return Array.from(prefixes).map((p) => [p, p + "~"]);
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Rough ETA (minutes) from distance — prep + travel. */
export function etaMinutes(distanceKm: number): number {
  return Math.round(15 + distanceKm * 4);
}
