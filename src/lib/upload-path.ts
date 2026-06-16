import path from "path";

function isStandaloneCwd(cwd: string): boolean {
  return cwd.includes(`${path.sep}.next${path.sep}standalone`);
}

export function getProductUploadsDir(): string {
  if (process.env.PRODUCT_UPLOADS_DIR) {
    return process.env.PRODUCT_UPLOADS_DIR;
  }

  const cwd = process.cwd();

  // In standalone runtime, cwd is .next/standalone. Images are stored there directly.
  if (isStandaloneCwd(cwd)) {
    return path.resolve(cwd, "uploads", "products");
  }

  // Local development/runtime fallback.
  return path.resolve(cwd, "uploads", "products");
}
