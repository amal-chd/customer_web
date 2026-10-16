import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

/**
 * The landing page's section backgrounds: each section holds its own shade of
 * blue for most of its height and blends into the next shade only at the
 * bottom, so the page steps from midnight navy to ice while still reading as
 * one gradient. Each shade carries its own texture, faded towards the edges.
 */
export const SHADES = {
  navy: "#0f1f4f",
  royal: "#1e3a8a",
  vivid: "#2563eb",
  azure: "#0284c7",
  sky: "#38bdf8",
  ice: "#e0f2fe",
  snow: "#f8fafc",
} as const;

export type BackdropVariant = "navy" | "royal" | "vivid" | "azure" | "ice";

/** Background for the section card itself (its own shade → the next one). */
export function shadeBackground(variant: BackdropVariant): CSSProperties {
  const s = SHADES;
  const stops: Record<BackdropVariant, string> = {
    navy: `${s.navy} 0%, ${s.navy} 60%, ${s.royal} 100%`,
    royal: `${s.royal} 0%, ${s.royal} 60%, ${s.vivid} 100%`,
    vivid: `${s.vivid} 0%, ${s.vivid} 60%, ${s.azure} 100%`,
    azure: `${s.azure} 0%, ${s.azure} 60%, ${s.sky} 100%`,
    ice: `${s.sky} 0%, ${s.ice} 32%, ${s.snow} 100%`,
  };
  return { backgroundImage: `linear-gradient(180deg, ${stops[variant]})` };
}

const SOFT_EDGES = "radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)";

const PATTERNS: Record<BackdropVariant, CSSProperties> = {
  // Fine dot matrix.
  navy: {
    backgroundImage: "radial-gradient(rgba(147,197,253,0.22) 1px, transparent 1.2px)",
    backgroundSize: "22px 22px",
  },
  // Thin blueprint grid.
  royal: {
    backgroundImage:
      "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
    backgroundSize: "36px 36px",
  },
  // Concentric rings radiating from the top right.
  vivid: {
    backgroundImage:
      "repeating-radial-gradient(circle at 85% 10%, rgba(255,255,255,0.09) 0 1px, transparent 1px 34px)",
  },
  // Soft waves.
  azure: {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Cpath d='M0 20 Q30 4 60 20 T120 20' fill='none' stroke='rgba(255,255,255,0.14)' stroke-width='1.2'/%3E%3C/svg%3E\")",
    backgroundSize: "120px 40px",
  },
  // Light blue dots on ice.
  ice: {
    backgroundImage: "radial-gradient(rgba(37,99,235,0.18) 1px, transparent 1.2px)",
    backgroundSize: "22px 22px",
  },
};

const GLOWS: Record<BackdropVariant, [string, string]> = {
  navy: ["bg-indigo-500/25", "bg-sky-500/15"],
  royal: ["bg-violet-500/20", "bg-sky-400/15"],
  vivid: ["bg-cyan-300/20", "bg-indigo-400/20"],
  azure: ["bg-white/15", "bg-cyan-200/20"],
  ice: ["bg-blue-300/40", "bg-sky-200/50"],
};

/** Texture + glow layer; place as the first child of a positioned section. */
export function SectionBackdrop({ variant, fadeTop = false }: { variant: BackdropVariant; fadeTop?: boolean }) {
  const mask = fadeTop
    ? `${SOFT_EDGES}, linear-gradient(to bottom, transparent, black 140px)`
    : SOFT_EDGES;
  const [glowA, glowB] = GLOWS[variant];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          ...PATTERNS[variant],
          maskImage: mask,
          WebkitMaskImage: mask,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-[100px] ${glowA}`} />
      <div className={`absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-[110px] ${glowB}`} />
    </div>
  );
}

/** Height of the site's sticky header at a given viewport width. */
export type HeaderOffset = (viewportWidth: number) => number;

/** The customer site's header: hidden on phones, 56px on tablets, 64px on desktop. */
export const DEFAULT_HEADER_OFFSET: HeaderOffset = (w) => (w >= 1024 ? 64 : w >= 768 ? 56 : 0);

/**
 * A landing section card with clean layered depth. Cards naturally slide over
 * each other with rounded corners and elevated shadows without sticky freezing
 * or layout jumping.
 */
export function StackCard({
  className = "",
  style,
  children,
  headerOffset = DEFAULT_HEADER_OFFSET,
  pin = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  headerOffset?: HeaderOffset;
  /** false scrolls the card normally, so the next card never covers it (forms). */
  pin?: boolean;
}) {
  return (
    <div {...rest} style={style} className={`relative ${className}`}>
      {children}
    </div>
  );
}

const CARD_SHAPE =
  "-mt-8 sm:-mt-10 rounded-t-[2rem] sm:rounded-t-[2.5rem] shadow-[0_-12px_36px_rgba(0,0,0,0.18)] border-t border-white/10 w-full flex flex-col justify-start overflow-hidden";

/**
 * One shaded landing card: the stack position, the shade gradient and its
 * texture. Cards are layered in order, so pass increasing [layer] values.
 */
export function ShadeCard({
  variant,
  layer,
  id,
  fadeTop = false,
  padded = true,
  headerOffset,
  pin = true,
  className = "",
  children,
}: {
  variant: BackdropVariant;
  layer: number;
  id?: string;
  fadeTop?: boolean;
  /** Bottom padding that clears the next card's 2–2.5rem overlap with room to spare. */
  padded?: boolean;
  headerOffset?: HeaderOffset;
  /** false scrolls the card normally, so the next card never covers it (forms). */
  pin?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <StackCard
      id={id}
      headerOffset={headerOffset}
      pin={pin}
      className={`${CARD_SHAPE} ${padded ? "pb-16 sm:pb-20" : ""} ${className}`}
      style={{ ...shadeBackground(variant), zIndex: layer * 10 }}
    >
      <SectionBackdrop variant={variant} fadeTop={fadeTop} />
      <div className="relative z-10 w-full">{children}</div>
    </StackCard>
  );
}

/**
 * The light run after the ice card: continues the ice card's snow white so
 * extra sections (stories, FAQ, CTA) read as part of the same page.
 */
export function SnowSection({ layer, className = "", children }: { layer: number; className?: string; children: ReactNode }) {
  return (
    <div className={`relative w-full ${className}`} style={{ backgroundColor: SHADES.snow, zIndex: layer * 10 }}>
      {children}
    </div>
  );
}

/** Section heading in the customer landing's on-shade style (white on blue). */
export function ShadeHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Trailing words rendered in the sky→white gradient. */
  highlight?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 sm:mb-8 text-center ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-sky-200 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
              {highlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-100/90 mt-2 max-w-2xl mx-auto leading-relaxed text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
