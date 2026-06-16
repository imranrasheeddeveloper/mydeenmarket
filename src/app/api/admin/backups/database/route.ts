import { createReadStream } from "fs";
import { mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

async function runPgDump(databaseUrl: string, outputFile: string) {
  await new Promise<void>((resolve, reject) => {
    const proc = spawn("pg_dump", [
      "--no-owner",
      "--no-privileges",
      "--file",
      outputFile,
      databaseUrl,
    ]);

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
      reject(new Error(stderr || `pg_dump exited with code ${code ?? "unknown"}`));
    });
  });
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
    }

    const tmpDir = await mkdtemp(path.join(os.tmpdir(), "mydeenmarket-db-"));
    const outputFile = path.join(tmpDir, "database.sql");

    await runPgDump(databaseUrl, outputFile);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `mydeenmarket-database-${timestamp}.sql`;

    const stream = createReadStream(outputFile);
    stream.on("close", () => {
      rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    });

    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/sql; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Database backup error:", error);
    return NextResponse.json(
      { error: "Failed to generate database backup. Ensure pg_dump is installed on the server." },
      { status: 500 }
    );
  }
}
