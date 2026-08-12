"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  image: string | null;
  status: string;
  farmer: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
};

const PRODUCT_API =
  "http://localhost:5000/api/products";

const CATEGORY_API =
  "http://localhost:5000/api/categories";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [farmerId, setFarmerId] = useState("");

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCT_API);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch {
      setMessage("Failed to load products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORY_API);
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

    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] =
          await Promise.all([
            fetch(PRODUCT_API),
            fetch(CATEGORY_API),
          ]);

        const productsData =
          await productsResponse.json();

        const categoriesData =
          await categoriesResponse.json();

        if (!cancelled) {
          if (productsData.success) {
            setProducts(productsData.data);
          }

          if (categoriesData.success) {
            setCategories(categoriesData.data);
          }
        }
      } catch {
        if (!cancelled) {
          setMessage("Failed to load data");
        }
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setUnit("kg");
    setImage("");
    setCategoryId("");
    setFarmerId("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !unit ||
      !categoryId
    ) {
      setMessage("Please fill in all required fields");
      return;
    }

    if (!editingId && !farmerId) {
      setMessage("Farmer ID is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const url = editingId
        ? `${PRODUCT_API}/${editingId}`
        : PRODUCT_API;

      const body = editingId
        ? {
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
            unit,
            image: image || undefined,
            categoryId,
          }
        : {
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
            unit,
            image: image || undefined,
            farmerId,
            categoryId,
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

      await fetchProducts();
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setQuantity(String(product.quantity));
    setUnit(product.unit);
    setImage(product.image || "");
    setCategoryId(product.category.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${PRODUCT_API}/${id}`,
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

      await fetchProducts();
    } catch {
      setMessage("Failed to delete product");
    }
  };

  return (
    <main className="min-h-[calc(100vh-73px)] bg-green-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-gray-600">
            Manage agricultural products and farmer listings.
          </p>
        </div>

        {/* FORM */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            {editingId
              ? "Update Product"
              : "Add Product"}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <input
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              type="number"
              placeholder="Quantity"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit (kg, liter, piece)"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-green-600"
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {!editingId && (
              <input
                value={farmerId}
                onChange={(e) =>
                  setFarmerId(e.target.value)
                }
                placeholder="Farmer ID"
                className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
              />
            )}

            <input
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              placeholder="Image URL (optional)"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 md:col-span-2"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Product description"
              rows={3}
              className="resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 md:col-span-2"
            />

          </div>

          <div className="mt-5 flex gap-3">

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}
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

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
              {message}
            </p>
          )}

        </div>

        {/* PRODUCTS */}

        <div className="mt-10">

          <h2 className="text-xl font-semibold text-gray-900">
            All Products
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">

            {products.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500 md:col-span-2">
                No products found.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >

                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mb-4 h-48 w-full rounded-lg object-cover"
                    />
                  )}

                  <div className="flex items-start justify-between">

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.description}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {product.status}
                    </span>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

                    <div>
                      <span className="text-gray-500">
                        Price
                      </span>

                      <p className="font-semibold">
                        ৳{product.price}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Quantity
                      </span>

                      <p className="font-semibold">
                        {product.quantity}{" "} per {" "}
                        {product.unit} kg
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Farmer
                      </span>

                      <p className="font-semibold">
                        {product.farmer.name}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Category
                      </span>

                      <p className="font-semibold">
                        {product.category.name}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(product)
                      }
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product.id)
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