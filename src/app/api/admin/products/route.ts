import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreatePayload = {
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
  stockQty?: number;
  inStock?: boolean;
  badge?: string | null;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CreatePayload;

    if (!body.name || !body.categorySlug || !body.description || !body.price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { slug: body.categorySlug },
    });

    const parsedStockQty = Number(body.stockQty ?? 0);
    const stockQty = Number.isFinite(parsedStockQty) ? Math.max(0, Math.trunc(parsedStockQty)) : 0;

    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const baseSlug = slugify(body.name);
    if (!baseSlug) {
      return NextResponse.json({ error: "Invalid product name" }, { status: 400 });
    }

    let slug = baseSlug;
    let i = 1;
    // Ensure unique slug without race-prone assumptions.
    while (await prisma.product.findUnique({ where: { slug } })) {
      i += 1;
      slug = `${baseSlug}-${i}`;
    }

    const product = await prisma.product.create({
      data: {
        slug,
        name: body.name,
        author: body.author?.trim() || "N/A",
        vendor: body.vendor?.trim() || "MyDeenMarket",
        price: Math.max(1, Number(body.price)),
        compareAtPrice: body.compareAtPrice ?? null,
        rating: 5,
        reviewCount: 0,
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
        stockQty,
        inStock: stockQty > 0,
        gradient: category.gradient,
        icon: category.icon,
      },
    });

    const updatedCount = await prisma.product.count({
      where: { categorySlug: category.slug },
    });

    await prisma.category.update({
      where: { slug: category.slug },
      data: { count: updatedCount },
    });

    return NextResponse.json({ success: true, id: product.id, slug: product.slug });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
