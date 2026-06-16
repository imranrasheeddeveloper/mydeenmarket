import { createReadStream } from "fs";
import { access, mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProductUploadsDir } from "@/lib/upload-path";

async function runTarArchive(sourceRoot: string, relativePath: string, outputFile: string) {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn("tar", ["-czf", outputFile, "-C", sourceRoot, relativePath]);

    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    proc.on("error", (error) => reject(error));
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `tar exited with code ${code ?? "unknown"}`));
    });
  });
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productsDir = getProductUploadsDir();
    await access(productsDir);

    const sourceRoot = path.resolve(productsDir, "..", "..");
    const relativePath = path.relative(sourceRoot, productsDir);
    if (!relativePath || relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return NextResponse.json({ error: "Invalid products directory layout." }, { status: 500 });
    }

    const tmpDir = await mkdtemp(path.join(os.tmpdir(), "mydeenmarket-images-"));
    const outputFile = path.join(tmpDir, "product-images.tar.gz");

    await runTarArchive(sourceRoot, relativePath, outputFile);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `mydeenmarket-product-images-${timestamp}.tar.gz`;

    const stream = createReadStream(outputFile);
    stream.on("close", () => {
      rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    });

    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Images backup error:", error);
    return NextResponse.json(
      { error: "Failed to generate images backup. Ensure uploads/products exists and tar is installed." },
      { status: 500 }
    );
  }
}
