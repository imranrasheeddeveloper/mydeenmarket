"use client";

import { useState } from "react";

type DownloadKind = "" | "database" | "images";

function getFilenameFromDisposition(contentDisposition: string | null, fallback: string) {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
  return match?.[1] || fallback;
}

export default function AdminBackupsPage() {
  const [downloading, setDownloading] = useState<DownloadKind>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function downloadBackup(kind: Exclude<DownloadKind, "">) {
    setDownloading(kind);
    setMessage("");
    setError("");

    try {
      const endpoint = kind === "database" ? "/api/admin/backups/database" : "/api/admin/backups/images";
      const fallback = kind === "database" ? "database.sql" : "product-images.tar.gz";

      const res = await fetch(endpoint, { method: "GET" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Failed to download backup.");
        return;
      }

      const blob = await res.blob();
      const filename = getFilenameFromDisposition(res.headers.get("Content-Disposition"), fallback);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setMessage(kind === "database" ? "Database backup downloaded." : "Images backup downloaded.");
    } catch {
      setError("Failed to download backup.");
    } finally {
      setDownloading("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backups</h1>
        <p className="text-sm text-gray-500 mt-1">Download production database and product images from the admin panel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-lg font-bold text-gray-900">Database Backup</h2>
          <p className="text-sm text-gray-600 mt-2">
            Downloads a fresh PostgreSQL SQL dump from current production database.
          </p>
          <button
            onClick={() => downloadBackup("database")}
            disabled={downloading !== ""}
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
          >
            {downloading === "database" ? "Preparing..." : "Download Database SQL"}
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-lg font-bold text-gray-900">Product Images Backup</h2>
          <p className="text-sm text-gray-600 mt-2">
            Downloads a tar.gz archive that keeps the uploads/products folder structure so you can place it back directly.
          </p>
          <button
            onClick={() => downloadBackup("images")}
            disabled={downloading !== ""}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
          >
            {downloading === "images" ? "Preparing..." : "Download Product Images"}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 space-y-1">
        <p className="font-semibold">Restore note</p>
        <p>Extract images archive at your project root so uploads/products is recreated in the correct place.</p>
        <p>Then restore database dump using psql against your target database.</p>
      </div>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
