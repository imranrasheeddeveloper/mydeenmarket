import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@/lib/auth";
import { getProductUploadsDir } from "@/lib/upload-path";

const MAX_WIDTH = 1400;
const MAX_HEIGHT = 1400;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Normalize and compress all incoming formats (png/webp/jpeg/etc.) into efficient WebP.
    const optimizedBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${Date.now()}-${randomUUID()}.webp`;
    const uploadsDir = getProductUploadsDir();
    const targetPath = path.join(uploadsDir, fileName);

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(targetPath, optimizedBuffer);

    return NextResponse.json({ success: true, url: `/uploads/products/${fileName}` });
  } catch (error) {
    console.error("Upload image error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
