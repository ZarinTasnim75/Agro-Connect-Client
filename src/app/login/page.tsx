"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsSuccess(false);

    try {
      const response = await fetch("https://agro-connect-server.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setMessage(data.message || "Login failed");
        return;
      }

      // Store the JWT access token in localStorage
      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }

      setIsSuccess(true);
      setMessage("Login successful!");

      setEmail("");
      setPassword("");

      // Optional: Redirect to home page after a brief delay
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch {
      setIsSuccess(false);
      setMessage("Could not connect to the backend");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-green-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>

        <p className="mt-2 text-gray-500">
          Sign in to your AgroConnect account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 rounded-lg p-3 text-center text-sm font-medium ${
              isSuccess
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}