/**
 * Resolves URLs to other properties in The Kada ecosystem (Vendor Web, Vendor Dashboard Onboarding, etc.)
 * Intelligently switches between local development servers and production domains.
 */
export function getVendorOnboardingUrl(path: string = "/signup"): string {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      // Local dev: vendor_dash runs on port 5177
      return `http://localhost:5177${cleanPath}`;
    }
  }
  return `https://kadadine.thekada.in${cleanPath}`;
}

export function getVendorMarketingUrl(path: string = ""): string {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      // Local dev: vendor_web marketing site on port 5176 or 5177
      return `http://localhost:5176${cleanPath}`;
    }
  }
  return `https://kadadine.thekada.in${cleanPath}`;
}
