import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getProductUploadsDir } from "@/lib/upload-path";

type RouteContext = {
  params: Promise<{ filename: string }>;
};

function safeFilename(input: string): string | null {
  const decoded = decodeURIComponent(input);
  if (!/^[a-zA-Z0-9._-]+$/.test(decoded)) return null;
  if (decoded.includes("..")) return null;
  return decoded;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { filename } = await params;
    const safe = safeFilename(filename);
    if (!safe) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Try current runtime public dir first (works in Next standalone), then project public dir.
    const candidates = [
      path.join(getProductUploadsDir(), safe),
      path.join(process.cwd(), "public", "uploads", "products", safe),
      path.join(process.cwd(), ".next", "standalone", "public", "uploads", "products", safe),
      path.join(process.cwd(), ".next", "public", "uploads", "products", safe),
    ];

    for (const filePath of candidates) {
      try {
        const file = await readFile(filePath);
        return new NextResponse(file, {
          status: 200,
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch {
        // Try next candidate.
      }
    }

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  } catch (error) {
    console.error("Product image serve error:", error);
    return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
  }
}
