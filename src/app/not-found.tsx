import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-md mx-auto">
        <p className="text-8xl font-bold text-emerald-200 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/collections"
            className="px-6 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
