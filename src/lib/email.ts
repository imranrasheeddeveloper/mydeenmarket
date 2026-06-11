import "server-only";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function getSmtpConfig() {
  const config = await prisma.siteConfig.findFirst();
  if (!config || !config.smtpHost || !config.smtpUser) return null;
  return {
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    user: config.smtpUser,
    pass: config.smtpPass,
    from: config.smtpFrom || config.smtpUser,
    storeName: config.name || "MyDeenMarket",
  };
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const smtp = await getSmtpConfig();
    if (!smtp) {
      console.warn("SMTP not configured — skipping email");
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    await transporter.sendMail({
      from: `"${smtp.storeName}" <${smtp.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  shippingAddress: string;
  items: { name: string; qty: number; price: number }[];
  generatedPassword?: string;
}

export async function sendOrderConfirmation(order: OrderEmailData) {
  const smtp = await getSmtpConfig();
  const storeName = smtp?.storeName || "MyDeenMarket";

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${formatPKR(i.price * i.qty)}</td>
        </tr>`
    )
    .join("");

  const accountInfo = order.generatedPassword
    ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0 0 4px;font-weight:600;color:#166534">Account Created Automatically</p>
        <p style="margin:0;font-size:14px;color:#15803d">Email: <strong>${order.customerEmail}</strong></p>
        <p style="margin:0;font-size:14px;color:#15803d">Password: <strong>${order.generatedPassword}</strong></p>
        <p style="margin:4px 0 0;font-size:12px;color:#16a34a">You can use these to track your order.</p>
      </div>`
    : "";

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <div style="background:#065f46;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:22px">${storeName}</h1>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="color:#065f46;margin:0 0 4px">Order Confirmed! ✅</h2>
        <p style="color:#6b7280;margin:0 0 20px;font-size:14px">Thank you for your order, ${order.customerName}.</p>
        
        <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:16px">
          <p style="margin:0;font-size:13px;color:#6b7280">Order Number</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#065f46">${order.orderNumber}</p>
        </div>

        ${accountInfo}

        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead>
            <tr style="background:#f9fafb">
              <th style="padding:8px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Item</th>
              <th style="padding:8px 12px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px;font-weight:700;font-size:15px">Total</td>
              <td style="padding:12px;font-weight:700;font-size:15px;text-align:right;color:#065f46">${formatPKR(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin:16px 0">
          <p style="font-size:13px;color:#6b7280;margin:0 0 4px">Shipping Address</p>
          <p style="font-size:14px;color:#111827;margin:0;white-space:pre-line">${order.shippingAddress}</p>
        </div>

        <p style="font-size:12px;color:#9ca3af;margin:16px 0 0;text-align:center">
          You will receive updates when your order status changes.
        </p>
      </div>
    </div>`;

  return sendEmail({
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html,
  });
}

const statusLabels: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusEmoji: Record<string, string> = {
  pending: "📋",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "✅",
  cancelled: "❌",
};

const statusMessages: Record<string, string> = {
  pending: "Your order has been placed and is awaiting processing.",
  processing: "Great news! Your order is now being prepared.",
  shipped: "Your order is on its way! It has been shipped.",
  delivered: "Your order has been delivered. Enjoy your purchase!",
  cancelled: "Your order has been cancelled. If you have questions, please contact us.",
};

export async function sendOrderStatusUpdate(order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
}) {
  const smtp = await getSmtpConfig();
  const storeName = smtp?.storeName || "MyDeenMarket";
  const label = statusLabels[order.status] || order.status;
  const emoji = statusEmoji[order.status] || "📦";
  const message = statusMessages[order.status] || `Your order status has been updated to: ${order.status}.`;

  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentIdx = order.status === "cancelled" ? -1 : steps.indexOf(order.status);

  const progressHtml =
    order.status === "cancelled"
      ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;text-align:center;margin:16px 0">
          <p style="margin:0;font-size:16px;font-weight:600;color:#dc2626">Order Cancelled</p>
        </div>`
      : `<div style="display:flex;align-items:center;justify-content:space-between;margin:20px 0">
          ${steps
            .map(
              (s, i) =>
                `<div style="text-align:center;flex:${i < steps.length - 1 ? 1 : "0 0 auto"}">
                  <div style="width:28px;height:28px;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${i <= currentIdx ? "white" : "#9ca3af"};background:${i <= currentIdx ? "#065f46" : "#e5e7eb"}">${i <= currentIdx ? "✓" : i + 1}</div>
                  <div style="font-size:10px;color:${i <= currentIdx ? "#065f46" : "#9ca3af"}">${statusLabels[s]}</div>
                </div>${i < steps.length - 1 ? `<div style="flex:1;height:2px;background:${i < currentIdx ? "#065f46" : "#e5e7eb"};margin:0 4px"></div>` : ""}`
            )
            .join("")}
        </div>`;

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <div style="background:#065f46;padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:white;margin:0;font-size:22px">${storeName}</h1>
      </div>
      <div style="padding:24px;background:white;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="color:#111827;margin:0 0 4px">${emoji} ${label}</h2>
        <p style="color:#6b7280;margin:0 0 8px;font-size:14px">Hi ${order.customerName},</p>
        <p style="color:#374151;margin:0 0 16px;font-size:14px">${message}</p>

        <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:8px">
          <p style="margin:0;font-size:13px;color:#6b7280">Order Number</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#065f46">${order.orderNumber}</p>
        </div>

        <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;margin-bottom:16px">
          <p style="margin:0;font-size:13px;color:#6b7280">Order Total</p>
          <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:#111827">${formatPKR(order.total)}</p>
        </div>

        ${progressHtml}

        <p style="font-size:12px;color:#9ca3af;margin:16px 0 0;text-align:center">
          Log in to your account to view full order details.
        </p>
      </div>
    </div>`;

  return sendEmail({
    to: order.customerEmail,
    subject: `${emoji} Order ${label} — ${order.orderNumber}`,
    html,
  });
}
