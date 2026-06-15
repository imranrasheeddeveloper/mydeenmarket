ALTER TABLE "Product" ADD COLUMN "stockQty" INTEGER NOT NULL DEFAULT 0;

UPDATE "Product"
SET "stockQty" = CASE
  WHEN "inStock" = 1 THEN 100
  ELSE 0
END
WHERE "stockQty" = 0;
