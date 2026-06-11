import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    const fullName = `${firstName} ${lastName}`;
    const shippingAddress = `${address}, ${city}, ${state}${zip ? ` ${zip}` : ""}\nPhone: ${phone}${notes ? `\nNotes: ${notes}` : ""}`;

    // Calculate total
    const subtotal = items.reduce((sum: number, item: { price: number; qty: number }) => sum + item.price * item.qty, 0);
    const shipping = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + shipping;

    // Generate order number
    const orderNumber = `MDM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
    const order = await prisma.order.create({
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
            productId: item.id || undefined,
          })),
        },
      },
    });

    // --- Update Customer stats ---
    await prisma.customer.update({
      where: { email },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: total },
        lastOrderAt: new Date(),
        name: fullName,
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      email: user.email,
      generatedPassword,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
