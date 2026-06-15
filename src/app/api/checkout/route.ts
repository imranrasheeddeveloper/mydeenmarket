import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";
import { sendWhatsAppOrderNotification } from "@/lib/whatsapp";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, address, city, state, zip, notes, items } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !state) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (items.some((item: { qty?: number }) => !item.qty || item.qty <= 0)) {
      return NextResponse.json({ error: "Invalid item quantity" }, { status: 400 });
    }

    const fullName = `${firstName} ${lastName}`;
    const shippingAddress = `${address}, ${city}, ${state}${zip ? ` ${zip}` : ""}\nPhone: ${phone}${notes ? `\nNotes: ${notes}` : ""}`;

    // Calculate total
    const subtotal = items.reduce((sum: number, item: { price: number; qty: number }) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + shipping;

    // Generate order number
    const orderNumber = `MDM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // --- Validate product IDs exist ---
    const productIds = items
      .map((item: { id?: string }) => item.id)
      .filter((id: string | undefined): id is string => !!id);

    const existingProducts = productIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, name: true, stockQty: true },
        })
      : [];
    const validProductIds = new Set(existingProducts.map((p) => p.id));
    const productById = new Map(existingProducts.map((p) => [p.id, p]));

    for (const item of items as Array<{ id?: string; name: string; qty: number }>) {
      if (!item.id || !validProductIds.has(item.id)) continue;
      const dbProduct = productById.get(item.id);
      if (!dbProduct) continue;
      if (dbProduct.stockQty < item.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stockQty}` },
          { status: 409 }
        );
      }
    }

    // --- Auto-create User if not exists ---
    let user = await prisma.user.findUnique({ where: { email } });
    let generatedPassword: string | undefined;

    if (!user) {
      generatedPassword = Math.random().toString(36).slice(-8);
      const hashed = bcrypt.hashSync(generatedPassword, 10);
      user = await prisma.user.create({
        data: {
          name: fullName,
          email,
          password: hashed,
          role: "customer",
          provider: "credentials",
        },
      });
    }

    // --- Auto-create Customer record if not exists ---
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: fullName,
          email,
          phone,
          totalOrders: 0,
          totalSpent: 0,
        },
      });
    }

    // --- Create Order with items ---
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items as Array<{ id?: string; qty: number }>) {
        if (!item.id || !validProductIds.has(item.id)) continue;
        const updated = await tx.product.updateMany({
          where: {
            id: item.id,
            stockQty: { gte: item.qty },
          },
          data: {
            stockQty: { decrement: item.qty },
          },
        });

        if (updated.count === 0) {
          throw new Error("STOCK_CONFLICT");
        }
      }

      await tx.product.updateMany({
        where: { stockQty: { lte: 0 } },
        data: { inStock: false },
      });

      await tx.product.updateMany({
        where: { stockQty: { gt: 0 } },
        data: { inStock: true },
      });

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: fullName,
          customerEmail: email,
          total,
          status: "pending",
          paymentStatus: "unpaid",
          shippingAddress,
          items: {
            create: items.map((item: { id: string; name: string; qty: number; price: number }) => ({
              name: item.name,
              qty: item.qty,
              price: item.price,
              productId: item.id && validProductIds.has(item.id) ? item.id : undefined,
            })),
          },
        },
      });

      await tx.customer.update({
        where: { email },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastOrderAt: new Date(),
          name: fullName,
          phone,
        },
      });

      return createdOrder;
    });

    // --- Send order confirmation email (async, don't block response) ---
    sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerName: fullName,
      customerEmail: email,
      total,
      shippingAddress,
      items: items.map((item: { name: string; qty: number; price: number }) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      generatedPassword,
    }).catch(() => {});

    // --- Send WhatsApp order notification to admin (async, don't block response) ---
    sendWhatsAppOrderNotification({
      orderNumber: order.orderNumber,
      customerName: fullName,
      customerEmail: email,
      phone,
      total,
      shippingAddress,
      items: items.map((item: { name: string; qty: number; price: number }) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      email: user.email,
      generatedPassword,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_CONFLICT") {
      return NextResponse.json(
        { error: "Stock changed while placing order. Please review cart quantities and try again." },
        { status: 409 }
      );
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
