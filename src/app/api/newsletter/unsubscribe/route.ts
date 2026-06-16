import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") || "";
    if (!token) {
      return NextResponse.json({ error: "Missing unsubscribe token." }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribeToken: token } });
    if (!existing) {
      return NextResponse.json({ error: "Invalid unsubscribe token." }, { status: 404 });
    }

    await prisma.newsletterSubscriber.update({
      where: { id: existing.id },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ error: "Could not unsubscribe right now. Please try again." }, { status: 500 });
  }
}
