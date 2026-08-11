import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-green-50">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">
        <span className="mb-4 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          Agricultural Marketplace
        </span>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900">
          Connecting Farmers and Customers
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          AgroConnect makes it simple for farmers to sell
          agricultural products and for customers to discover
          fresh products.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800"
          >
            Explore Products
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-green-700 px-6 py-3 font-medium text-green-700 hover:bg-green-100"
          >
            Join AgroConnect
          </Link>
        </div>
      </section>
    </main>
  );
}