import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [total, subscribed, unsubscribed, subscribers] = await Promise.all([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.count({ where: { status: "subscribed" } }),
      prisma.newsletterSubscriber.count({ where: { status: "unsubscribed" } }),
      prisma.newsletterSubscriber.findMany({
        orderBy: { subscribedAt: "desc" },
        take: 300,
        select: {
          id: true,
          email: true,
          status: true,
          source: true,
          subscribedAt: true,
          unsubscribedAt: true,
        },
      }),
    ]);

    return NextResponse.json({ total, subscribed, unsubscribed, subscribers });
  } catch (error) {
    console.error("Newsletter admin fetch error:", error);
    return NextResponse.json({ error: "Failed to load subscribers" }, { status: 500 });
  }
}
