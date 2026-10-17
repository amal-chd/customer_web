import type { ReactNode } from "react";
import { ShadeCard, ShadeHeading } from "./shades";
import type { BackdropVariant, HeaderOffset } from "./shades";
import { TileGrid, ImageRail, StepRow, PointList, ShadeActions } from "./tiles";
import type { Tile, RailItem, Step } from "./tiles";

export interface StackCardSpec {
  id?: string;
  title: ReactNode;
  /** Trailing words in the sky gradient. */
  highlight?: ReactNode;
  subtitle?: ReactNode;
  tiles?: Tile[];
  rail?: RailItem[];
  steps?: Step[];
  points?: ReactNode[];
  actions?: { label: string; to: string; primary?: boolean }[];
  /** Anything else (a form, a table) on the card, below the heading. */
  children?: ReactNode;
  /** false: the card scrolls away normally instead of pinning (use for forms). */
  pin?: boolean;
}

const ORDER: BackdropVariant[] = ["navy", "royal", "vivid", "azure"];

/**
 * An inner page body built like the landing: stacked shade cards, each a short
 * heading plus one compact block (tiles, photo rail, steps or points).
 * Put it right after the page's PageHeader.
 */
export function ShadeStack({
  cards,
  headerOffset,
  startLayer = 1,
}: {
  cards: StackCardSpec[];
  headerOffset?: HeaderOffset;
  startLayer?: number;
}) {
  return (
    <>
      {/* The first card overlaps the band above it by 2–2.5rem (CARD_SHAPE);
          this strip takes that overlap so the header's buttons keep their room. */}
      <div aria-hidden="true" className="h-8 sm:h-10 bg-slate-50" />
      {cards.map((c, i) => (
        <ShadeCard
          key={i}
          variant={ORDER[i % ORDER.length]}
          layer={startLayer + i}
          fadeTop={i === 0}
          headerOffset={headerOffset}
          pin={c.pin}
          fullPage={i < cards.length - 1 || cards.length === 1}
        >
          <section id={c.id} className="py-6 sm:py-8">
            <ShadeHeading title={c.title} highlight={c.highlight} subtitle={c.subtitle} />
            {c.tiles && <TileGrid tiles={c.tiles} />}
            {c.rail && <ImageRail items={c.rail} />}
            {c.steps && <StepRow steps={c.steps} />}
            {c.points && <PointList points={c.points} />}
            {c.children && <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 w-full">{c.children}</div>}
            {c.actions && <ShadeActions actions={c.actions} />}
          </section>
        </ShadeCard>
      ))}
    </>
  );
}
