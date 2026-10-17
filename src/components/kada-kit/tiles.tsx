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
 * The customer landing's "What's waiting for you" grid: white tiles in three
 * columns, the middle column lifted. 3, 6 or 9 tiles fill it evenly; 2, 4 or 8
 * tiles switch to two even columns so no row is left hanging.
 *
 * Phones get their own layout: two readable columns with the description
 * shown (three columns made 11px labels wrap onto three lines), and an odd
 * last tile spans the full width.
 */
export function TileGrid({ tiles }: { tiles: Tile[] }) {
  const cols = tiles.length % 3 !== 0 && tiles.length % 2 === 0 ? 2 : 3;
  // Three rows of tiles must still fit one screen with the heading above them.
  const dense = tiles.length > 6;
  const columns: Tile[][] = Array.from({ length: cols }, () => []);
  tiles.forEach((t, i) => columns[i % cols].push(t));
  return (
    <div
      className={`relative z-10 mx-auto px-4 w-full ${
        cols === 3 ? "max-w-md sm:max-w-2xl [@media(min-width:1024px)_and_(min-height:760px)]:max-w-4xl [@media(min-width:1280px)_and_(min-height:860px)]:max-w-5xl" : "max-w-sm sm:max-w-xl [@media(min-width:1024px)_and_(min-height:760px)]:max-w-2xl [@media(min-width:1280px)_and_(min-height:860px)]:max-w-3xl"
      }`}
    >
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {tiles.map((item, i) => {
          const wide = tiles.length % 2 === 1 && i === tiles.length - 1;
          return (
            <TileShell
              key={item.id}
              to={item.to}
              className={`group flex ${wide ? "col-span-2 flex-row items-center gap-3.5" : "flex-col items-start"} rounded-2xl bg-white p-4 text-left ring-1 ring-black/5 shadow-[0_8px_24px_rgba(2,32,92,0.18)] active:scale-[0.98] transition-transform`}
            >
              <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
                {item.icon}
              </div>
              <div className={wide ? "min-w-0" : "mt-3 min-w-0"}>
                <span className="block text-[15px] font-black text-slate-900 tracking-tight leading-snug">{item.title}</span>
                {item.desc && <span className="mt-1 block text-[13px] font-semibold text-slate-500 leading-snug">{item.desc}</span>}
              </div>
            </TileShell>
          );
        })}
      </div>

      <div className={`hidden sm:grid ${cols === 3 ? "grid-cols-3" : "grid-cols-2"} gap-3 sm:gap-4 [@media(min-width:1024px)_and_(min-height:760px)]:gap-6 items-start pt-1`}>
        {columns.map((column, colIdx) => (
          <div key={colIdx} className={`flex flex-col gap-3 sm:gap-4 [@media(min-width:1024px)_and_(min-height:760px)]:gap-6 ${cols === 3 && colIdx === 1 ? "-translate-y-2 sm:-translate-y-4" : ""}`}>
            {column.map((item) => (
              <TileShell
                key={item.id}
                to={item.to}
                className={`group flex flex-col items-center justify-between p-3 sm:p-4 [@media(min-width:1024px)_and_(min-height:760px)]:p-6 rounded-2xl sm:rounded-3xl bg-white/95 border border-white shadow-[0_6px_20px_rgba(2,132,199,0.08)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.16)] hover:-translate-y-0.5 transition-all duration-300 text-center ${
                  dense
                    ? "min-h-[92px] sm:min-h-[110px] [@media(min-width:1024px)_and_(min-height:760px)]:min-h-[120px] [@media(min-width:1280px)_and_(min-height:860px)]:min-h-[128px]"
                    : "min-h-[104px] sm:min-h-[140px] [@media(min-width:1024px)_and_(min-height:760px)]:min-h-[180px] [@media(min-width:1280px)_and_(min-height:860px)]:min-h-[215px]"
                } w-full ring-1 ring-black/5`}
              >
                <div className="flex-1 flex items-center justify-center w-full py-0.5">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 [@media(min-width:1024px)_and_(min-height:760px)]:h-14 [@media(min-width:1024px)_and_(min-height:760px)]:w-14 ${dense ? "" : "[@media(min-width:1280px)_and_(min-height:860px)]:h-20 [@media(min-width:1280px)_and_(min-height:860px)]:w-20"} rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6 [@media(min-width:1024px)_and_(min-height:760px)]:[&>svg]:h-7 [@media(min-width:1024px)_and_(min-height:760px)]:[&>svg]:w-7 ${dense ? "" : "[@media(min-width:1280px)_and_(min-height:860px)]:[&>svg]:h-9 [@media(min-width:1280px)_and_(min-height:860px)]:[&>svg]:w-9"}`}>
                    {item.icon}
                  </div>
                </div>
                <div className="mt-2 [@media(min-width:1024px)_and_(min-height:760px)]:mt-3">
                  <span className="block text-[11px] sm:text-sm [@media(min-width:1024px)_and_(min-height:760px)]:text-lg [@media(min-width:1280px)_and_(min-height:860px)]:text-xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  {item.desc && (
                    <span className="hidden sm:block text-xs [@media(min-width:1024px)_and_(min-height:760px)]:text-sm font-semibold text-slate-500 leading-snug mt-1">
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
    <ul className="relative z-10 mx-auto max-w-3xl [@media(min-width:1280px)_and_(min-height:860px)]:max-w-4xl px-4 sm:px-6 w-full space-y-3 sm:space-y-4 [@media(min-width:1280px)_and_(min-height:860px)]:space-y-5">
      {points.map((p, i) => (
        <li
          key={i}
          className="flex items-start gap-3 sm:gap-4 rounded-2xl bg-white/95 px-4 py-3.5 sm:px-6 sm:py-4 [@media(min-width:1280px)_and_(min-height:860px)]:px-8 [@media(min-width:1280px)_and_(min-height:860px)]:py-6 text-sm sm:text-lg [@media(min-width:1024px)_and_(min-height:760px)]:text-xl [@media(min-width:1280px)_and_(min-height:860px)]:text-2xl font-semibold text-slate-800 ring-1 ring-black/5 shadow-[0_6px_20px_rgba(2,132,199,0.08)]"
        >
          <Check className="mt-0.5 sm:mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-blue-600" strokeWidth={3} />
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
      <div className="kk-no-scrollbar flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 [@media(min-width:1024px)_and_(min-height:760px)]:gap-5 pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c) => (
          <SmartLink
            key={c.id}
            to={c.to}
            className="group relative snap-start shrink-0 w-[74vw] max-w-[300px] sm:w-auto h-[300px] sm:h-[320px] [@media(min-width:1024px)_and_(min-height:760px)]:h-[400px] [@media(min-width:1280px)_and_(min-height:860px)]:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-white/20 transition-all duration-300 flex flex-col justify-end"
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
            <div className="relative z-20 p-4 sm:p-5 text-white">
              <h3 className="text-base sm:text-lg [@media(min-width:1024px)_and_(min-height:760px)]:text-xl font-black tracking-tight leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                {c.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium line-clamp-1 mt-1">{c.subtitle}</p>
              <div className="mt-2 flex items-center justify-end pt-1.5 border-t border-white/10">
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-white/90 font-bold group-hover:text-blue-300 group-hover:translate-x-1 transition-all">
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
    <div className="relative z-10 mx-auto max-w-5xl [@media(min-width:1280px)_and_(min-height:860px)]:max-w-6xl px-4 sm:px-6 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 [@media(min-width:1024px)_and_(min-height:760px)]:gap-6 [@media(min-width:1280px)_and_(min-height:860px)]:gap-8">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl bg-white/95 p-4 sm:p-6 [@media(min-width:1024px)_and_(min-height:760px)]:p-8 [@media(min-width:1280px)_and_(min-height:860px)]:p-10 sm:min-h-[180px] [@media(min-width:1280px)_and_(min-height:860px)]:min-h-[260px] ring-1 ring-black/5 shadow-[0_6px_20px_rgba(2,132,199,0.08)]"
        >
          <span className="flex h-10 w-10 [@media(min-width:1024px)_and_(min-height:760px)]:h-12 [@media(min-width:1024px)_and_(min-height:760px)]:w-12 [@media(min-width:1280px)_and_(min-height:860px)]:h-16 [@media(min-width:1280px)_and_(min-height:860px)]:w-16 shrink-0 items-center justify-center rounded-xl [@media(min-width:1280px)_and_(min-height:860px)]:rounded-2xl bg-blue-600 text-base [@media(min-width:1024px)_and_(min-height:760px)]:text-lg [@media(min-width:1280px)_and_(min-height:860px)]:text-2xl font-black text-white">
            {i + 1}
          </span>
          <div className="min-w-0">
            <p className="text-base sm:text-lg [@media(min-width:1024px)_and_(min-height:760px)]:text-xl [@media(min-width:1280px)_and_(min-height:860px)]:text-3xl font-black text-slate-900 tracking-tight sm:mt-2">{s.title}</p>
            <p className="text-xs sm:text-sm [@media(min-width:1024px)_and_(min-height:760px)]:text-base [@media(min-width:1280px)_and_(min-height:860px)]:text-lg font-semibold text-slate-500 leading-snug mt-1 [@media(min-width:1280px)_and_(min-height:860px)]:mt-2">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** A centred row of call-to-action buttons under a shade heading. */
export function ShadeActions({ actions }: { actions: { label: string; to: string; primary?: boolean }[] }) {
  return (
    <div className="relative z-10 mt-7 sm:mt-10 flex flex-wrap items-center justify-center gap-3 px-4">
      {actions.map((a) => (
        <SmartLink
          key={a.label}
          to={a.to}
          className={
            a.primary
              ? "inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl bg-white px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-black text-blue-700 shadow-lg hover:scale-[1.03] active:scale-95 transition-all"
              : "inline-flex items-center gap-1.5 rounded-xl sm:rounded-2xl border border-white/30 bg-white/10 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
          }
        >
          {a.label}
          <ChevronRight className="h-4 w-4" />
        </SmartLink>
      ))}
    </div>
  );
}
