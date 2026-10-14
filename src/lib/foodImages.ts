import type { MenuItem, Restaurant } from "@/types";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80",
];

const CATEGORY: Record<string, string> = {
  all: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  chicken: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=80",
  shawarma: "https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=900&q=80",
  salad: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
  dessert: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
};

function fromText(text: string): string {
  const t = text.toLowerCase();
  for (const key of Object.keys(CATEGORY)) {
    if (t.includes(key)) return CATEGORY[key];
  }
  let hash = 0;
  for (let i = 0; i < t.length; i++) hash = (hash * 31 + t.charCodeAt(i)) | 0;
  return FALLBACKS[Math.abs(hash) % FALLBACKS.length];
}

export function categoryImage(category: string): string {
  return CATEGORY[category.trim().toLowerCase()] ?? fromText(category);
}

export function restaurantImage(r: Restaurant): string {
  const u = r.logoUrl?.trim();
  if (u) return u;
  return categoryImage(r.cuisine ?? r.name);
}

export function menuItemImage(item: MenuItem): string {
  const u = item.image?.trim();
  if (u) return u;
  return categoryImage(`${item.category} ${item.name}`);
}
