import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Mail,
  QrCode,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Navigation,
  UtensilsCrossed,
  CalendarCheck,
  Gift,
  ExternalLink,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  sendAppDownloadEmail,
  recordAppDownloadWhatsApp,
  generateWhatsAppShareUrl,
  OFFICIAL_APP_URLS,
} from "@/services/appLink";
import { toast } from "@/components/Toast";

export interface GetAppSectionProps {
  id?: string;
  className?: string;
  headline?: string;
  subtitle?: string;
  appName?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
];

type ScreenTab = "tracking" | "order" | "dining" | "rewards";

export const GetAppSection: React.FC<GetAppSectionProps> = ({
  id = "get-app-section",
  className = "",
  headline = "Get The Kada App",
  subtitle = "Experience lightning-fast hyper-local food delivery, 1-tap table reservations, and live GPS rider tracking across Kerala.",
  appStoreUrl = OFFICIAL_APP_URLS.appStore,
  playStoreUrl = OFFICIAL_APP_URLS.playStore,
}) => {
  // Mode selection: "email" | "whatsapp" | "qr" (Zero SMS)
  const [activeMode, setActiveMode] = useState<"email" | "whatsapp" | "qr">("email");
  const [selectedCountry, setSelectedCountry] = useState("+91");
  const [phoneVal, setPhoneVal] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);

  // Dynamic device detection
  const [detectedOs, setDetectedOs] = useState<"ios" | "android" | "desktop">("desktop");

  // Interactive phone screen preview
  const [activeScreen, setActiveScreen] = useState<ScreenTab>("tracking");
  const [isHoveringPhone, setIsHoveringPhone] = useState(false);

  // Auto-cycle interactive phone preview
  useEffect(() => {
    if (isHoveringPhone) return;
    const screens: ScreenTab[] = ["tracking", "order", "dining", "rewards"];
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        const nextIdx = (screens.indexOf(prev) + 1) % screens.length;
        return screens[nextIdx];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isHoveringPhone]);

  // Detect platform on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent || "";
    if (/iPad|iPhone|iPod/.test(ua)) {
      setDetectedOs("ios");
    } else if (/Android/.test(ua)) {
      setDetectedOs("android");
    } else {
      setDetectedOs("desktop");
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVal.trim() || !emailVal.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendAppDownloadEmail(emailVal);
      setIsSuccess(true);
      setSuccessMessage(res.message || `Download link sent to ${emailVal}`);
      toast.success("Download link sent to your email!");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send email link.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phoneVal.replace(/\D/g, "");
    if (digits.length < 10) {
      toast.error("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    setIsSubmitting(true);
    try {
      await recordAppDownloadWhatsApp(phoneVal, selectedCountry);
      const url = generateWhatsAppShareUrl(`${selectedCountry.replace("+", "")}${digits.slice(-10)}`);
      window.open(url, "_blank", "noopener,noreferrer");
      setIsSuccess(true);
      setSuccessMessage(`Opening WhatsApp with your instant download link!`);
      toast.success("Opening WhatsApp!");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Could not open WhatsApp.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(OFFICIAL_APP_URLS.smartDownload);
      setCopiedLink(true);
      toast.success("Download link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setPhoneVal("");
    setEmailVal("");
    setSuccessMessage("");
  };

  return (
    <section
      id={id}
      className={`relative overflow-hidden rounded-t-[44px] sm:rounded-t-[60px] lg:rounded-t-[72px] bg-gradient-to-b from-[#fafcff] via-[#f5f8fc] to-[#eef3f9] border-t border-slate-200/80 shadow-[0_-16px_48px_rgba(15,23,42,0.04)] -mt-8 sm:-mt-12 pt-16 sm:pt-24 pb-16 sm:pb-24 z-20 ${className}`}
    >
      {/* Top Side Curves Transition SVG */}
      <div className="absolute top-0 inset-x-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-6 sm:h-10 text-[#fafcff] fill-current block"
        >
          <path d="M0,40 C360,4 1080,4 1440,40 L1440,40 L0,40 Z" />
        </svg>
      </div>

      {/* Top Decorative Ambient Side Curves (Left and Right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="100" cy="100" r="140" strokeDasharray="6 6" />
          <circle cx="100" cy="100" r="190" />
          <circle cx="100" cy="100" r="240" strokeDasharray="4 4" />
        </svg>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 sm:w-96 sm:h-96 opacity-40"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full stroke-primary/20 fill-none" strokeWidth="1.2">
          <circle cx="300" cy="100" r="140" strokeDasharray="6 6" />
          <circle cx="300" cy="100" r="190" />
          <circle cx="300" cy="100" r="240" strokeDasharray="4 4" />
        </svg>
      </div>

      {/* Background Decorative Ambient Blurs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─────────────────────────────────────────────────────────────
            MOBILE VIEW: Dedicated Zomato-Style App Download Card
           ───────────────────────────────────────────────────────────── */}
        <div className="lg:hidden mb-8">
          <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#FFF0F2] via-[#FFF6F7] to-white border border-rose-100/80 p-6 pt-7 pb-8 shadow-xl overflow-hidden text-center">
            {/* Ambient background soft glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-rose-200/40 blur-2xl"
            />

            {/* Dual Phone Mockup Graphic */}
            <div className="relative w-64 max-w-[76vw] mx-auto mb-3 drop-shadow-xl animate-float-slow">
              <img
                src="/images/kada_app_phones.png"
                alt="The Kada Mobile App"
                className="w-full h-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>

            {/* Section Typography */}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Download the app now!
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-medium mt-2 max-w-xs mx-auto leading-relaxed">
              Experience seamless food ordering with the Kada app
            </p>

            {/* Official Store Download Badges Side-by-Side */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {/* Apple App Store Badge */}
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Download on the App Store"
                className="group flex items-center gap-2.5 rounded-xl bg-black px-3.5 py-2.5 text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg className="h-6 w-6 shrink-0 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.49 2.65-1.23z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">Download on the</p>
                  <p className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5">App Store</p>
                </div>
              </a>

              {/* Google Play Store Badge */}
              <a
                href={playStoreUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Get it on Google Play"
                className="group flex items-center gap-2.5 rounded-xl bg-black px-3.5 py-2.5 text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.22-.924V2.738c0-.348.08-.667.22-.924z" />
                  <path fill="#34A853" d="M15.206 13.412l2.253 2.253-11.45 6.442 9.197-8.695z" />
                  <path fill="#EA4335" d="M15.206 10.588L6.01 1.892l11.45 6.442-2.254 2.254z" />
                  <path fill="#FBBC04" d="M16.62 12l3.52-1.98a1.996 1.996 0 0 1 0 3.96L16.62 12z" />
                </svg>
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">GET IT ON</p>
                  <p className="text-xs sm:text-sm font-black text-white leading-tight mt-0.5">Google Play</p>
                </div>
              </a>
            </div>

            {/* Accordion / Optional Link sender for mobile */}
            <div className="mt-6 pt-4 border-t border-rose-100/80">
              <button
                type="button"
                onClick={() => setShowMobileForm(!showMobileForm)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>{showMobileForm ? "Hide share options" : "Need to send the link to another phone?"}</span>
                {showMobileForm ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              {showMobileForm && (
                <div className="mt-4 pt-3 text-left animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveMode("whatsapp")}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        activeMode === "whatsapp" ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMode("email")}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        activeMode === "email" ? "bg-primary text-white shadow-xs" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </button>
                  </div>

                  <form onSubmit={activeMode === "whatsapp" ? handleWhatsAppSubmit : handleEmailSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      {activeMode === "whatsapp" ? (
                        <input
                          type="tel"
                          value={phoneVal}
                          onChange={(e) => setPhoneVal(e.target.value)}
                          placeholder="Enter 10-digit mobile number"
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white"
                        />
                      ) : (
                        <input
                          type="email"
                          value={emailVal}
                          onChange={(e) => setEmailVal(e.target.value)}
                          placeholder="Enter email address"
                          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white"
                        />
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-bold shrink-0"
                      >
                        {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            DESKTOP VIEW: Full Interactive Experience (hidden on mobile)
           ───────────────────────────────────────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: Interactive Living Phone Mockup (Desktop Only)
             ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
            {/* Phone Screen Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-xs mb-6 max-w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveScreen("tracking")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeScreen === "tracking"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Navigation className="h-3 w-3 shrink-0" />
                <span>Live GPS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen("order")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeScreen === "order"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <UtensilsCrossed className="h-3 w-3 shrink-0" />
                <span>1-Tap Order</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen("dining")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeScreen === "dining"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <CalendarCheck className="h-3 w-3 shrink-0" />
                <span>Dine-In</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScreen("rewards")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeScreen === "rewards"
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Gift className="h-3 w-3 shrink-0" />
                <span>Offers</span>
              </button>
            </div>

            {/* Smartphone Device Shell */}
            <div
              className="relative w-64 sm:w-72 h-[520px] rounded-[3rem] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]"
              onMouseEnter={() => setIsHoveringPhone(true)}
              onMouseLeave={() => setIsHoveringPhone(false)}
            >
              {/* Dynamic Island / Speaker Pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-white/90 tracking-tight">Kada Live</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              </div>

              {/* Phone Screen Display */}
              <div className="h-full w-full rounded-[2.4rem] overflow-hidden bg-slate-900 text-white relative flex flex-col justify-between p-3.5 pt-8 select-none">
                {/* Screen 1: Live GPS Delivery Tracking */}
                {activeScreen === "tracking" && (
                  <div className="flex flex-col h-full justify-between animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <img src="/logo.png" alt="The Kada" className="h-5 w-5 object-contain" />
                        <span className="text-xs font-black text-white">Order #KD-8831</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        ON THE WAY
                      </span>
                    </div>

                    <div className="relative my-2 rounded-2xl bg-slate-800/80 p-3 border border-white/10 overflow-hidden">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold mb-2">
                        <span>ETA: <strong className="text-white text-xs font-black">18 Mins</strong></span>
                        <span className="text-emerald-400">2.4 km away</span>
                      </div>

                      <div className="relative h-20 w-full rounded-xl bg-slate-950/80 p-2 flex items-center justify-between border border-white/5">
                        <div className="flex flex-col items-center gap-1">
                          <div className="h-7 w-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-[10px]">
                            🍳
                          </div>
                          <span className="text-[8px] font-bold text-slate-400">Kitchen</span>
                        </div>

                        <div className="flex-1 mx-2 relative flex items-center justify-center">
                          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-400 to-primary w-2/3 animate-pulse" />
                          </div>
                          <div className="absolute left-2/3 -translate-x-1/2 -top-3.5 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg text-xs">
                            🛵
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[10px]">
                            📍
                          </div>
                          <span className="text-[8px] font-bold text-slate-400">Home</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center font-black text-xs text-white">
                          AK
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Rider Anoop K.</p>
                          <p className="text-[10px] text-slate-400">⭐ 4.9 · 1,420 deliveries</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-[10px] font-black border border-primary/30">
                        CALL RIDER
                      </div>
                    </div>

                    <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
                      Malabar Dum Biryani × 2 • Infopark Kakkanad
                    </div>
                  </div>
                )}

                {/* Screen 2: 1-Tap Food Ordering */}
                {activeScreen === "order" && (
                  <div className="flex flex-col h-full justify-between animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <p className="text-[9px] uppercase font-black text-primary">Delivering in 22 mins</p>
                        <p className="text-xs font-black text-white">Kakkanad, Kochi</p>
                      </div>
                      <span className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        🔍
                      </span>
                    </div>

                    <div className="my-auto rounded-2xl bg-white/5 border border-white/10 p-3 space-y-2.5">
                      <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-800">
                        <img
                          src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80"
                          alt="Dum Biryani"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-black">
                          BESTSELLER
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[9px] font-bold">
                          ⭐ 4.9 (420+)
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white">Thalassery Chicken Biryani</h4>
                          <span className="text-xs font-black text-emerald-400">₹220</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Aromatic kaima rice, tender chicken, ghee roast spices</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-[10px] text-emerald-400 font-bold">Coupon KADA50 applied (-₹100)</span>
                        <span className="text-[10px] line-through text-slate-500">₹320</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full rounded-xl bg-gradient-to-r from-primary to-blue-600 py-2.5 text-center text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>1-Tap Checkout • ₹120</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Screen 3: Dine-In & Table Reservation */}
                {activeScreen === "dining" && (
                  <div className="flex flex-col h-full justify-between animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <p className="text-[9px] uppercase font-black text-indigo-400">Table Reservation</p>
                        <p className="text-xs font-black text-white">Instant Confirmation</p>
                      </div>
                      <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-indigo-600">
                        CONFIRMED
                      </span>
                    </div>

                    <div className="my-auto rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-3 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                          🥂
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">The Malabar Coast Bistro</p>
                          <p className="text-[10px] text-slate-300">Fort Kochi Waterfront</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                        <div className="rounded-lg bg-white/5 p-2">
                          <p className="text-slate-400">Party Size</p>
                          <p className="text-white font-bold">4 Guests</p>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                          <p className="text-slate-400">Time Slot</p>
                          <p className="text-white font-bold">Today, 8:00 PM</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white text-slate-900 text-center space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Show Pass At Restaurant</p>
                        <div className="font-mono text-xs font-black tracking-widest text-primary">
                          #KADA-DINE-4402
                        </div>
                        <p className="text-[9px] font-bold text-emerald-600">Zero Booking Fee • Table Reserved</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/10 py-2 text-center text-white text-[11px] font-bold">
                      Navigate to Restaurant (GPS)
                    </div>
                  </div>
                )}

                {/* Screen 4: Rewards & Exclusive Perks */}
                {activeScreen === "rewards" && (
                  <div className="flex flex-col h-full justify-between animate-in fade-in duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-400 font-black">👑</span>
                        <span className="text-xs font-black text-white">Kada Club Perks</span>
                      </div>
                      <span className="text-[9px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        GOLD TIER
                      </span>
                    </div>

                    <div className="my-auto space-y-2.5">
                      <div className="rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-primary/20 border border-amber-400/40 p-3 text-center space-y-1">
                        <p className="text-[9px] uppercase font-black text-amber-300">Welcome Reward Unlocked</p>
                        <p className="text-base font-black text-white">Flat ₹150 OFF</p>
                        <p className="text-[10px] text-slate-300">+ Unlimited Free Delivery on first 3 orders</p>
                        <div className="inline-block mt-1 px-3 py-1 rounded-full bg-white text-slate-900 font-mono text-[10px] font-black tracking-wider">
                          CODE: KADAWELCOME
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🪙</span>
                          <div>
                            <p className="text-xs font-black text-white">500 Kada Coins</p>
                            <p className="text-[9px] text-slate-400">Worth ₹50 in cashback</p>
                          </div>
                        </div>
                        <button type="button" className="px-2 py-1 rounded bg-amber-500 text-slate-950 text-[10px] font-black">
                          REDEEM
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-center text-slate-950 text-xs font-black">
                      Claim Daily Scratch Card
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Micro Floating Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>4.8 / 5 Rating</span>
              </span>
              <span className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span>~22 Min Delivery</span>
              </span>
              <span className="flex items-center gap-1 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Partners</span>
              </span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: Action Center, Mode Selector, Forms, and Store Buttons
             ───────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Badge & Title */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-black text-primary border border-blue-200/80 mb-3">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                <span>Available for iOS & Android</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {headline}
              </h2>
              <p className="mt-3 text-sm sm:text-base font-medium text-slate-600 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            </div>

            {/* Interactive Mode Tabs (Email, WhatsApp, QR) */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 w-fit">
              <button
                type="button"
                onClick={() => {
                  setActiveMode("email");
                  setIsSuccess(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeMode === "email"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode("whatsapp");
                  setIsSuccess(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeMode === "whatsapp"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode("qr");
                  setIsSuccess(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                  activeMode === "qr"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>Scan QR Code</span>
              </button>
            </div>

            {/* Dynamic Form Area */}
            <div className="rounded-3xl bg-white p-5 sm:p-7 border border-slate-200/80 shadow-md">
              {/* SUCCESS STATE */}
              {isSuccess ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-sm sm:text-base font-black text-emerald-900">
                        Download Link Ready!
                      </h4>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                        {successMessage}
                      </p>
                      <p className="text-xs text-emerald-700 pt-1">
                        Install directly from the App Store or Google Play to start enjoying exclusive app perks.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs font-black text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                    >
                      Send to another email or number
                    </button>
                    <span className="text-emerald-300">|</span>
                    <a
                      href={generateWhatsAppShareUrl(phoneVal)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-900"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Open in WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  {/* EMAIL MODE */}
                  {activeMode === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                        Enter your email to receive direct App Store & Google Play links
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                          <input
                            type="email"
                            value={emailVal}
                            onChange={(e) => setEmailVal(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={isSubmitting}
                            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 transition-all whitespace-nowrap cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <span>Send Link</span>
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Instant direct email with verified store badges.</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveMode("whatsapp")}
                          className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Prefer WhatsApp?</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* WHATSAPP MODE */}
                  {activeMode === "whatsapp" && (
                    <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                        Enter your WhatsApp number for immediate 1-tap download access
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex rounded-2xl border border-slate-200 bg-white overflow-hidden focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 flex-1">
                          <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="bg-slate-50 border-r border-slate-200 px-3 py-3 text-xs sm:text-sm font-black text-slate-800 outline-none cursor-pointer"
                            aria-label="Country Code"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={phoneVal}
                            onChange={(e) => setPhoneVal(e.target.value)}
                            placeholder="Enter 10-digit WhatsApp number"
                            required
                            maxLength={15}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-black text-white shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 transition-all whitespace-nowrap cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Opening...</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4" />
                              <span>Open in WhatsApp</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Instant delivery right inside WhatsApp. Zero spam.</span>
                        </span>
                        <a
                          href={generateWhatsAppShareUrl()}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                        >
                          <span>Direct Link</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </form>
                  )}

                  {/* QR CODE SCAN MODE */}
                  {activeMode === "qr" && (
                    <div className="flex flex-col sm:flex-row items-center gap-6 py-2 animate-in fade-in">
                      {/* Crisp SVG QR Code Card */}
                      <div className="relative p-3 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0">
                        <div className="relative w-36 h-36 bg-slate-900 rounded-xl p-2.5 flex items-center justify-center">
                          <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
                            <rect x="0" y="0" width="28" height="28" rx="4" />
                            <rect x="5" y="5" width="18" height="18" rx="2" fill="#0f172a" />
                            <rect x="9" y="9" width="10" height="10" rx="1" fill="currentColor" />
                            <rect x="72" y="0" width="28" height="28" rx="4" />
                            <rect x="77" y="5" width="18" height="18" rx="2" fill="#0f172a" />
                            <rect x="81" y="9" width="10" height="10" rx="1" fill="currentColor" />
                            <rect x="0" y="72" width="28" height="28" rx="4" />
                            <rect x="5" y="77" width="18" height="18" rx="2" fill="#0f172a" />
                            <rect x="9" y="81" width="10" height="10" rx="1" fill="currentColor" />
                            <rect x="36" y="8" width="8" height="8" rx="1" />
                            <rect x="52" y="8" width="8" height="8" rx="1" />
                            <rect x="36" y="24" width="8" height="8" rx="1" />
                            <rect x="48" y="24" width="12" height="8" rx="1" />
                            <rect x="8" y="36" width="8" height="8" rx="1" />
                            <rect x="24" y="36" width="8" height="8" rx="1" />
                            <rect x="72" y="36" width="8" height="8" rx="1" />
                            <rect x="88" y="36" width="8" height="8" rx="1" />
                            <rect x="8" y="48" width="12" height="8" rx="1" />
                            <rect x="76" y="48" width="16" height="8" rx="1" />
                            <rect x="8" y="60" width="8" height="8" rx="1" />
                            <rect x="24" y="60" width="8" height="8" rx="1" />
                            <rect x="72" y="60" width="8" height="8" rx="1" />
                            <rect x="36" y="72" width="12" height="8" rx="1" />
                            <rect x="56" y="72" width="8" height="8" rx="1" />
                            <rect x="72" y="72" width="8" height="8" rx="1" />
                            <rect x="36" y="84" width="8" height="8" rx="1" />
                            <rect x="52" y="84" width="12" height="8" rx="1" />
                            <rect x="72" y="84" width="8" height="8" rx="1" />
                            <rect x="88" y="84" width="8" height="8" rx="1" />
                          </svg>

                          <div className="absolute inset-0 m-auto h-9 w-9 rounded-xl bg-white p-1 shadow-md flex items-center justify-center">
                            <img src="/logo.png" alt="The Kada" className="h-full w-full object-contain" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 flex-1 text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>Camera Scannable</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 leading-snug">
                          Point your camera at this code to install
                        </h4>
                        <p className="text-xs font-medium text-slate-600">
                          Works seamlessly on iOS Camera app and Android Google Lens. Automatically opens your phone’s App Store.
                        </p>

                        <div className="pt-1 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-black text-slate-800 transition-colors cursor-pointer"
                          >
                            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                            <span>{copiedLink ? "Link Copied!" : "Copy Direct Download Link"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Official Store Download Badges */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Direct Store Download
                </p>
                {detectedOs !== "desktop" && (
                  <span className="text-[11px] font-black text-primary bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Detected {detectedOs === "ios" ? "iPhone / iPad" : "Android"}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Google Play Store Badge */}
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Get it on Google Play"
                  className={`group relative flex items-center gap-3.5 rounded-2xl bg-slate-900 px-5 py-3 text-white transition-all duration-200 hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] shadow-md ${
                    detectedOs === "android" ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : ""
                  }`}
                >
                  {detectedOs === "android" && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Recommended
                    </span>
                  )}
                  <svg className="h-7 w-7 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.22-.924V2.738c0-.348.08-.667.22-.924z" />
                    <path fill="#34A853" d="M15.206 13.412l2.253 2.253-11.45 6.442 9.197-8.695z" />
                    <path fill="#EA4335" d="M15.206 10.588L6.01 1.892l11.45 6.442-2.254 2.254z" />
                    <path fill="#FBBC04" d="M16.62 12l3.52-1.98a1.996 1.996 0 0 1 0 3.96L16.62 12z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">GET IT ON</p>
                    <p className="text-sm font-black text-white leading-tight mt-0.5">Google Play</p>
                  </div>
                </a>

                {/* Apple App Store Badge */}
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Download on the App Store"
                  className={`group relative flex items-center gap-3.5 rounded-2xl bg-slate-900 px-5 py-3 text-white transition-all duration-200 hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] shadow-md ${
                    detectedOs === "ios" ? "ring-2 ring-primary ring-offset-2 ring-offset-white" : ""
                  }`}
                >
                  {detectedOs === "ios" && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                      Recommended
                    </span>
                  )}
                  <svg className="h-7 w-7 shrink-0 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73 1 .08 2.03-.49 2.65-1.23z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 leading-none">Download on the</p>
                    <p className="text-sm font-black text-white leading-tight mt-0.5">App Store</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetAppSection;
