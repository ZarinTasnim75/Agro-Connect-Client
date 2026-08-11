import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          AgroConnect
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/products"
            className="text-gray-700 hover:text-green-700"
          >
            Products
          </Link>

          <Link
            href="/categories"
            className="text-gray-700 hover:text-green-700"
          >
            Categories
          </Link>

          <Link
            href="/orders"
            className="text-gray-700 hover:text-green-700"
          >
            Orders
          </Link>

          <Link
            href="/reviews"
            className="text-gray-700 hover:text-green-700"
          >
            Reviews
          </Link>

          <Link
            href="/login"
            className="text-gray-700 hover:text-green-700"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}