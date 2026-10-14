import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Compass,
  Loader2,
  Leaf,
  Navigation,
  Bookmark,
  CalendarClock,
  Sparkles,
  Crown,
  Truck,
  BadgePercent,
  Star,
  Clock,
  ShieldCheck,
  Apple,
  Play,
} from "lucide-react";
import { geocodeAddress, requestBrowserLocation, saveLocation } from "@/services/location";
import { toast } from "@/components/Toast";
import { Reveal, CountUp } from "@/components/motion";

const FEATURES = [
  { icon: Navigation, label: "Live order tracking", blurb: "Follow your food from the kitchen to your door, minute by minute.", tint: "bg-blue-50 text-primary" },
  { icon: Leaf, label: "Veg Mode", blurb: "One tap for a pure-veg view of everything around you.", tint: "bg-emerald-50 text-emerald-600" },
  { icon: BadgePercent, label: "Everyday offers", blurb: "Coupons, cashback and member deals stacked on every order.", tint: "bg-amber-50 text-amber-600" },
  { icon: CalendarClock, label: "Schedule ahead", blurb: "Plan a party or breakfast — get it delivered right on time.", tint: "bg-violet-50 text-violet-600" },
];

const STEPS = [
  { img: "/mascot/bag.jpg", step: "01", title: "Pick your cravings", blurb: "Browse top-rated kitchens near you and build your order in a tap." },
  { img: "/mascot/scooter.jpg", step: "02", title: "We ride it over", blurb: "Our delivery partner picks it up hot and brings it straight to you." },
  { img: "/mascot/celebrate.jpg", step: "03", title: "Dig in & enjoy", blurb: "Track every step, then relax — great food is on the way." },
];

const CITIES = [
  "Kochi", "Kozhikode", "Thiruvananthapuram", "Thrissur", "Kannur",
  "Kollam", "Kottayam", "Alappuzha", "Palakkad", "Malappuram",
];

