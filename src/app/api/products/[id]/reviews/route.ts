import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type CreateReviewPayload = {
  customerName?: string;
  customerEmail?: string;
  rating?: number;
  comment?: string;
};

let reviewTableReady = false;

async function ensureReviewsTable() {
  if (reviewTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ProductReview" (
      id TEXT PRIMARY KEY,
      "productId" TEXT NOT NULL,
      "customerName" TEXT NOT NULL,
      "customerEmail" TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "ProductReview_productId_createdAt_idx" ON "ProductReview" ("productId", "createdAt" DESC)`
  );

  reviewTableReady = true;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id: productId } = await params;
    await ensureReviewsTable();

    const reviews = await prisma.$queryRawUnsafe<
      Array<{
        id: string;
        productId: string;
        customerName: string;
        customerEmail: string | null;
        rating: number;
        comment: string;
        createdAt: string;
      }>
    >(
      `SELECT id, "productId", "customerName", "customerEmail", rating, comment, "createdAt"
       FROM "ProductReview"
       WHERE "productId" = $1
       ORDER BY "createdAt" DESC
       LIMIT 50`,
      productId
    );

    return NextResponse.json(
      reviews.map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt).toISOString(),
      }))
    );
  } catch (error) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: productId } = await params;
    const session = await auth();
    const body = (await req.json()) as CreateReviewPayload;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Please log in to submit a review" }, { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const customerName = (session.user.name || body.customerName || "").trim();
    const customerEmail = session.user.email.trim();
    const comment = (body.comment || "").trim();
    const rating = Number(body.rating);

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          customerEmail,
        },
      },
      select: { id: true },
    });

    if (!purchased) {
      return NextResponse.json(
        { error: "Only customers who purchased this product can review it" },
        { status: 403 }
      );
    }

    if (!customerName || comment.length < 10 || !Number.isFinite(rating)) {
      return NextResponse.json(
        { error: "Name, rating, and comment (min 10 chars) are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await ensureReviewsTable();

    await prisma.$executeRawUnsafe(
      `INSERT INTO "ProductReview" (id, "productId", "customerName", "customerEmail", rating, comment)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      randomUUID(),
      productId,
      customerName,
      customerEmail || null,
      Math.round(rating),
      comment
    );

    const summary = await prisma.$queryRawUnsafe<Array<{ reviewCount: number; avgRating: number | null }>>(
      `SELECT COUNT(*) AS "reviewCount", AVG(rating) AS "avgRating"
       FROM "ProductReview"
       WHERE "productId" = $1`,
      productId
    );

    const reviewCount = Number(summary[0]?.reviewCount || 0);
    const avgRating = Number(summary[0]?.avgRating || 0);
    const clamped = Math.max(1, Math.min(5, avgRating || 5));

    await prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount,
        rating: Number(clamped.toFixed(1)),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
