"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              {session.user.image ? (
                <img src={session.user.image} alt={`${session.user.name || "User"} profile picture`} className="w-20 h-20 rounded-full object-cover" width={80} height={80} />
              ) : (
                <span className="text-3xl font-bold text-emerald-700">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <h2 className="font-bold text-gray-900">{session.user.name}</h2>
            <p className="text-sm text-gray-500">{session.user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
              {session.user.role || "customer"}
            </span>

            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="mt-4 w-full block py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors text-center"
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-3 w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 text-sm">No orders yet</p>
              <Link href="/collections" className="inline-block mt-3 text-sm text-emerald-700 font-medium hover:underline">
                Start Shopping →
              </Link>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Saved Addresses</h2>
              <button className="text-sm text-emerald-700 font-medium hover:underline">
                + Add Address
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No addresses saved</p>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Wishlist</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Your wishlist is empty</p>
              <Link href="/collections" className="inline-block mt-3 text-sm text-emerald-700 font-medium hover:underline">
                Browse Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
