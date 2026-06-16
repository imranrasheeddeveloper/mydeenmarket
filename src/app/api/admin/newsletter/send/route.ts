import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

type SendMode = "test" | "send";

function buildBaseUrl(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function renderCampaignHtml(inputHtml: string, unsubscribeUrl: string) {
  const replaced = inputHtml.replaceAll("{{unsubscribe_url}}", unsubscribeUrl);
  if (replaced.includes("{{unsubscribe_url}}")) {
    return replaced;
  }

  const footer = `
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#64748b;">
      You are receiving this because you subscribed to MyDeenMarket updates.
      <br/>
      <a href="${unsubscribeUrl}" style="color:#0f766e;text-decoration:underline;">Unsubscribe</a>
    </div>
  `;
  return `${replaced}${footer}`;
}

function toText(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendInBatches(tasks: Array<() => Promise<boolean>>, batchSize: number) {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const result = await Promise.allSettled(batch.map((job) => job()));
    for (const r of result) {
      if (r.status === "fulfilled" && r.value) sent += 1;
      else failed += 1;
    }
  }

  return { sent, failed };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      mode?: SendMode;
      subject?: string;
      html?: string;
      testEmail?: string;
    };

    const mode: SendMode = body.mode === "test" ? "test" : "send";
    const subject = (body.subject || "").trim();
    const html = (body.html || "").trim();

    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML are required." }, { status: 400 });
    }

    const baseUrl = buildBaseUrl(req);

    if (mode === "test") {
      const recipient = (body.testEmail || session.user.email || "").trim().toLowerCase();
      if (!recipient) {
        return NextResponse.json({ error: "No test recipient found." }, { status: 400 });
      }

      const testUnsubscribe = `${baseUrl}/unsubscribe`;
      const renderedHtml = renderCampaignHtml(html, testUnsubscribe);
      const ok = await sendEmail({
        to: recipient,
        subject: `[TEST] ${subject}`,
        html: renderedHtml,
      });

      if (!ok) {
        return NextResponse.json({ error: "Failed to send test email. Check SMTP settings." }, { status: 500 });
      }

      return NextResponse.json({ ok: true, message: `Test email sent to ${recipient}.` });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { status: "subscribed" },
      select: { email: true, unsubscribeToken: true },
    });

    if (!subscribers.length) {
      return NextResponse.json({ error: "No subscribed users found." }, { status: 400 });
    }

    const jobs = subscribers.map((subscriber) => {
      return async () => {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;
        const renderedHtml = renderCampaignHtml(html, unsubscribeUrl);
        return sendEmail({
          to: subscriber.email,
          subject,
          html: renderedHtml,
          listUnsubscribeUrl: unsubscribeUrl,
        });
      };
    });

    const { sent, failed } = await sendInBatches(jobs, 20);

    const text = toText(html);
    const previewText = text.length > 240 ? `${text.slice(0, 240)}...` : text;

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total: subscribers.length,
      previewText,
    });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Failed to send campaign." }, { status: 500 });
  }
}
