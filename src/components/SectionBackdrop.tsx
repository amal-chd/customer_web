import type { CSSProperties } from "react";

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

// Radial gradients, not blurred circles: blur filters on pinned cards were
// repainted on every scroll frame and made the stack stutter.
const GLOWS: Record<BackdropVariant, [string, string]> = {
  navy: ["rgba(99,102,241,0.25)", "rgba(14,165,233,0.15)"],
  royal: ["rgba(139,92,246,0.2)", "rgba(56,189,248,0.15)"],
  vivid: ["rgba(103,232,249,0.2)", "rgba(129,140,248,0.2)"],
  azure: ["rgba(255,255,255,0.15)", "rgba(165,243,252,0.2)"],
  ice: ["rgba(147,197,253,0.4)", "rgba(186,230,253,0.5)"],
};

const glow = (color: string) => ({ backgroundImage: `radial-gradient(closest-side, ${color}, transparent)` });

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
      <div className="absolute -top-48 -left-48 h-[30rem] w-[30rem]" style={glow(glowA)} />
      <div className="absolute -bottom-48 -right-40 h-[32rem] w-[32rem]" style={glow(glowB)} />
    </div>
  );
}
