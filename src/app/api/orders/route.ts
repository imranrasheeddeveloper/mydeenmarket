import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerEmail: session.user.email },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        shippingAddress: o.shippingAddress,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      }))
    );
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
