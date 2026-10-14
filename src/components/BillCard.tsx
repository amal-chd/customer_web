import { useState } from "react";
import { ChevronDown, Info, PiggyBank } from "lucide-react";
import type { BillRow } from "@/services/orders";
import { formatPaise } from "@/lib/billFormat";

function Line({ row, nested = false }: { row: BillRow; nested?: boolean }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!row.children?.length;
  const discount = row.amountPaise < 0;
  const green = discount || row.free;
  const struck = row.originalPaise != null && row.originalPaise !== row.amountPaise;

  const body = (
    <div className={`flex items-start gap-3 ${nested ? "py-0.5" : "py-1"}`}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={`${nested ? "text-[12.5px] font-semibold text-sub" : "text-[13.5px] font-bold text-slate-900"} ${
              hasChildren ? "underline decoration-dotted decoration-slate-400 underline-offset-2" : ""
            }`}
          >
            {row.label}
          </span>
          {hasChildren && <ChevronDown className={`h-4 w-4 text-sub transition-transform ${open ? "rotate-180" : ""}`} />}
          {row.info && (
            <span title={row.info} className="inline-flex text-sub" aria-label={row.info}>
              <Info className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
        {row.note && <p className="text-[11.5px] font-semibold text-sub">{row.note}</p>}
      </div>
      <div className="flex shrink-0 items-baseline gap-1.5">
        {struck && <span className="text-[12.5px] font-semibold text-slate-400 line-through">{formatPaise(row.originalPaise!)}</span>}
        <span className={`${nested ? "text-[12.5px] font-semibold" : "text-[13.5px] font-extrabold"} ${green ? "text-emerald-600" : nested ? "text-sub" : "text-slate-900"}`}>
          {row.free ? "FREE" : `${discount ? "− " : ""}${formatPaise(row.amountPaise)}`}
        </span>
      </div>
    </div>
  );

  if (!hasChildren) return body;
  return (
    <div>
      <button type="button" className="w-full text-left" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {body}
      </button>
      {open && (
        <div className="mb-1 ml-2.5 border-l-2 border-slate-200 pl-2.5">
          {row.children!.map((c) => (
            <Line key={c.key} row={c} nested />
          ))}
        </div>
      )}
    </div>
  );
}

/** Swiggy-style "Bill details", rendered from the server's bill. */
export function BillCard({
  rows,
  totalPaise,
  savingsPaise = 0,
  updating = false,
  problem,
  totalLabel = "To pay",
}: {
  rows: BillRow[];
  totalPaise: number;
  savingsPaise?: number;
  updating?: boolean;
  problem?: string | null;
  totalLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-4">
      {savingsPaise > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[12.5px] font-bold text-emerald-700">
          <PiggyBank className="h-4 w-4" />
          You saved <span className="font-black">{formatPaise(savingsPaise)}</span> on this order
        </div>
      )}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-black">Bill details</p>
        {updating && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />}
      </div>
      <div className={`transition-opacity ${updating ? "opacity-50" : ""}`}>
        {rows.map((r) => (
          <Line key={r.key} row={r} />
        ))}
      </div>
      {problem && <p className="mt-1 text-xs font-semibold text-red-600">{problem}</p>}
      <div className="my-3 h-px bg-slate-200" />
      <div className={`flex items-center justify-between transition-opacity ${updating ? "opacity-50" : ""}`}>
        <span className="text-[15px] font-black">{totalLabel}</span>
        <span className="text-base font-black">{formatPaise(totalPaise)}</span>
      </div>
    </div>
  );
}
