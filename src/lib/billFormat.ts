/** ₹1,240 or ₹12.60 — paise shown when present, so lines visibly add up. */
export function formatPaise(paise: number): string {
  const rupees = Math.abs(paise) / 100;
  const whole = paise % 100 === 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(rupees);
}
