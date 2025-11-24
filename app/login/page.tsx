"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      router.push("/competitions");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-[#1F1F1F] p-8 rounded-lg border border-[#262524]">
          <h1 className="text-3xl font-bold text-[#DDEEC6] mb-6 text-center">
            Login to PowerBook
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[#DDEEC6] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-[#262524] text-[#DDEEC6] border border-[#74725A] rounded-lg focus:outline-none focus:border-[#DDEEC6]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#DDEEC6] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#262524] text-[#DDEEC6] border border-[#74725A] rounded-lg focus:outline-none focus:border-[#DDEEC6]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#DDEEC6] text-[#000013] rounded-lg hover:bg-[#74725A] hover:text-[#DDEEC6] transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-[#74725A]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#DDEEC6] hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
