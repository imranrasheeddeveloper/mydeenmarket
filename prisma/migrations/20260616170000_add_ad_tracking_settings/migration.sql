-- Add ad tracking settings to SiteConfig
ALTER TABLE "SiteConfig" ADD COLUMN "enableMetaTracking" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteConfig" ADD COLUMN "metaPixelId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteConfig" ADD COLUMN "metaCapiToken" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteConfig" ADD COLUMN "enableGoogleTracking" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteConfig" ADD COLUMN "ga4Id" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteConfig" ADD COLUMN "googleAdsConversionId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteConfig" ADD COLUMN "googleAdsLabel" TEXT NOT NULL DEFAULT '';
