"use client";

import { useMemo, useState } from "react";

type ProductReview = {
  id: string;
  productId: string;
  customerName: string;
  customerEmail?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductReviewsProps = {
  productId: string;
  initialReviews: ProductReview[];
  canReview: boolean;
  isLoggedIn: boolean;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, initialReviews, canReview, isLoggedIn }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (comment.trim().length < 10) {
      setError("Please write at least 10 characters in your review.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          rating,
          comment,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not submit review");
      }

      const listRes = await fetch(`/api/products/${productId}/reviews`, { cache: "no-store" });
      if (listRes.ok) {
        const list = (await listRes.json()) as ProductReview[];
        setReviews(list);
      }

      setCustomerName("");
      setCustomerEmail("");
      setRating(5);
      setComment("");
      setSuccess("Thank you. Your review has been submitted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16 border-t border-gray-100 pt-12" aria-labelledby="reviews-heading">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 id="reviews-heading" className="text-2xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mb-6">
            <Stars rating={Math.round(averageRating || 0)} />
            <span className="text-sm text-gray-600">
              {averageRating > 0 ? `${averageRating} out of 5` : "No rating yet"} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-500">
              No reviews yet. Be the first customer to review this product.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-xl border border-gray-100 p-5 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-900">{review.customerName}</p>
                      <Stars rating={review.rating} />
                    </div>
                    <time className="text-xs text-gray-500">{formatDate(review.createdAt)}</time>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

          {!isLoggedIn ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Please log in and purchase this product to write a review.
            </div>
          ) : !canReview ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Review is available only for customers who purchased this product.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                disabled={!canReview || !isLoggedIn}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={!canReview || !isLoggedIn}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={!canReview || !isLoggedIn}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very Good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                required
                minLength={10}
                disabled={!canReview || !isLoggedIn}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
                placeholder="Share your experience with this product"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={loading || !canReview || !isLoggedIn}
              className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 transition-colors"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
