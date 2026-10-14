import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seoPages from "../../seo-pages.json";

type SeoPage = {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
  image?: string;
  jsonLd?: Record<string, unknown>;
};

function normalizePath(path: string) {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

function setStructuredData(value?: SeoPage["jsonLd"]) {
  document.head.querySelectorAll("script[data-route-seo]").forEach((element) => element.remove());
  if (!value) return;
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.routeSeo = "true";
  script.textContent = JSON.stringify(value);
  document.head.appendChild(script);
}

export function usePageSeo(page: SeoPage | null) {
  const jsonLd = page?.jsonLd ? JSON.stringify(page.jsonLd) : "";
  useEffect(() => {
    if (!page) return;

    const canonical = `${seoPages.siteUrl}${page.path === "/" ? "/" : page.path}`;
    const title = `${page.title} | The Kada`;
    const robots = page.indexable
      ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      : "noindex,follow";

    document.title = title;
    setMeta("name", "description", page.description);
    setMeta("name", "robots", robots);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", page.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:site_name", "The Kada");
    setMeta("property", "og:image", page.image ?? `${seoPages.siteUrl}/og.png`);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", page.description);
    setMeta("name", "twitter:image", page.image ?? `${seoPages.siteUrl}/og.png`);
    setCanonical(canonical);
    setStructuredData(jsonLd ? JSON.parse(jsonLd) as Record<string, unknown> : undefined);
  }, [page?.path, page?.title, page?.description, page?.indexable, page?.image, jsonLd]);
}

export default function RouteSeo() {
  const { pathname } = useLocation();
  const path = normalizePath(pathname);
  const isRestaurantRoute = /^\/restaurant\/[^/]+$/.test(path);
  const isOrderTrackingRoute = /^\/orders\/[^/]+$/.test(path);

  const page = isRestaurantRoute
    ? null
    : isOrderTrackingRoute
      ? seoPages.routes.find((route) => route.path === "/orders")!
      : seoPages.routes.find((route) => route.path === path) ?? {
          path,
          title: "Page Not Found",
          description: "The page you requested could not be found.",
          indexable: false,
        };

  usePageSeo(page);
  return null;
}
