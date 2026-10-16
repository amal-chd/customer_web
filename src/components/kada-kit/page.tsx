import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const isExternal = (to: string) => /^(https?:|mailto:|tel:)/.test(to);
// In-page anchors ("#contact") need a plain link so the browser scrolls.
const isAnchor = (to: string) => to.startsWith("#");

export interface PageAction {
  label: ReactNode;
  to: string;
}

/**
 * The opening of every inner page, as on customer_web's About/FAQ/Legal pages:
 * a light slate band with a pill, a bold centred title and one short line.
 * The first action is the primary (blue) button.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions = [],
  topOffset = 0,
  className = "",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: PageAction[];
  /** Height of a fixed site header the band must clear, in px. */
  topOffset?: number;
  className?: string;
}) {
  return (
    <section className={`relative bg-slate-50 pb-8 sm:pb-10 ${className}`} style={{ paddingTop: topOffset + 48 }}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-4">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-blue-600 [&>svg]:h-3.5 [&>svg]:w-3.5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg font-medium text-slate-500 max-w-xl mx-auto leading-relaxed text-balance">
            {subtitle}
          </p>
        )}
        {actions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {actions.map((a, i) => {
              const cls =
                i === 0
                  ? "inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                  : "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors";
              const inner = (
                <>
                  {a.label}
                  {i === 0 && <ArrowRight className="h-4 w-4" />}
                </>
              );
              return isAnchor(a.to) ? (
                <a key={i} href={a.to} className={cls}>
                  {inner}
                </a>
              ) : isExternal(a.to) ? (
                <a key={i} href={a.to} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={i} to={a.to} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
