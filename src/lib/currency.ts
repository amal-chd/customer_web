// Mirrors the vendor web `src/lib/currency.ts` symbol/locale mapping.
const SYMBOLS: Record<string, string> = {
  "Indian Rupee (INR)": "₹",
  INR: "₹",
  "US Dollar (USD)": "$",
  USD: "$",
  "Euro (EUR)": "€",
  EUR: "€",
  "British Pound (GBP)": "£",
  GBP: "£",
  "UAE Dirham (AED)": "د.إ",
  AED: "د.إ",
};

export function currencySymbol(currency?: string): string {
  return SYMBOLS[currency ?? "INR"] ?? "₹";
}

function isInr(c?: string) {
  return !c || c === "INR" || c === "Indian Rupee (INR)";
}

export function formatMoney(amount: number, currency?: string): string {
  const sym = currencySymbol(currency);
  const decimals = isInr(currency) ? 0 : 2;
  return `${sym}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}
