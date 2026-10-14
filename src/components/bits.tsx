import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Wordmark only. For the lockup with the app logo, use <Brand />.
 *  [light] renders the text white for use over dark backgrounds (hero/footer). */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("text-lg font-black tracking-tight", light && "text-white", className)}>
      The <span className="text-primary italic">Kada</span>
    </span>
  );
}

/** App-logo + wordmark lockup. */
export function Brand({
  className,
  wordmark = true,
  light = false,
}: {
  className?: string;
  wordmark?: boolean;
  light?: boolean;
}) {
  if (!light && wordmark) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <img
          src="/the-kada-logo.png"
          alt="The Kada"
          className="h-9 sm:h-10 w-auto object-contain"
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black shadow-md">
        K
      </div>
      {wordmark && <Logo light={light} />}
    </span>
  );
}

export function VegDot({ veg }: { veg: boolean }) {
  const color = veg ? "border-veg" : "border-nonveg";
  const fill = veg ? "bg-veg" : "bg-nonveg";
  return (
    <span className={cn("veg-dot", color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", fill)} />
    </span>
  );
}

export function RatingPill({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-bold text-slate-600">New</span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-rating px-1.5 py-0.5 text-[11px] font-bold text-white">
      {value.toFixed(1)}
      <Star className="h-3 w-3 fill-white" />
    </span>
  );
}

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < Math.round(value) ? "fill-[#F5A623] text-[#F5A623]" : "text-sub"}
        />
      ))}
    </span>
  );
}

export function ShimmerCard() {
  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="shimmer aspect-[4/3] w-full rounded-2xl" />
      <div className="mt-2 space-y-1.5">
        <div className="shimmer h-3.5 w-3/4 rounded" />
        <div className="shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary",
        className
      )}
    />
  );
}
