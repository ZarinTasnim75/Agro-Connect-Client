"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

const API_URL = "https://agro-connect-server.onrender.com/api/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const data = await response.json();

//       if (data.success) {
//         setCategories(data.data);
//       }
//     } catch {
//       setMessage("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

const fetchCategories = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data.success) {
      setCategories(data.data);
    }
  } catch {
    setMessage("Failed to load categories");
  }
};

useEffect(() => {
  let cancelled = false;

  const loadCategories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!cancelled && data.success) {
        setCategories(data.data);
      }
    } catch {
      if (!cancelled) {
        setMessage("Failed to load categories");
      }
    }
  };

  void loadCategories();

  return () => {
    cancelled = true;
  };
}, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setMessage("Category name is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Operation failed");
        return;
      }

      setMessage(data.message);
      resetForm();
      await fetchCategories();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed");
        return;
      }

      setMessage(data.message);
      await fetchCategories();
    } catch {
      setMessage("Failed to delete category");
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Categories
          </h1>

          <p className="mt-2 text-gray-600">
            Manage agricultural product categories.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId
              ? "Update Category"
              : "Add Category"}
          </h2>

          <div className="mt-5 space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Description"
              rows={3}
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
                    ? "Update Category"
                    : "Add Category"}
              </button>

              {editingId && (
                <button
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
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

        {/* Category List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            All Categories
          </h2>

          <div className="mt-4 space-y-3">
            {categories.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                No categories found.
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {category.description ||
                        "No description"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit(category)
                      }
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(category.id)
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