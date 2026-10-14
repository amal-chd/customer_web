import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Store, Building2, Bike, UtensilsCrossed, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinUsDropdownProps {
  isTransparent?: boolean;
  isHeaderSolid?: boolean;
}

export const JOIN_PARTNERS = [
  {
    name: "Restaurant",
    desc: "Cloud POS, QR ordering & food delivery",
    to: "/add-restaurant",
    isExternal: false,
    icon: Store,
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    hoverBg: "hover:bg-amber-500/5",
  },
  {
    name: "Host",
    desc: "Hotels, resorts, homestays & villas",
    href: "https://host.thekada.in/register",
    isExternal: true,
    icon: Building2,
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    hoverBg: "hover:bg-blue-500/5",
  },
  {
    name: "Rider",
    desc: "Deliver orders with flexible earnings",
    href: "https://rider.thekada.in/join",
    isExternal: true,
    icon: Bike,
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    hoverBg: "hover:bg-emerald-500/5",
  },
  {
    name: "Mess",
    desc: "Monthly meal plans & kitchen subscriptions",
    href: "https://thekada.in/products/kada-mess",
    isExternal: true,
    icon: UtensilsCrossed,
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    hoverBg: "hover:bg-purple-500/5",
  },
];

export function JoinUsDropdown({ isTransparent, isHeaderSolid }: JoinUsDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const buttonStyle = cn(
    "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-black transition-all select-none cursor-pointer",
    isTransparent && !isHeaderSolid
      ? "border-white/25 bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs"
      : "border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-primary"
  );

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={buttonStyle}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>Join Us</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-900/10 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Partner with The Kada
            </p>
          </div>
          <div className="flex flex-col gap-1 py-1">
            {JOIN_PARTNERS.map((partner) => {
              const Icon = partner.icon;
              const content = (
                <div
                  className={cn(
                    "flex items-start gap-3 rounded-xl p-2.5 transition-colors group cursor-pointer",
                    partner.hoverBg
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform group-hover:scale-105",
                      partner.badgeColor
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors">
                        {partner.name}
                      </span>
                      {partner.isExternal && (
                        <ArrowUpRight className="h-3 w-3 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-primary transition-opacity" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-snug line-clamp-2 mt-0.5">
                      {partner.desc}
                    </p>
                  </div>
                </div>
              );

              return partner.isExternal ? (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={partner.name}
                  to={partner.to!}
                  onClick={() => setOpen(false)}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
