import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../lib/firebase";

export function useAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title || location.pathname,
      });
    }
  }, [location]);
}

/**
 * Common E-Commerce & Action Trackers
 */

export const trackAddToCart = (item: { id: string; name: string; price: number; quantity: number }) => {
  if (analytics) {
    logEvent(analytics, "add_to_cart", {
      currency: "INR",
      value: item.price * item.quantity,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        },
      ],
    });
  }
};

export const trackViewItem = (item: { id: string; name: string; price: number }) => {
  if (analytics) {
    logEvent(analytics, "view_item", {
      currency: "INR",
      value: item.price,
      items: [
        {
          item_id: item.id,
          item_name: item.name,
          price: item.price,
        },
      ],
    });
  }
};

export const trackPurchase = (order: { id: string; revenue: number; items: any[] }) => {
  if (analytics) {
    logEvent(analytics, "purchase", {
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
  }
};

export const trackLogin = (method: string = "email") => {
  if (analytics) {
    logEvent(analytics, "login", { method });
  }
};
