import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type AnalyticsParams = Record<string, unknown>;

async function getEventLogger() {
  const [{ getAnalytics, isSupported, logEvent }, { app }] = await Promise.all([
    import("firebase/analytics"),
    import("@/lib/firebaseApp"),
  ]);
  if (!(await isSupported())) return null;
  const analytics = getAnalytics(app);
  return (eventName: string, params: AnalyticsParams) => logEvent(analytics, eventName, params);
}

function sendEvent(eventName: string, params: AnalyticsParams) {
  void getEventLogger()
    .then((log) => log?.(eventName, params))
    .catch((error) => console.warn("Analytics event could not be sent:", error));
}

export function useAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const trackPageView = async () => {
      try {
        const log = await getEventLogger();
        if (!cancelled) {
          log?.("page_view", {
            page_path: location.pathname + location.search,
            page_title: document.title || location.pathname,
          });
        }
      } catch (error) {
        console.warn("Analytics page view could not be sent:", error);
      }
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleHandle: number | undefined;
    let timerHandle: number | undefined;
    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(() => void trackPageView(), { timeout: 5000 });
    } else {
      timerHandle = window.setTimeout(() => void trackPageView(), 2500);
    }

    return () => {
      cancelled = true;
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timerHandle !== undefined) window.clearTimeout(timerHandle);
    };
  }, [location.pathname, location.search]);
}

/**
 * Common E-Commerce & Action Trackers
 */

export const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
  sendEvent("add_to_cart", {
    currency: "INR",
    value: item.price * item.quantity,
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }],
  });
};

export const trackViewItem = (item: { id: string; name: string; price: number }) => {
  sendEvent("view_item", {
    currency: "INR",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price }],
  });
};

export const trackPurchase = (order: { id: string; revenue: number; items: any[] }) => {
  sendEvent("purchase", {
    transaction_id: order.id,
    value: order.revenue,
    currency: "INR",
    items: order.items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

export const trackLogin = (method: string = "email") => {
  sendEvent("login", { method });
};
