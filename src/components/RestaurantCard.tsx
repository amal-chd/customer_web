import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Restaurant } from "@/types";
import { displayRating } from "@/types";
import { etaMinutes } from "@/lib/geo";
import { restaurantImage } from "@/lib/foodImages";
import { RatingPill } from "./bits";

export function RestaurantCard({ r }: { r: Restaurant }) {
  const rating = displayRating(r);
  const eta = etaMinutes(r.distanceKm);
  return (
    <Link to={`/restaurant/${r.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={restaurantImage(r)}
          alt={r.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-md bg-ink/80 px-2 py-1 text-[9px] font-black uppercase text-white">
          Free delivery
        </span>
        <span className="absolute bottom-2 left-2">
          <RatingPill value={rating} />
        </span>
      </div>
      <div className="mt-2">
        <h3 className="truncate text-sm font-extrabold text-ink">{r.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-sub">
          {r.cuisine ? <span className="truncate">{r.cuisine}</span> : null}
          {r.cuisine ? <span>·</span> : null}
          <Clock className="h-3 w-3" />
          {eta} min · {r.distanceKm.toFixed(1)} km
        </p>
      </div>
    </Link>
  );
}
