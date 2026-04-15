"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(displayName, email, password);
      toast("Account created! Please sign in.", "success");
      router.push("/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
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
          <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={24} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Join PowerBook and start competing
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
              <label htmlFor="displayName" className="block text-sm font-medium text-text mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                placeholder="Your name"
                required
              />
            </div>

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
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                placeholder="Repeat your password"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-40 text-sm mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-secondary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
