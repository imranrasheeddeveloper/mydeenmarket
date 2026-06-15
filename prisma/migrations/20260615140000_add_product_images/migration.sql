-- Add images JSON array field to Product
ALTER TABLE "Product" ADD COLUMN "images" TEXT NOT NULL DEFAULT '[]';
