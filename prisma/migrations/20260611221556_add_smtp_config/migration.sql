-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "name" TEXT NOT NULL DEFAULT 'Darussalam PK',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT 'https://darussalam.pk',
    "address" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "hours" TEXT NOT NULL DEFAULT '',
    "freeShippingThreshold" INTEGER NOT NULL DEFAULT 5000,
    "socialFacebook" TEXT NOT NULL DEFAULT '',
    "socialInstagram" TEXT NOT NULL DEFAULT '',
    "socialYoutube" TEXT NOT NULL DEFAULT '',
    "smtpHost" TEXT NOT NULL DEFAULT '',
    "smtpPort" INTEGER NOT NULL DEFAULT 587,
    "smtpUser" TEXT NOT NULL DEFAULT '',
    "smtpPass" TEXT NOT NULL DEFAULT '',
    "smtpFrom" TEXT NOT NULL DEFAULT '',
    "smtpSecure" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_SiteConfig" ("address", "description", "email", "freeShippingThreshold", "hours", "id", "name", "phone", "socialFacebook", "socialInstagram", "socialYoutube", "title", "url") SELECT "address", "description", "email", "freeShippingThreshold", "hours", "id", "name", "phone", "socialFacebook", "socialInstagram", "socialYoutube", "title", "url" FROM "SiteConfig";
DROP TABLE "SiteConfig";
ALTER TABLE "new_SiteConfig" RENAME TO "SiteConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
