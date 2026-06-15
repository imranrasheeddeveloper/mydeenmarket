-- Create product reviews table for customer feedback on product pages.
CREATE TABLE IF NOT EXISTS "ProductReview" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductReview_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ProductReview_productId_createdAt_idx"
ON "ProductReview" ("productId", "createdAt" DESC);
