import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeliveryTrackingMapProps {
  restaurantLat?: number;
  restaurantLng?: number;
  restaurantName?: string;
  dropLat?: number;
  dropLng?: number;
  dropAddress?: string;
  riderLat?: number;
  riderLng?: number;
  riderName?: string;
  status: string;
}

export function DeliveryTrackingMap({
  restaurantLat,
  restaurantLng,
  restaurantName = "Restaurant",
  dropLat,
  dropLng,
  dropAddress = "Delivery Address",
  riderLat,
  riderLng,
  riderName = "Delivery Partner",
  status,
}: DeliveryTrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center (Kochi or provided drop)
    const initialCenter: [number, number] = [
      dropLat || restaurantLat || 10.0159,
      dropLng || restaurantLng || 76.3419,
    ];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      zoomControl: false,
    });

    // Clean modern Voyager tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Invalidate size on load
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Polylines whenever positions change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds: [number, number][] = [];

    // 1. Restaurant Marker (Orange Store Pin)
    if (restaurantLat && restaurantLng) {
      const restIcon = L.divIcon({
        className: "custom-leaflet-icon",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(217,119,6,0.4); border: 2.5px solid white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
                <path d="M2 7h20"/>
              </svg>
            </div>
            <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px; font-size: 11px; font-weight: 800; color: #1e293b; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-top: 3px; white-space: nowrap;">
              ${restaurantName}
            </div>
          </div>
        `,
        iconSize: [80, 60],
        iconAnchor: [40, 20],
      });

      L.marker([restaurantLat, restaurantLng], { icon: restIcon })
        .bindPopup(`<b>${restaurantName}</b><br>Order preparation hub`)
        .addTo(layerGroup);

      bounds.push([restaurantLat, restaurantLng]);
    }

    // 2. Drop / Delivery Marker (Royal Blue Home Pin)
    if (dropLat && dropLng) {
      const dropIcon = L.divIcon({
        className: "custom-leaflet-icon",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.45); border: 2.5px solid white;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div style="background: #2563eb; color: white; border-radius: 6px; padding: 2px 6px; font-size: 11px; font-weight: 800; box-shadow: 0 2px 6px rgba(0,0,0,0.12); margin-top: 3px; white-space: nowrap;">
              Your Location
            </div>
          </div>
        `,
        iconSize: [80, 60],
        iconAnchor: [40, 20],
      });

      L.marker([dropLat, dropLng], { icon: dropIcon })
        .bindPopup(`<b>Delivery Address</b><br>${dropAddress}`)
        .addTo(layerGroup);

      bounds.push([dropLat, dropLng]);
    }

    // 3. Rider Marker (Green Pulsing Delivery Partner Pin)
    if (riderLat && riderLng) {
      const riderIcon = L.divIcon({
        className: "custom-leaflet-icon",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: absolute; width: 48px; height: 48px; border-radius: 50%; background: rgba(34,197,94,0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(16,185,129,0.5); border: 2.5px solid white; z-index: 2;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5"/>
                <circle cx="5.5" cy="17.5" r="3.5"/>
                <circle cx="15" cy="5" r="1"/>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>
            <div style="background: #059669; color: white; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 800; box-shadow: 0 2px 6px rgba(0,0,0,0.12); margin-top: 3px; white-space: nowrap; z-index: 2;">
              ${riderName}
            </div>
          </div>
        `,
        iconSize: [80, 60],
        iconAnchor: [40, 21],
      });

      L.marker([riderLat, riderLng], { icon: riderIcon })
        .bindPopup(`<b>${riderName}</b><br>Live on the way`)
        .addTo(layerGroup);

      bounds.push([riderLat, riderLng]);
    }

    // 4. Draw Connecting Route Polyline
    const routePoints: [number, number][] = [];
    if (restaurantLat && restaurantLng) routePoints.push([restaurantLat, restaurantLng]);
    if (riderLat && riderLng) routePoints.push([riderLat, riderLng]);
    if (dropLat && dropLng) routePoints.push([dropLat, dropLng]);

    if (routePoints.length >= 2) {
      // Glow background line
      L.polyline(routePoints, {
        color: "#2563eb",
        weight: 6,
        opacity: 0.35,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layerGroup);

      // Dash primary route line
      L.polyline(routePoints, {
        color: "#2563eb",
        weight: 3.5,
        opacity: 0.9,
        dashArray: "6, 8",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(layerGroup);
    }

    // Auto fit bounds so all markers are visible
    if (bounds.length > 0) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [45, 45],
        maxZoom: 16,
      });
    }
  }, [restaurantLat, restaurantLng, dropLat, dropLng, riderLat, riderLng, restaurantName, riderName, dropAddress]);

  return (
    <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      {/* Floating status pill */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 shadow-md backdrop-blur border border-slate-100">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-black text-slate-800">
          Live Tracking · {status.replace(/_/g, " ").toUpperCase()}
        </span>
      </div>
    </div>
  );
}
