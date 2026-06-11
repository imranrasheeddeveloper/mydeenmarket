import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusUpdate } from "@/lib/email";

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const VALID_PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status, paymentStatus } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const data: Record<string, string> = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = status;
    }

    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
      }
      data.paymentStatus = paymentStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    // Send status update email if status changed
    if (status) {
      sendOrderStatusUpdate({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, status: order.status, paymentStatus: order.paymentStatus });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
