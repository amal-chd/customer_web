import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to);
// In-page anchors ("#contact") need a plain link so the browser scrolls.
const isAnchor = (to: string) => to.startsWith("#");

function SmartLink({ to, className, children }: { to: string; className: string; children: ReactNode }) {
  if (isAnchor(to)) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    );
  }
  return isExternal(to) ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export interface Tile {
  id: string;
  title: string;
  /** One short line (a few words). */
  desc?: string;
  icon: ReactNode;
  /** Where the tile links; without it the tile is not a link. */
  to?: string;
}

/**
 * The customer landing's "What's waiting for you" grid: small white tiles in
 * three columns, the middle column lifted. 3, 6 or 9 tiles fill it evenly;
 * 2, 4 or 8 tiles switch to two even columns so no row is left hanging.
 */
export function TileGrid({ tiles }: { tiles: Tile[] }) {
  const cols = tiles.length % 3 !== 0 && tiles.length % 2 === 0 ? 2 : 3;
  const columns: Tile[][] = Array.from({ length: cols }, () => []);
  tiles.forEach((t, i) => columns[i % cols].push(t));
  return (
    <div
      className={`relative z-10 mx-auto px-4 mt-3 sm:mt-5 w-full ${
        cols === 3 ? "max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl" : "max-w-xs sm:max-w-md md:max-w-lg"
      }`}
    >
      <div className={`grid ${cols === 3 ? "grid-cols-3" : "grid-cols-2"} gap-2.5 sm:gap-3.5 md:gap-4 items-start pt-1`}>
        {columns.map((column, colIdx) => (
          <div key={colIdx} className={`flex flex-col gap-2 sm:gap-3 ${cols === 3 && colIdx === 1 ? "-translate-y-2 sm:-translate-y-3" : ""}`}>
            {column.map((item) => (
              <TileShell
                key={item.id}
                to={item.to}
                className="group flex flex-col items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.16)] hover:-translate-y-0.5 transition-all duration-300 text-center min-h-[82px] sm:min-h-[96px] md:min-h-[105px] w-full ring-1 ring-black/5"
              >
                <div className="flex-1 flex items-center justify-center w-full py-0.5">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                    {item.icon}
                  </div>
                </div>
                <div className="mt-1">
                  <span className="block text-[10px] sm:text-xs md:text-sm font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  {item.desc && (
                    <span className="hidden sm:block text-[10px] md:text-[11px] font-semibold text-slate-500 leading-tight mt-0.5">
                      {item.desc}
                    </span>
                  )}
                </div>
              </TileShell>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TileShell({ to, className, children }: { to?: string; className: string; children: ReactNode }) {
  return to ? <SmartLink to={to} className={className}>{children}</SmartLink> : <div className={className}>{children}</div>;
}

/** Short checked points as white rows (for the "why" of a page). */
export function PointList({ points }: { points: ReactNode[] }) {
  return (
    <ul className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 w-full space-y-2.5">
      {points.map((p, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-2xl bg-white/95 px-4 py-3 text-sm sm:text-base font-semibold text-slate-800 ring-1 ring-black/5 shadow-[0_6px_20px_rgba(2,132,199,0.08)]"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={3} />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

export interface RailItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  /** Short uppercase tag on the image. */
  badge?: string;
  to: string;
}

/** The customer landing's "Collections" cards: a swipe rail on phones, four columns on desktop. */
export function ImageRail({ items, cue = "Swipe" }: { items: RailItem[]; cue?: string }) {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex sm:hidden items-center justify-between text-[10px] font-black uppercase tracking-wider text-blue-200/80 mb-1.5 px-1">
        <span>{cue}</span>
        <span className="text-sky-300 font-bold">Scroll →</span>
      </div>
      <div className="kk-no-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 lg:gap-5 pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => (
          <SmartLink
            key={c.id}
            to={c.to}
            className="group relative snap-start shrink-0 w-[72vw] max-w-[260px] sm:w-auto h-[220px] sm:h-[250px] lg:h-[270px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-white/20 transition-all duration-300 flex flex-col justify-end"
          >
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent pointer-events-none" />
            {c.badge && (
              <div className="absolute top-2.5 left-2.5 z-20">
                <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-white/90 text-slate-900 shadow-sm">
                  {c.badge}
                </span>
              </div>
            )}
            <div className="relative z-20 p-3 sm:p-3.5 text-white">
              <h3 className="text-xs sm:text-sm lg:text-base font-black tracking-tight leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                {c.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium line-clamp-1 mt-0.5">{c.subtitle}</p>
              <div className="mt-2 flex items-center justify-end pt-1.5 border-t border-white/10">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-white/90 font-bold group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
                  <span>Explore</span>
                  <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </SmartLink>
        ))}
      </div>
    </div>
  );
}

export interface Step {
  title: string;
  desc: string;
}

/** Three numbered steps as compact white cards. */
export function StepRow({ steps }: { steps: Step[] }) {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="flex sm:flex-col items-center sm:items-start gap-3 rounded-2xl bg-white/95 p-3.5 sm:p-5 ring-1 ring-black/5 shadow-[0_6px_20px_rgba(2,132,199,0.08)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{s.title}</p>
            <p className="text-xs font-semibold text-slate-500 leading-snug mt-0.5">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A centred row of call-to-action buttons under a shade heading. */
export function ShadeActions({ actions }: { actions: { label: string; to: string; primary?: boolean }[] }) {
  return (
    <div className="relative z-10 mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-2.5 px-4">
      {actions.map((a) => (
        <SmartLink
          key={a.label}
          to={a.to}
          className={
            a.primary
              ? "inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-blue-700 shadow-lg hover:scale-[1.03] active:scale-95 transition-all"
              : "inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
          }
        >
          {a.label}
          <ChevronRight className="h-4 w-4" />
        </SmartLink>
      ))}
    </div>
  );
}
