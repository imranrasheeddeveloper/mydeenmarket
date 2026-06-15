-- AlterTable: Add WhatsApp configuration fields to SiteConfig
ALTER TABLE "SiteConfig" ADD COLUMN "whatsappNumber" TEXT NOT NULL DEFAULT '+923035036392';
ALTER TABLE "SiteConfig" ADD COLUMN "whatsappPhoneId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteConfig" ADD COLUMN "whatsappToken" TEXT NOT NULL DEFAULT '';
