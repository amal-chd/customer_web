// "KD-0015", "DL-3", "Z-123456" or a bare "1016": an optional short letter
// prefix with a dash, then the number with any zero padding dropped.
const PREFIXED = /^(?:[A-Za-z]{1,4}-)?0*(\d+)$/;

/**
 * The order number people see, the same in every Kada app: "#1016".
 *
 * Older orders stored a prefix and padding ("KD-0015", "DL-0003"); those read
 * as "#15" and "#3", since the kind of order is already shown as a badge.
 * Zomato and Swiggy keep the platform's own number, which is what the
 * restaurant matches against that platform's tablet. An order with no number
 * shows a short code from its id, never the raw 20-character id.
 */
export function displayOrderNumber(orderNumber?: unknown, orderId?: string | null): string {
  const raw = String(orderNumber ?? "").trim();
  if (raw) {
    const m = PREFIXED.exec(raw);
    if (m) return `#${m[1]}`;
    return raw.startsWith("#") ? raw : `#${raw}`;
  }
  const id = String(orderId ?? "").trim();
  if (!id) return "#—";
  return `#${(id.length > 6 ? id.slice(-6) : id).toUpperCase()}`;
}

/** True when a search box query finds this order by its number: "1016", "#1016" or an old "KD-0015". */
export function orderNumberMatches(query: string, orderNumber?: unknown, orderId?: string | null): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const shown = displayOrderNumber(orderNumber, orderId).toLowerCase();
  return (
    shown.includes(q) ||
    shown.slice(1).includes(q.replace(/^#/, "")) ||
    String(orderNumber ?? "").toLowerCase().includes(q)
  );
}
