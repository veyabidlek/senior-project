"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BookOpen } from "lucide-react";

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
      router.push("/dashboard");
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

      <div className="max-w-sm mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-text" />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Sign in to your PowerBook account
          </p>
        </div>

        <div className="bg-surface-raised p-6 rounded-2xl border border-border">
          {error && (
            <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                placeholder="Your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-40 text-sm mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-secondary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
