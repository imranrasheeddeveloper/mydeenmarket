/**
 * Downloads product images from external URLs (e.g. Shopify CDN) into your
 * uploads/products/ folder and updates the DB imageUrl to the local path.
 *
 * Usage (run on production server or locally against prod DB):
 *   DATABASE_URL='postgresql://...' npx tsx prisma/download-product-images.ts
 *
 * Options:
 *   --dry-run   Show what would be downloaded without actually doing it
 *   --limit N   Only process first N products (for testing)
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import http from "node:http";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const DRY_RUN = process.argv.includes("--dry-run");
const LIMIT = (() => {
  const idx = process.argv.indexOf("--limit");
  if (idx !== -1) return parseInt(process.argv[idx + 1], 10);
  return Infinity;
})();

const DELAY_MS = 200; // polite delay between downloads
const TIMEOUT_MS = 15_000;

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// Determine the uploads directory — mirrors getProductUploadsDir() from lib/upload-path
function getUploadsDir(): string {
  // Production standalone path first, then development path
  const candidates = [
    path.join(process.cwd(), ".next", "standalone", "uploads", "products"),
    path.join(process.cwd(), "uploads", "products"),
    path.join(process.cwd(), "public", "uploads", "products"),
  ];
  // Use first that already exists, or create the second candidate
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  const fallback = candidates[1];
  fs.mkdirSync(fallback, { recursive: true });
  return fallback;
}

// Download a URL to a local file, returns true on success
function downloadFile(url: string, destPath: string): Promise<boolean> {
  return new Promise(resolve => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: TIMEOUT_MS }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirect = res.headers.location;
        if (redirect) {
          downloadFile(redirect, destPath).then(resolve);
          return;
        }
      }
      if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
        console.warn(`  HTTP ${res.statusCode} for ${url}`);
        resolve(false);
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => { fileStream.close(); resolve(true); });
      fileStream.on("error", () => { resolve(false); });
    });
    req.on("error", (err) => {
      console.warn(`  Network error: ${err.message}`);
      resolve(false);
    });
    req.on("timeout", () => {
      req.destroy();
      console.warn(`  Timeout: ${url}`);
      resolve(false);
    });
  });
}

// Extract file extension from URL (jpg, png, webp, gif) defaulting to jpg
function getExt(url: string): string {
  const clean = url.split("?")[0];
  const ext = path.extname(clean).toLowerCase().replace(".", "");
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    return ext === "jpeg" ? "jpg" : ext;
  }
  return "jpg";
}

async function main() {
  const adapter = new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://mydeenmarket:mydeenmarket@localhost:5433/mydeenmarket?schema=public",
  });
  const prisma = new PrismaClient({ adapter });

  // Find all products with external imageUrl (starts with http)
  const products = await prisma.product.findMany({
    where: { imageUrl: { startsWith: "http" } },
    select: { id: true, slug: true, imageUrl: true },
    orderBy: { slug: "asc" },
  });

  const toProcess = products.slice(0, LIMIT === Infinity ? products.length : LIMIT);

  console.log(`=== Product Image Downloader ===`);
  console.log(`Found ${products.length} products with external image URLs.`);
  console.log(`Processing: ${toProcess.length}${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  if (toProcess.length === 0) {
    console.log("Nothing to download. All images are already local.");
    await prisma.$disconnect();
    return;
  }

  const uploadsDir = getUploadsDir();
  console.log(`Uploads directory: ${uploadsDir}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const { id, slug, imageUrl } = toProcess[i];
    if (!imageUrl) continue;

    const ext = getExt(imageUrl);
    const filename = `${slug}.${ext}`;
    const destPath = path.join(uploadsDir, filename);
    const localUrl = `/uploads/products/${filename}`;

    process.stdout.write(`[${i + 1}/${toProcess.length}] ${slug}.${ext} ... `);

    if (DRY_RUN) {
      console.log(`would download ${imageUrl}`);
      continue;
    }

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log("already exists, updating DB");
      await prisma.product.update({ where: { id }, data: { imageUrl: localUrl } });
      skipped++;
      continue;
    }

    const ok = await downloadFile(imageUrl, destPath);
    if (ok) {
      await prisma.product.update({ where: { id }, data: { imageUrl: localUrl } });
      console.log("✓");
      downloaded++;
    } else {
      // Leave DB unchanged so image still loads from CDN
      console.log("FAILED (leaving CDN URL)");
      failed++;
      // Clean up incomplete file if created
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    await sleep(DELAY_MS);
  }

  await prisma.$disconnect();

  console.log(`\n=== Done ===`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Failed (CDN URL kept): ${failed}`);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
