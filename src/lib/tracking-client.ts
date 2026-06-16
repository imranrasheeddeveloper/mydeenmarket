declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    __mdmTracking?: {
      googleAdsConversionId?: string;
      googleAdsLabel?: string;
    };
  }
}

type CartEventItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;

  window.fbq?.("track", "PageView");
  window.gtag?.("event", "page_view", { page_path: path });
}

export function trackViewContent(params: {
  id: string;
  name: string;
  price: number;
  category: string;
}) {
  if (typeof window === "undefined") return;

  const contentIds = [params.id];
  window.fbq?.("track", "ViewContent", {
    content_ids: contentIds,
    content_name: params.name,
    content_type: "product",
    value: params.price,
    currency: "PKR",
  });

  window.gtag?.("event", "view_item", {
    currency: "PKR",
    value: params.price,
    items: [
      {
        item_id: params.id,
        item_name: params.name,
        item_category: params.category,
        price: params.price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(item: CartEventItem) {
  if (typeof window === "undefined") return;

  const value = item.price * item.qty;
  const contentIds = [item.id];

  window.fbq?.("track", "AddToCart", {
    content_ids: contentIds,
    content_name: item.name,
    content_type: "product",
    value,
    currency: "PKR",
  });

  window.gtag?.("event", "add_to_cart", {
    currency: "PKR",
    value,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
      },
    ],
  });
}

export function trackPurchase(params: {
  orderNumber: string;
  total: number;
  items: CartEventItem[];
}) {
  if (typeof window === "undefined") return;

  const contentIds = params.items.map((item) => item.id);

  window.fbq?.("track", "Purchase", {
    content_ids: contentIds,
    content_type: "product",
    value: params.total,
    currency: "PKR",
    eventID: params.orderNumber,
  });

  window.gtag?.("event", "purchase", {
    transaction_id: params.orderNumber,
    currency: "PKR",
    value: params.total,
    items: params.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.qty,
    })),
  });

  const adsId = window.__mdmTracking?.googleAdsConversionId;
  const adsLabel = window.__mdmTracking?.googleAdsLabel;
  if (adsId && adsLabel) {
    const normalizedId = adsId.startsWith("AW-") ? adsId : `AW-${adsId}`;
    window.gtag?.("event", "conversion", {
      send_to: `${normalizedId}/${adsLabel}`,
      value: params.total,
      currency: "PKR",
      transaction_id: params.orderNumber,
    });
  }
}

export {};