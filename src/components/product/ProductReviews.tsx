"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Product, ProductReview, submitProductReview } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface ProductReviewsProps {
  product: Product;
}

const brown = "#6B3E26";
const border = "#E8D5BC";
const panelBg = "#FDF6EC";
const muted = "#7A5C45";

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} style={{ fontSize: size, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= Math.round(rating) ? "#E5A340" : "#E8D5BC" }}>
          ★
        </span>
      ))}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

const PAGE_SIZE = 5;

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { user, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>(product.pRatingsReviews || []);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const alreadyReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some((r) => {
      const reviewUserId = typeof r.user === "object" ? r.user?._id : r.user;
      return reviewUserId === user._id;
    });
  }, [reviews, user]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, r) => total + Number(r.rating || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const reviewerLabel = (r: ProductReview) => {
    if (r.reviewerName) return r.reviewerName;
    if (typeof r.user === "object" && r.user?.name) return r.user.name;
    return "Verified Buyer";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (rating < 1) {
      setFormError("Please select a star rating.");
      return;
    }
    if (!body.trim()) {
      setFormError("Please write a few words about your experience.");
      return;
    }

    setSubmitting(true);
    const result = await submitProductReview(product._id, rating, body.trim(), title.trim() || undefined);
    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    setReviews((prev) => [
      {
        _id: `local-${Date.now()}`,
        review: body.trim(),
        title: title.trim() || undefined,
        rating: String(rating),
        user: user ? { _id: user._id, name: user.name } : undefined,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setSubmitted(true);
    setRating(0);
    setTitle("");
    setBody("");
  };

  return (
    <div style={{ borderTop: `1.5px solid ${border}` }} className="pt-12 mb-16 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Merriweather', serif", color: brown }}>
            Customer Reviews
          </h3>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-3">
              <Stars rating={averageRating} size={20} />
              <span className="text-sm font-bold" style={{ color: brown }}>
                {averageRating.toFixed(1)} out of 5
              </span>
              <span className="text-sm" style={{ color: muted }}>
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          ) : (
            <p className="text-sm" style={{ color: muted }}>
              Be the first to review this product.
            </p>
          )}
        </div>
      </div>

      {/* Write a review */}
      <div className="rounded-3xl p-6 sm:p-8" style={{ background: panelBg, border: `1.5px solid ${border}` }}>
        {!isLoggedIn ? (
          <p className="text-sm" style={{ color: muted }}>
            <Link href="/login" className="font-bold underline" style={{ color: brown }}>
              Log in
            </Link>{" "}
            to write a review.
          </p>
        ) : alreadyReviewed ? (
          <p className="text-sm font-semibold" style={{ color: brown }}>
            You&rsquo;ve already reviewed this product &mdash; thanks for your feedback!
          </p>
        ) : submitted ? (
          <p className="text-sm font-semibold" style={{ color: brown }}>
            Thanks for your review! It&rsquo;s now visible below.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="text-sm font-bold" style={{ color: brown }}>
              Write a Review
            </h4>

            <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => setRating(n)}
                  className="text-2xl leading-none cursor-pointer"
                  style={{ color: n <= (hoverRating || rating) ? "#E5A340" : "#E8D5BC" }}
                >
                  ★
                </button>
              ))}
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Review title (optional)"
              maxLength={150}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              style={{ border: `1px solid ${border}`, background: "#fff", color: "#2C1A0E" }}
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none focus:outline-none"
              style={{ border: `1px solid ${border}`, background: "#fff", color: "#2C1A0E" }}
            />

            {formError && <p className="text-xs font-semibold" style={{ color: "#B23A2A" }}>{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-55"
              style={{ background: brown, color: "#F5E9DA" }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>

      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-5">
          {reviews.slice(0, visibleCount).map((r) => (
            <div key={r._id} className="pb-5" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <Stars rating={Number(r.rating)} />
                  {r.title && (
                    <span className="text-sm font-bold" style={{ color: "#2C1A0E" }}>
                      {r.title}
                    </span>
                  )}
                </div>
                <span className="text-xs whitespace-nowrap" style={{ color: muted }}>
                  {formatDate(r.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-1.5" style={{ color: "#3a2a1c" }}>
                {r.review}
              </p>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: muted }}>
                {reviewerLabel(r)}
              </span>
            </div>
          ))}

          {visibleCount < reviews.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="text-sm font-bold underline"
              style={{ color: brown }}
            >
              Show more reviews ({reviews.length - visibleCount} more)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
