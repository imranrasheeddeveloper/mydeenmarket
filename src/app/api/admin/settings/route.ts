import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await prisma.siteConfig.findFirst();
    if (!config) {
      return NextResponse.json({});
    }

    return NextResponse.json({
      name: config.name,
      title: config.title,
      description: config.description,
      url: config.url,
      address: config.address,
      email: config.email,
      phone: config.phone,
      hours: config.hours,
      freeShippingThreshold: config.freeShippingThreshold,
      socialFacebook: config.socialFacebook,
      socialInstagram: config.socialInstagram,
      socialYoutube: config.socialYoutube,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      smtpUser: config.smtpUser,
      smtpPass: config.smtpPass,
      smtpFrom: config.smtpFrom,
      smtpSecure: config.smtpSecure,
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const config = await prisma.siteConfig.upsert({
      where: { id: "main" },
      update: {
        name: body.name,
        title: body.title,
        description: body.description,
        url: body.url,
        address: body.address,
        email: body.email,
        phone: body.phone,
        hours: body.hours,
        freeShippingThreshold: Number(body.freeShippingThreshold) || 5000,
        socialFacebook: body.socialFacebook || "",
        socialInstagram: body.socialInstagram || "",
        socialYoutube: body.socialYoutube || "",
        smtpHost: body.smtpHost || "",
        smtpPort: Number(body.smtpPort) || 587,
        smtpUser: body.smtpUser || "",
        smtpPass: body.smtpPass || "",
        smtpFrom: body.smtpFrom || "",
        smtpSecure: Boolean(body.smtpSecure),
      },
      create: {
        id: "main",
        name: body.name || "MyDeenMarket",
        title: body.title || "",
        description: body.description || "",
        url: body.url || "",
        address: body.address || "",
        email: body.email || "",
        phone: body.phone || "",
        hours: body.hours || "",
        freeShippingThreshold: Number(body.freeShippingThreshold) || 5000,
        socialFacebook: body.socialFacebook || "",
        socialInstagram: body.socialInstagram || "",
        socialYoutube: body.socialYoutube || "",
        smtpHost: body.smtpHost || "",
        smtpPort: Number(body.smtpPort) || 587,
        smtpUser: body.smtpUser || "",
        smtpPass: body.smtpPass || "",
        smtpFrom: body.smtpFrom || "",
        smtpSecure: Boolean(body.smtpSecure),
      },
    });

    return NextResponse.json({ success: true, name: config.name });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, smtpFrom } = await req.json();

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({ error: "SMTP host, user, and password are required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort) || 587,
      secure: Boolean(smtpSecure),
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.verify();

    // Send test email to admin
    await transporter.sendMail({
      from: `"MyDeenMarket" <${smtpFrom || smtpUser}>`,
      to: session.user.email!,
      subject: "SMTP Test — MyDeenMarket",
      html: `<div style="font-family:sans-serif;padding:20px"><h2 style="color:#065f46">SMTP is working! ✅</h2><p>Your email settings are configured correctly.</p></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Connection failed";
    return NextResponse.json({ error: `SMTP test failed: ${msg}` }, { status: 400 });
  }
}
