import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Restaurant } from "@/types";
import { displayRating } from "@/types";
import { etaMinutes } from "@/lib/geo";
import { restaurantImage, handleRestaurantImageError } from "@/lib/foodImages";
import { RatingPill } from "./bits";
import { recordAdClick, recordAdImpression, type PlatformAd } from "@/services/ads";

export function RestaurantCard({
  r,
  sponsorAd,
}: {
  r: Restaurant;
  sponsorAd?: PlatformAd;
}) {
  const rating = displayRating(r);
  const eta = etaMinutes(r.distanceKm);
  const isClosed = !r.acceptingOrders;

  useEffect(() => {
    if (sponsorAd?.id) {
      recordAdImpression(sponsorAd.id);
    }
  }, [sponsorAd?.id]);

  function handleClick() {
    if (sponsorAd?.id) {
      recordAdClick(sponsorAd.id);
    }
  }

  return (
    <Link
      to={`/restaurant/${r.id}`}
      onClick={handleClick}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
        <img
          src={restaurantImage(r)}
          alt={r.name}
          loading="lazy"
          onError={(e) => handleRestaurantImageError(e, r.cuisine ?? r.name)}
          className={`aspect-[16/11] sm:aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isClosed ? "grayscale-[40%] opacity-90" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {isClosed ? (
          <span className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 rounded-lg bg-red-600/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
            Closed
          </span>
        ) : (
          <span className="absolute left-2 top-2 sm:left-2.5 sm:top-2.5 rounded-lg bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
            Free delivery
          </span>
        )}

        {sponsorAd && (
          <span className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 rounded-md bg-slate-950/80 backdrop-blur-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300 shadow-xs border border-amber-400/30">
            Ad
          </span>
        )}

        <div className="absolute bottom-2 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between gap-1">
          <RatingPill value={rating} />
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-black text-white/95 bg-black/50 backdrop-blur-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md shrink-0">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            {eta} min
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="truncate text-xs sm:text-sm font-black text-slate-900 group-hover:text-primary transition-colors">
            {r.name}
          </h3>
          <span className="shrink-0 text-[10px] sm:text-xs font-bold text-slate-400">
            {r.distanceKm.toFixed(1)} km
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-slate-500">
          {r.cuisine || r.address || "Multi-cuisine · Fast Food"}
        </p>
      </div>
    </Link>
  );
}
