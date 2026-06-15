import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdatePayload = {
  name?: string;
  author?: string;
  vendor?: string;
  categorySlug?: string;
  price?: number;
  compareAtPrice?: number | null;
  description?: string;
  features?: string[];
  language?: string;
  pages?: number | null;
  isbn?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  imageUrl?: string | null;
  images?: string[];
  stockQty?: number;
  inStock?: boolean;
  badge?: string | null;
};

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "admin");
}

async function updateCategoryCount(slug: string) {
  const count = await prisma.product.count({ where: { categorySlug: slug } });
  await prisma.category.update({ where: { slug }, data: { count } });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await req.json()) as UpdatePayload;

    if (!body.name || !body.categorySlug || !body.description || !body.price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const category = await prisma.category.findUnique({ where: { slug: body.categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const parsedStockQty = Number(body.stockQty ?? 0);
    const stockQty = Number.isFinite(parsedStockQty) ? Math.max(0, Math.trunc(parsedStockQty)) : 0;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        author: body.author?.trim() || "N/A",
        vendor: body.vendor?.trim() || "MyDeenMarket",
        price: Math.max(1, Number(body.price)),
        compareAtPrice: body.compareAtPrice ?? null,
        category: category.name,
        categorySlug: category.slug,
        badge: body.badge ?? null,
        description: body.description,
        features: JSON.stringify((body.features || []).filter(Boolean)),
        language: body.language?.trim() || "N/A",
        pages: body.pages ?? null,
        isbn: body.isbn ?? null,
        weight: body.weight ?? null,
        dimensions: body.dimensions ?? null,
        imageUrl: body.imageUrl?.trim() || null,
        images: JSON.stringify((body.images || []).filter(Boolean)),
        stockQty,
        inStock: stockQty > 0,
        gradient: category.gradient,
        icon: category.icon,
      },
      select: { id: true },
    });

    await updateCategoryCount(category.slug);
    if (existing.categorySlug !== category.slug) {
      await updateCategoryCount(existing.categorySlug);
    }

    return NextResponse.json({ success: true, id: updated.id });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await req.json()) as { inStock?: boolean; stockQty?: number };
    const hasBoolean = typeof body.inStock === "boolean";
    const hasQty = typeof body.stockQty === "number" && Number.isFinite(body.stockQty);

    if (!hasBoolean && !hasQty) {
      return NextResponse.json({ error: "Invalid stock payload" }, { status: 400 });
    }

    const nextQty = hasQty ? Math.max(0, Math.trunc(body.stockQty as number)) : (body.inStock ? 1 : 0);
    await prisma.product.update({ where: { id }, data: { stockQty: nextQty, inStock: nextQty > 0 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stock update error:", error);
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id } });
    await updateCategoryCount(existing.categorySlug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
