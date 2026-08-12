"use client";

import { useEffect, useState } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  user: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
};

const REVIEW_API = "http://localhost:5000/api/reviews";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch(REVIEW_API);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch {
      setMessage("Failed to load reviews");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        const response = await fetch(REVIEW_API);
        const data = await response.json();

        if (!cancelled && data.success) {
          setReviews(data.data);
        }
      } catch {
        if (!cancelled) {
          setMessage("Failed to load reviews");
        }
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setRating("5");
    setComment("");
    setUserId("");
    setProductId("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!rating || !comment) {
      setMessage("Rating and comment are required");
      return;
    }

    if (!editingId && (!userId || !productId)) {
      setMessage("User ID and Product ID are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${REVIEW_API}/${editingId}`
        : REVIEW_API;

      const body = editingId
        ? {
            rating: Number(rating),
            comment,
          }
        : {
            rating: Number(rating),
            comment,
            userId,
            productId,
          };

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Operation failed");
        return;
      }

      setMessage(data.message);

      resetForm();

      await fetchReviews();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setRating(String(review.rating));
    setComment(review.comment || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${REVIEW_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage(data.message);

      await fetchReviews();
    } catch {
      setMessage("Failed to delete review");
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reviews
          </h1>

          <p className="mt-2 text-gray-600">
            Manage product reviews and ratings.
          </p>
        </div>

        {/* FORM */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            {editingId
              ? "Update Review"
              : "Add Review"}
          </h2>

          <div className="mt-5 space-y-4">

            {!editingId && (
              <>
                <input
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                  placeholder="User ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />

                <input
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value)
                  }
                  placeholder="Product ID"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                />
              </>
            )}

            <select
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Good</option>
              <option value="3">3 - Average</option>
              <option value="2">2 - Poor</option>
              <option value="1">1 - Very Poor</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <div className="flex gap-3">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Review"
                    : "Add Review"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700"
                >
                  Cancel
                </button>
              )}

            </div>

          </div>

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
              {message}
            </p>
          )}

        </div>

        {/* REVIEWS */}

        <div className="mt-10">

          <h2 className="text-xl font-semibold text-gray-900">
            All Reviews
          </h2>

          <div className="mt-4 space-y-4">

            {reviews.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                No reviews found.
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between">

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {review.product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Reviewed by {review.user.name}
                      </p>
                    </div>

                    <div className="text-lg font-semibold text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                  </div>

                  <p className="mt-4 text-gray-700">
                    {review.comment || "No comment"}
                  </p>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(review)
                      }
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(review.id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>
    </main>
  );
}