export default function Landing() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const loc = await requestBrowserLocation();
      setAddress(loc.label);
      toast("Location updated successfully!");
      navigate("/order");
    } catch {
      toast("Location access denied. Type an address or tap Find Food to continue.");
    } finally {
      setLocating(false);
    }
  };

  const handleFindFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setLocating(true);
      try {
        const loc = await geocodeAddress(address.trim());
        if (loc) {
          saveLocation(loc);
          navigate("/order");
        } else {
          toast("Couldn't find that location. Try a nearby area or use Locate Me.");
        }
      } finally {
        setLocating(false);
      }
    } else {
      setLocating(true);
      try {
        await requestBrowserLocation();
      } catch {
        /* fall through to /order with default */
      } finally {
        setLocating(false);
        navigate("/order");
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden selection:bg-primary/20 selection:text-primary-dark">
      {/* ─── Hero ──────────────────────────────────────────────── */}
      <section className="relative px-4 pt-28 pb-16 sm:px-6 lg:pt-40 lg:pb-24">
        {/* soft brand blobs */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-soft/60 via-indigo-100/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute right-[6%] top-1/3 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-6">
          {/* copy */}
          <div className="z-10 mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <Reveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary shadow-sm">
                <Sparkles className="h-3.5 w-3.5" /> Kerala&apos;s freshest food, on demand
              </div>
              <h1 className="text-[2.7rem] font-black leading-[1.04] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.2rem]">
                Your city&apos;s best food,
                <br />
                <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                  delivered with a smile.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-600 lg:mx-0">
                Discover top-rated local kitchens, order in a tap, and follow every
                step from the stove to your doorstep — live.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <form onSubmit={handleFindFood} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery location…"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                  <button
                    type="button"
                    onClick={handleLocateMe}
                    disabled={locating}
                    className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-bold text-primary transition hover:bg-primary/20 disabled:opacity-50"
                  >
                    {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Compass className="h-3.5 w-3.5" />}
                    Locate me
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={locating}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-black text-white shadow-lg shadow-primary/25 transition hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
                >
                  Find food <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["bg-primary", "bg-amber-400", "bg-emerald-500", "bg-indigo-500"].map((c) => (
                      <span key={c} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">Loved by food lovers</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.8
                  <span className="font-medium text-slate-400">· 12K+ ratings</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* mascot */}
          <Reveal delay={100} className="relative flex items-end justify-center lg:justify-end">
            <div className="relative">
              {/* pedestal glow */}
              <div className="absolute inset-x-6 bottom-6 h-40 rounded-[3rem] bg-gradient-to-br from-primary-soft to-indigo-100 blur-2xl" />
              <img
                src="/mascot/hero.jpg"
                alt="The Kada mascot giving a thumbs up"
                className="relative z-10 w-[280px] drop-shadow-2xl sm:w-[360px] lg:w-[420px]"
              />
              {/* floating chips */}
              <div className="animate-float absolute left-0 top-10 z-20 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur">
                <span className="rounded-xl bg-primary/10 p-2 text-primary"><Clock className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-black text-slate-900">Super fast</p>
                  <p className="text-[10px] font-semibold text-slate-500">Avg. 25 min</p>
                </div>
              </div>
              <div className="animate-float absolute -right-2 bottom-24 z-20 flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white/95 px-3.5 py-2.5 shadow-xl backdrop-blur" style={{ animationDelay: "1.2s" }}>
                <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><Navigation className="h-4 w-4" /></span>
                <div>
                  <p className="text-xs font-black text-slate-900">Live tracking</p>
                  <p className="text-[10px] font-semibold text-slate-500">Kitchen → door</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Impact band ───────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50/60 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 sm:px-6 md:grid-cols-4">
          {[
            { end: 500, suffix: "+", label: "Local kitchens" },
            { end: 25, suffix: " min", label: "Avg. delivery" },
            { end: 10, suffix: "+", label: "Cities in Kerala" },
            { end: 4.8, decimals: 1, label: "Average rating" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <p className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                <CountUp value={s.end} suffix={s.suffix ?? ""} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Why The Kada</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Everything you need for a{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">perfect meal</span>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.label} delay={i * 80}>
                <div className="group h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.tint} transition group-hover:scale-110`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{f.label}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{f.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works (mascot story) ───────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Three easy steps</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Great food is just a few taps away
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 120}>
                <div className="relative h-full rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="absolute right-5 top-4 text-5xl font-black text-slate-100">{s.step}</span>
                  <div className="mx-auto mb-4 w-40 overflow-hidden rounded-2xl">
                    <img src={s.img} alt={s.title} className="w-full" loading="lazy" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm font-medium leading-relaxed text-slate-500">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live tracking split (scooter) ─────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Never guess again</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Watch your order come to life
            </h2>
            <p className="mt-4 max-w-lg font-medium text-slate-600">
              From the moment the kitchen starts cooking to your rider pulling up
              outside — you see it all on a live map, with a real ETA you can trust.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                { icon: Truck, t: "Real-time rider on the map" },
                { icon: Clock, t: "Accurate, honest delivery ETAs" },
                { icon: ShieldCheck, t: "Contactless & safe hand-off" },
              ].map((r) => (
                <li key={r.t} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-slate-700">{r.t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              <div className="absolute inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary-soft to-indigo-100 blur-2xl" />
              <img src="/mascot/scooter.jpg" alt="The Kada delivery rider" className="relative w-[300px] rounded-[2rem] shadow-2xl sm:w-[380px]" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Gold membership band ──────────────────────────────── */}
      <section className="bg-slate-950 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-amber-300">
              <Crown className="h-3.5 w-3.5" /> The Kada Gold
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Kerala&apos;s smartest savings for food lovers
            </h2>
            <p className="mt-4 max-w-lg font-medium text-slate-300">
              Free delivery within 7 km and up to 30% extra off at partner
              restaurants — the more you order, the more you save.
            </p>
            <div className="mt-7 grid max-w-lg grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Truck className="h-6 w-6 text-amber-300" />
                <p className="mt-2 text-sm font-black text-white">Free delivery</p>
                <p className="text-xs font-medium text-slate-400">On orders within 7 km</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <BadgePercent className="h-6 w-6 text-amber-300" />
                <p className="mt-2 text-sm font-black text-white">Up to 30% off</p>
                <p className="text-xs font-medium text-slate-400">At partner kitchens</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="flex justify-center">
            <img src="/mascot/coffee.jpg" alt="Relaxing with The Kada Gold" className="w-[260px] rounded-[2rem] shadow-2xl sm:w-[300px]" loading="lazy" />
          </Reveal>
        </div>
      </section>

      {/* ─── App download ──────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary-soft to-amber-100 blur-2xl" />
              <img src="/mascot/celebrate.jpg" alt="Order on The Kada app" className="relative w-[280px] rounded-[2rem] shadow-2xl sm:w-[340px]" loading="lazy" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xs font-black uppercase tracking-widest text-primary">Get the app</p>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">
              The whole experience,
              <br /> in your pocket
            </h2>
            <p className="mt-4 max-w-md font-medium text-slate-600">
              Live tracking, one-tap reorders, app-only offers and a Dynamic Island
              that follows your food to the door.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800">
                <Apple className="h-5 w-5" /> App Store
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white transition hover:bg-slate-800">
                <Play className="h-5 w-5" /> Google Play
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Cities ────────────────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-widest text-primary">Now serving across Kerala</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {CITIES.map((c) => (
                <span key={c} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                  {c}
                </span>
              ))}
              <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-black text-primary shadow-sm">
                + many more
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Final CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-indigo-700 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.15),transparent_55%)]" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
          <Reveal>
            <img src="/mascot/thumbsup.jpg" alt="" className="mx-auto mb-6 w-28 rounded-3xl shadow-xl" loading="lazy" />
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
              Hungry yet?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-medium text-white/80">
              Set your location and discover the best food near you in seconds.
            </p>
            <div className="mt-8">
              <Link
                to="/order"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-black text-primary shadow-2xl transition hover:bg-slate-50 active:scale-[0.98]"
              >
                Explore restaurants <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
