import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  X,
  Search,
  Navigation,
  MapPin,
  Check,
  Compass,
  Building,
} from "lucide-react";
import {
  reverseGeocode,
  searchPlaces,
  requestBrowserLocation,
  type PlaceSuggestion,
  type ReverseGeocodeResult,
} from "@/services/location";
import { Spinner } from "@/components/bits";

interface MapLocationPickerModalProps {
  initialLat?: number;
  initialLng?: number;
  onSelect: (result: {
    lat: number;
    lng: number;
    area: string;
    line1: string;
    landmark: string;
    pincode: string;
    label: string;
  }) => void;
  onClose: () => void;
}

export function MapLocationPickerModal({
  initialLat = 10.0159,
  initialLng = 76.3419,
  onSelect,
  onClose,
}: MapLocationPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [center, setCenter] = useState<[number, number]>([initialLat, initialLng]);
  const [resolving, setResolving] = useState(false);
  const [resolved, setResolved] = useState<ReverseGeocodeResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const debounceTimerRef = useRef<any>(null);
  const geocodeTimerRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 16,
      zoomControl: false,
    });

    // Clean modern OpenStreetMap CartoDB Positron / OSM tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    mapInstanceRef.current = map;

    // Trigger initial geocode
    triggerReverseGeocode(initialLat, initialLng);

    // Track center on map move
    const onMove = () => {
      const c = map.getCenter();
      setCenter([c.lat, c.lng]);
    };

    const onMoveEnd = () => {
      const c = map.getCenter();
      setCenter([c.lat, c.lng]);
      triggerReverseGeocode(c.lat, c.lng);
    };

    map.on("move", onMove);
    map.on("moveend", onMoveEnd);

    // Invalidate map size after animation
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.off("move", onMove);
      map.off("moveend", onMoveEnd);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  function triggerReverseGeocode(lat: number, lng: number) {
    if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    setResolving(true);
    geocodeTimerRef.current = setTimeout(async () => {
      try {
        const res = await reverseGeocode(lat, lng);
        setResolved(res);
      } catch {
        setResolved({
          area: "Selected Location",
          line1: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          landmark: "",
          pincode: "",
          fullAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      } finally {
        setResolving(false);
      }
    }, 300);
  }

  // Handle Search Input
  function handleSearchInput(q: string) {
    setSearchQuery(q);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (q.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    debounceTimerRef.current = setTimeout(async () => {
      const results = await searchPlaces(q);
      setSuggestions(results);
      setSearching(false);
    }, 350);
  }

  function handleSelectSuggestion(s: PlaceSuggestion) {
    setSuggestions([]);
    setSearchQuery(s.label);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([s.lat, s.lng], 16, { duration: 1.2 });
    }
  }

  async function handleLocateMe() {
    setLocating(true);
    try {
      const loc = await requestBrowserLocation();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([loc.lat, loc.lng], 17, { duration: 1.2 });
      }
    } catch (e) {
      console.warn("Could not get GPS location:", e);
    } finally {
      setLocating(false);
    }
  }

  function handleConfirm() {
    const area = resolved?.area || "Pinned Area";
    const line1 = resolved?.line1 || area;
    const landmark = resolved?.landmark || "";
    const pincode = resolved?.pincode || "";

    onSelect({
      lat: center[0],
      lng: center[1],
      area,
      line1,
      landmark,
      pincode,
      label: area,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex h-[100dvh] w-full max-w-3xl flex-col overflow-hidden bg-white sm:h-[88vh] sm:rounded-3xl sm:shadow-2xl">
        {/* Top Floating Header */}
        <div className="absolute inset-x-0 top-0 z-20 p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="flex h-12 items-center rounded-2xl bg-white px-4 shadow-lg border border-slate-100">
                <Search className="h-5 w-5 text-primary shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search for area, street name, apartment..."
                  className="ml-3 flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searching && <Spinner className="h-4 w-4 text-primary shrink-0" />}
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-14 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 max-h-60 overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(s)}
                      className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
                    >
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{s.label}</p>
                        {s.secondary && (
                          <p className="truncate text-xs font-medium text-slate-500">
                            {s.secondary}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="relative flex-1 w-full bg-slate-100">
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* Center Pin Indicator */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="-translate-y-7 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                {/* Pulsing ring */}
                <div className="absolute -inset-1 rounded-full bg-primary/20 animate-ping" />
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-xl ring-4 ring-white">
                  <MapPin className="h-6 w-6 fill-current" />
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-slate-900/60 shadow-md mt-1" />
            </div>
          </div>

          {/* Quick Locate Button */}
          <div className="absolute bottom-6 right-4 z-20">
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-xl border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all"
              title="Use Current Location"
            >
              <Navigation className={`h-5 w-5 ${locating ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Bottom Address Confirmation Sheet */}
        <div className="relative z-20 border-t border-slate-100 bg-white p-5 shadow-2xl sm:rounded-b-3xl">
          <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mb-4 sm:hidden" />

          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Building className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Delivery Location
                </span>
                {resolving && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                    <Spinner className="h-3 w-3" /> Pinpointing...
                  </span>
                )}
              </div>
              <h3 className="truncate text-lg font-black text-slate-900 mt-0.5">
                {resolved?.area || "Pin your exact address"}
              </h3>
              <p className="line-clamp-2 text-xs font-medium text-slate-500 mt-0.5">
                {resolved?.fullAddress || "Drag map to align the pin with your doorstep"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-[2] rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3.5 text-sm font-black text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check className="h-5 w-5" /> Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
