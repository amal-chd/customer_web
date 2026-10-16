import { useEffect, useState } from "react";
import {
  X,
  Search,
  Navigation,
  MapPin,
  Home,
  Briefcase,
  Plus,
  Compass,
  CloudRain,
  ChevronRight,
  Trash2,
} from "lucide-react";
import {
  getDiscoveryLocation,
  saveLocation,
  requestBrowserLocation,
  searchPlaces,
  getSavedAddresses,
  saveAddressToStorage,
  deleteAddressFromStorage,
  POPULAR_AREAS,
  POPULAR_LOCALITIES,
  formatDistance,
  type DeliveryLocation,
  type DeliveryAddress,
  type PlaceSuggestion,
  type PopularLocality,
} from "@/services/location";
import { MapLocationPickerModal } from "@/components/MapLocationPickerModal";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/bits";
import { toast } from "@/components/Toast";

interface LocationPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelected?: (loc: DeliveryLocation) => void;
}

export function LocationPickerSheet({
  isOpen,
  onClose,
  onLocationSelected,
}: LocationPickerSheetProps) {
  const { user } = useAuth();
  const [currentLoc, setCurrentLoc] = useState<DeliveryLocation>(getDiscoveryLocation());
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentLoc(getDiscoveryLocation());
      loadSavedAddresses();
    }
  }, [isOpen, user]);

  async function loadSavedAddresses() {
    const list = await getSavedAddresses(user?.uid);
    setSavedAddresses(list);
  }

  if (!isOpen) return null;

  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const results = await searchPlaces(q);
    setSuggestions(results);
    setSearching(false);
  }

  function applyLocation(loc: DeliveryLocation) {
    saveLocation(loc);
    setCurrentLoc(loc);
    onLocationSelected?.(loc);
    onClose();
    toast(`Delivering to ${loc.label}`);
  }

  async function handleUseGps() {
    setLocating(true);
    try {
      const loc = await requestBrowserLocation();
      applyLocation(loc);
    } catch {
      toast("Could not access location. Please enable GPS permissions or select on map.");
    } finally {
      setLocating(false);
    }
  }

  function handleSelectSuggestion(s: PlaceSuggestion) {
    const loc: DeliveryLocation = {
      lat: s.lat,
      lng: s.lng,
      label: s.label,
      area: s.label,
      isGps: false,
    };
    applyLocation(loc);
  }

  function handleSelectPopularLocality(p: PopularLocality) {
    const loc: DeliveryLocation = {
      lat: p.lat,
      lng: p.lng,
      label: p.name,
      area: p.name,
      isGps: false,
    };
    applyLocation(loc);
  }

  function handleSelectPopular(p: (typeof POPULAR_AREAS)[0]) {
    const loc: DeliveryLocation = {
      lat: p.lat,
      lng: p.lng,
      label: `${p.name}, ${p.city}`,
      area: p.name,
      isGps: false,
    };
    applyLocation(loc);
  }

  function handleSelectSaved(addr: DeliveryAddress) {
    const loc: DeliveryLocation = {
      lat: addr.lat,
      lng: addr.lng,
      label: addr.area || addr.label,
      area: addr.area,
      line1: addr.line1,
      pincode: addr.pincode,
      isGps: false,
    };
    applyLocation(loc);
  }

  async function handleDeleteSaved(e: React.MouseEvent, id?: string) {
    e.stopPropagation();
    if (!id) return;
    const updated = await deleteAddressFromStorage(id, user?.uid);
    setSavedAddresses(updated);
    toast("Address removed.");
  }

  function getAddressIcon(label: string) {
    const l = label.toLowerCase();
    if (l.includes("home")) return <Home className="h-4 w-4 text-primary" />;
    if (l.includes("work") || l.includes("office")) return <Briefcase className="h-4 w-4 text-indigo-600" />;
    return <MapPin className="h-4 w-4 text-emerald-600" />;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-t-[2rem] sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
          {/* Mobile Drag Handle */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-5 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Select a location</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Current: <span className="text-primary font-bold">{currentLoc.label}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
            {/* Search Input */}
            <div className="relative">
              <div className="flex h-12 items-center rounded-2xl bg-slate-50 px-4 border border-slate-200 focus-within:border-primary focus-within:bg-white transition-all">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for area, street name..."
                  className="ml-3 flex-1 bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 outline-none"
                />
                {searching && <Spinner className="h-4 w-4 text-primary shrink-0" />}
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-14 z-30 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 max-h-56 overflow-y-auto">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSuggestion(s)}
                      className="flex w-full items-start gap-3 rounded-xl p-3 text-left hover:bg-slate-50 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{s.label}</p>
                        {s.secondary && (
                          <p className="truncate text-xs font-medium text-slate-500">{s.secondary}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grouped Quick Actions Card (Exact Mobile App Match) */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 shadow-sm">
              {/* 1. Use Current Location */}
              <button
                onClick={handleUseGps}
                disabled={locating}
                className="flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Navigation className={`h-5 w-5 ${locating ? "animate-spin" : ""}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-primary">
                    {locating ? "Locating with GPS..." : "Use current location"}
                  </p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    {currentLoc.isGps ? "Using your GPS coordinates" : currentLoc.label || "Detect via device GPS"}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              {/* 2. Add Address */}
              <button
                onClick={() => setShowMapModal(true)}
                className="flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-primary">Add Address</p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    Save address for 1-tap checkout
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              {/* 3. Select Location on Map */}
              <button
                onClick={() => setShowMapModal(true)}
                className="flex w-full items-center gap-3.5 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-primary">Select Location on Map</p>
                  <p className="truncate text-xs font-medium text-slate-500">
                    Drag pin to your exact building or gate
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Rain / Delivery Notice Banner (Zomato blue card) */}
            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-blue-900">
              <CloudRain className="h-6 w-6 text-blue-600 shrink-0" />
              <p className="text-xs font-semibold leading-relaxed">
                During rains or peak hours, delivery partners may take slightly longer to reach you safely.
              </p>
            </div>

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                  Saved Addresses
                </h3>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSaved(addr)}
                      className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-white">
                          {getAddressIcon(addr.label)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-900">{addr.label}</p>
                            {addr.lat && addr.lng && (
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                                {formatDistance(currentLoc.lat, currentLoc.lng, addr.lat, addr.lng)}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs font-medium text-slate-500 mt-0.5">
                            {[addr.line1, addr.area, addr.pincode].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSaved(e, addr.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove address"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Localities Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Popular Localities
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">
                  Kochi & Bengaluru
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POPULAR_LOCALITIES.map((loc) => {
                  const isSelected =
                    currentLoc.label.toLowerCase().includes(loc.name.toLowerCase()) ||
                    currentLoc.area?.toLowerCase() === loc.name.toLowerCase();

                  return (
                    <button
                      key={loc.name}
                      onClick={() => handleSelectPopularLocality(loc)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-xs"
                          : "border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-primary/40 text-slate-800"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className={`text-xs font-black truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                          {loc.name}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 truncate">
                          {loc.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected && <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Map Picker Modal */}
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
            // Automatically save to saved addresses if desired
            saveAddressToStorage(
              {
                label: "Pinned Location",
                line1: res.line1,
                area: res.area,
                landmark: res.landmark,
                pincode: res.pincode,
                lat: res.lat,
                lng: res.lng,
              },
              user?.uid
            ).then((list) => setSavedAddresses(list));

            applyLocation(loc);
          }}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </>
  );
}
