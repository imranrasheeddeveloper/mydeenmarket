import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildBaseUrl(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; source?: string };
    const email = normalizeEmail(body.email || "");

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const source = (body.source || "homepage").slice(0, 80);
    const token = randomBytes(24).toString("hex");

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        status: "subscribed",
        source,
        subscribedAt: new Date(),
        unsubscribedAt: null,
        unsubscribeToken: token,
      },
      create: {
        email,
        status: "subscribed",
        source,
        unsubscribeToken: token,
      },
    });

    const baseUrl = buildBaseUrl(req);
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${subscriber.unsubscribeToken}`;

    await sendEmail({
      to: email,
      subject: "You are subscribed to MyDeenMarket updates",
      listUnsubscribeUrl: `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`,
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;">
          <h2 style="margin-bottom:12px;color:#065f46;">Subscription confirmed</h2>
          <p style="margin:0 0 12px;">You will now receive updates about new arrivals, exclusive offers, and Islamic content from MyDeenMarket.</p>
          <p style="margin:0 0 12px;">If you no longer want these emails, you can unsubscribe any time.</p>
          <p style="margin:20px 0 0;">
            <a href="${unsubscribeUrl}" style="display:inline-block;padding:10px 16px;background:#d4a853;color:#0f172a;text-decoration:none;border-radius:999px;font-weight:600;">Unsubscribe</a>
          </p>
          <p style="margin-top:16px;font-size:12px;color:#64748b;">Or open this link: <a href="${unsubscribeUrl}">${unsubscribeUrl}</a></p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }
}
