import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type BulkDeletePayload = {
  ids?: string[];
};

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user && session.user.role === "admin");
}

async function updateCategoryCount(slug: string) {
  const count = await prisma.product.count({ where: { categorySlug: slug } });
  await prisma.category.update({ where: { slug }, data: { count } });
}

export async function POST(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as BulkDeletePayload;
    const ids = Array.from(new Set((body.ids || []).filter(Boolean)));

    if (ids.length === 0) {
      return NextResponse.json({ error: "No products selected" }, { status: 400 });
    }

    const existing = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, categorySlug: true },
    });

    if (existing.length === 0) {
      return NextResponse.json({ error: "No matching products found" }, { status: 404 });
    }

    const categorySlugs = Array.from(new Set(existing.map((p) => p.categorySlug)));

    const deleted = await prisma.product.deleteMany({
      where: { id: { in: existing.map((p) => p.id) } },
    });

    await Promise.all(categorySlugs.map((slug) => updateCategoryCount(slug)));

    return NextResponse.json({
      success: true,
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("Bulk delete products error:", error);
    return NextResponse.json({ error: "Failed to delete selected products" }, { status: 500 });
  }
}
