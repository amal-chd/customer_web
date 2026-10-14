import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clock, Star, Plus, Minus, Wallet, X } from "lucide-react";
import type { MenuItem, MenuVariant, Restaurant as R } from "@/types";
import { displayRating } from "@/types";
import { fetchMenu, getCachedResults } from "@/services/discovery";
import { getRestaurant } from "@/services/orders";
import { etaMinutes } from "@/lib/geo";
import { restaurantImage, menuItemImage } from "@/lib/foodImages";
import { formatMoney } from "@/lib/currency";
import { useCart } from "@/context/CartContext";
import { VegDot, Spinner } from "@/components/bits";
import { toast } from "@/components/Toast";
import { usePageSeo } from "@/components/RouteSeo";

const SITE_URL = "https://customer.thekada.in";

function currencyCode(currency?: string) {
  const code = currency?.match(/\(([A-Z]{3})\)/)?.[1] ?? currency;
  return code && /^[A-Z]{3}$/.test(code) ? code : "INR";
}

export default function Restaurant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cart = useCart();
  const [restaurant, setRestaurant] = useState<R | null>(
    () => getCachedResults()?.find((r) => r.id === id) ?? null
  );
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);

  const restaurantPath = id ? `/restaurant/${encodeURIComponent(id)}` : "/restaurant";
  const description = restaurant
    ? `Order ${restaurant.cuisine || "food"} from ${restaurant.name} online${restaurant.address ? ` in ${restaurant.address}` : ""}. Browse the menu and follow order updates with The Kada.`.slice(0, 160)
    : "Browse a restaurant menu and order online through The Kada.";
  const availableItems = menu.filter((item) => item.isAvailable);
  const restaurantSchema = restaurant
    ? {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: restaurant.name,
        url: `${SITE_URL}${restaurantPath}`,
        ...(restaurant.logoUrl ? { image: restaurant.logoUrl } : {}),
        ...(restaurant.cuisine ? { servesCuisine: restaurant.cuisine } : {}),
        ...(restaurant.address ? { address: restaurant.address } : {}),
        ...(restaurant.enableReservations ? { acceptsReservations: true } : {}),
        hasMenu: {
          "@type": "Menu",
          hasMenuSection: [...new Set(availableItems.map((item) => item.category))].map((category) => ({
            "@type": "MenuSection",
            name: category,
            hasMenuItem: availableItems
              .filter((item) => item.category === category)
              .map((item) => ({
                "@type": "MenuItem",
                name: item.name,
                ...(item.description ? { description: item.description } : {}),
                offers: {
                  "@type": "Offer",
                  price: String(item.price),
                  priceCurrency: currencyCode(restaurant.currency),
                },
              })),
          })),
        },
        ...(restaurant.ratingAvg != null && restaurant.ratingCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: restaurant.ratingAvg,
                reviewCount: restaurant.ratingCount,
              },
            }
          : {}),
      }
    : undefined;

  usePageSeo({
    path: restaurantPath,
    title: restaurant ? `${restaurant.name} Menu and Food Delivery` : "Restaurant Menu",
    description,
    indexable: Boolean(restaurant && availableItems.length > 0),
    ...(restaurant?.logoUrl ? { image: restaurant.logoUrl } : {}),
    ...(restaurantSchema ? { jsonLd: restaurantSchema } : {}),
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      if (!restaurant) {
        const r = await getRestaurant(id);
        setRestaurant(r);
      }
      const m = await fetchMenu(id);
      setMenu(m);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const grouped = useMemo(() => {
    const filtered = menu
      .filter((m) => !vegOnly || m.isVeg)
      .filter((m) => (query.trim() ? m.name.toLowerCase().includes(query.toLowerCase()) : true));
    const map = new Map<string, MenuItem[]>();
    for (const m of filtered) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return map;
  }, [menu, vegOnly, query]);

  function addBase(item: MenuItem) {
    if (item.variants.length > 0 || item.addons.length > 0) {
      setModalItem(item);
      return;
    }
    if (!restaurant) return;
    if (cart.conflictsWith(restaurant)) {
      if (!confirm(`Your cart has items from ${cart.restaurant?.name}. Clear it to order from ${restaurant.name}?`)) return;
      cart.clear();
    }
    cart.add(restaurant, item);
    toast(`${item.name} added to cart`);
  }

  if (loading && menu.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-8 text-center">
        <p className="font-bold">Restaurant not found.</p>
        <Link to="/order" className="btn-primary mt-4 inline-flex">Back to home</Link>
      </div>
    );
  }

  const rating = displayRating(restaurant);

  return (
    <div>
      <div className="relative h-52 w-full">
        <img src={restaurantImage(restaurant)} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="-mt-8 px-4">
        <div className="card p-5">
          <h1 className="text-xl font-black tracking-tight">{restaurant.name}</h1>
          {restaurant.cuisine && <p className="mt-0.5 text-sm font-bold text-primary">{restaurant.cuisine}</p>}
          {restaurant.address && <p className="mt-1 text-xs font-semibold text-sub">{restaurant.address}</p>}

          <div className="mt-4 grid grid-cols-3 divide-x divide-line rounded-xl border border-line bg-canvas py-3 text-center">
            <Metric icon={<Star className="h-4 w-4 text-amber-500" />} title={rating != null ? `${rating.toFixed(1)} ★` : "New"} sub={rating != null ? `${restaurant.ratingCount} ratings` : "No ratings yet"} />
            <Metric icon={<Clock className="h-4 w-4 text-primary" />} title={`${etaMinutes(restaurant.distanceKm)} min`} sub={`${restaurant.distanceKm.toFixed(1)} km`} />
            <Metric icon={<Wallet className="h-4 w-4 text-emerald-600" />} title={priceForTwo(menu, restaurant.currency)} sub="For two" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-30 mt-4 flex items-center gap-2 bg-slate-50/95 px-4 py-3 backdrop-blur">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the menu…"
          className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary"
        />
        <button
          onClick={() => setVegOnly((v) => !v)}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-extrabold ${
            vegOnly ? "border-veg bg-veg/10 text-veg" : "border-line bg-white"
          }`}
        >
          <VegDot veg /> Veg
        </button>
      </div>

      {/* Menu */}
      <div className="px-4 pb-4">
        {[...grouped.entries()].length === 0 ? (
          <p className="py-16 text-center text-sm font-semibold text-sub">No items match your filters.</p>
        ) : (
          [...grouped.entries()].map(([cat, items]) => (
            <section key={cat} className="mt-5">
              <h2 className="mb-2 text-sm font-black uppercase tracking-wide text-sub">{cat}</h2>
              <div className="divide-y divide-line">
                {items.map((item) => (
                  <ItemRow key={item.id} item={item} restaurant={restaurant} onAdd={() => addBase(item)} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {modalItem && (
        <ItemModal item={modalItem} restaurant={restaurant} onClose={() => setModalItem(null)} />
      )}
    </div>
  );
}

function Metric({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-center gap-1 text-sm font-black">{icon}{title}</div>
      <p className="mt-0.5 text-[11px] font-semibold text-sub">{sub}</p>
    </div>
  );
}

function priceForTwo(menu: MenuItem[], currency?: string): string {
  const prices = menu.map((m) => m.price).filter((p) => p > 0).sort((a, b) => a - b);
  if (prices.length === 0) return "—";
  const median = prices[Math.floor(prices.length / 2)];
  return formatMoney(Math.round((median * 2) / 10) * 10, currency);
}

function ItemRow({ item, restaurant, onAdd }: { item: MenuItem; restaurant: R; onAdd: () => void }) {
  const cart = useCart();
  const qty = cart.qtyOf(item.id);
  const line = cart.lines.find((l) => l.item.id === item.id);
  return (
    <div className="flex items-start gap-3 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <VegDot veg={item.isVeg} />
          {item.isRecommended && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-700">
              Bestseller
            </span>
          )}
        </div>
        <h3 className="mt-1 text-sm font-extrabold">{item.name}</h3>
        <p className="mt-0.5 text-sm font-bold">{formatMoney(item.price, restaurant.currency)}</p>
        {item.description && <p className="mt-1 line-clamp-2 text-xs font-medium text-sub">{item.description}</p>}
      </div>
      <div className="relative w-28 shrink-0">
        <img src={menuItemImage(item)} alt={item.name} className="h-24 w-full rounded-xl object-cover" />
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
          {qty > 0 && line && (item.variants.length === 0 && item.addons.length === 0) ? (
            <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-2 py-1.5 shadow-card">
              <button onClick={() => cart.decrement(line.cartId)}><Minus className="h-4-4 text-primary" /></button>
              <span className="text-sm font-black text-primary">{qty}</span>
              <button onClick={() => cart.increment(line.cartId)}><Plus className="h-4 w-4 text-primary" /></button>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="rounded-xl border border-primary bg-white px-6 py-1.5 text-sm font-black text-primary shadow-card"
            >
              ADD{item.variants.length > 0 ? " +" : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemModal({ item, restaurant, onClose }: { item: MenuItem; restaurant: R; onClose: () => void }) {
  const cart = useCart();
  const [variant, setVariant] = useState<MenuVariant | undefined>(item.variants[0]);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [qty, setQty] = useState(1);

  const unit = (variant?.price ?? item.price) + item.addons.filter((a) => addons.has(a.name)).reduce((s, a) => s + a.price, 0);

  function confirmAdd() {
    if (cart.conflictsWith(restaurant)) {
      if (!confirm(`Your cart has items from ${cart.restaurant?.name}. Clear it to order from ${restaurant.name}?`)) return;
      cart.clear();
    }
    cart.add(restaurant, item, {
      variant,
      addons: item.addons.filter((a) => addons.has(a.name)),
      qty,
    });
    toast(`${item.name} added to cart`);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-black">{item.name}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-sub" /></button>
        </div>

        {item.variants.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-black uppercase text-sub">Choose a size</p>
            <div className="mt-2 space-y-2">
              {item.variants.map((v) => (
                <label key={v.name} className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3">
                  <span className="flex items-center gap-3 text-sm font-bold">
                    <input type="radio" checked={variant?.name === v.name} onChange={() => setVariant(v)} /> {v.name}
                  </span>
                  <span className="text-sm font-bold">{formatMoney(v.price, restaurant.currency)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {item.addons.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-black uppercase text-sub">Add-ons</p>
            <div className="mt-2 space-y-2">
              {item.addons.map((a) => (
                <label key={a.name} className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3">
                  <span className="flex items-center gap-3 text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={addons.has(a.name)}
                      onChange={(e) =>
                        setAddons((prev) => {
                          const n = new Set(prev);
                          if (e.target.checked) {
                            n.add(a.name);
                          } else {
                            n.delete(a.name);
                          }
                          return n;
                        })
                      }
                    />
                    {a.name}
                  </span>
                  <span className="text-sm font-bold">+{formatMoney(a.price, restaurant.currency)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-4">
          <div className="flex items-center gap-4 rounded-xl border border-line px-3 py-2">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></button>
            <span className="font-black">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></button>
          </div>
          <button onClick={confirmAdd} className="btn-primary flex-1">
            Add · {formatMoney(unit * qty, restaurant.currency)}
          </button>
        </div>
      </div>
    </div>
  );
}
