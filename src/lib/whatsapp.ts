import { prisma } from "@/lib/prisma";

interface OrderNotificationParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  total: number;
  shippingAddress: string;
  items: Array<{ name: string; qty: number; price: number }>;
}

export async function sendWhatsAppOrderNotification(params: OrderNotificationParams) {
  try {
    const config = await prisma.siteConfig.findFirst({
      select: { whatsappNumber: true, whatsappPhoneId: true, whatsappToken: true },
    });

    if (!config?.whatsappToken || !config?.whatsappPhoneId || !config?.whatsappNumber) {
      return; // WhatsApp not configured, skip silently
    }

    const to = config.whatsappNumber.replace(/\D/g, "");
    if (!to) return;

    const itemsList = params.items
      .map((i) => `• ${i.name} x${i.qty} — PKR ${(i.price * i.qty).toLocaleString()}`)
      .join("\n");

    const message = [
      `🛒 *New Order: ${params.orderNumber}*`,
      ``,
      `👤 *Customer:* ${params.customerName}`,
      `📧 Email: ${params.customerEmail}`,
      `📞 Phone: ${params.phone}`,
      ``,
      `📦 *Items:*`,
      itemsList,
      ``,
      `💰 *Total: PKR ${params.total.toLocaleString()}*`,
      ``,
      `📍 *Address:* ${params.shippingAddress}`,
    ].join("\n");

    const res = await fetch(
      `https://graph.facebook.com/v18.0/${config.whatsappPhoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("WhatsApp notification failed:", err);
    }
  } catch (err) {
    console.error("WhatsApp notification error:", err);
  }
}
