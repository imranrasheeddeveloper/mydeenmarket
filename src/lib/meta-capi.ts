import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

type PurchaseParams = {
  orderNumber: string;
  total: number;
  email: string;
  phone: string;
  items: Array<{ id?: string; qty: number }>;
  sourceUrl?: string;
};

function sha256(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function sendMetaPurchaseEvent(params: PurchaseParams) {
  try {
    const config = await prisma.siteConfig.findFirst({
      select: {
        enableMetaTracking: true,
        metaPixelId: true,
        metaCapiToken: true,
      },
    });

    if (!config?.enableMetaTracking || !config.metaPixelId || !config.metaCapiToken) {
      return;
    }

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.orderNumber,
          action_source: "website",
          event_source_url: params.sourceUrl || "https://mydeenmarket.com/checkout",
          user_data: {
            em: [sha256(normalizeEmail(params.email))],
            ph: [sha256(normalizePhone(params.phone))],
          },
          custom_data: {
            currency: "PKR",
            value: params.total,
            content_type: "product",
            content_ids: params.items.map((item) => item.id).filter(Boolean),
            num_items: params.items.reduce((sum, item) => sum + item.qty, 0),
          },
        },
      ],
    };

    const url = `https://graph.facebook.com/v20.0/${config.metaPixelId}/events?access_token=${encodeURIComponent(config.metaCapiToken)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Meta CAPI error:", text);
    }
  } catch (error) {
    console.error("Meta CAPI failed:", error);
  }
}
