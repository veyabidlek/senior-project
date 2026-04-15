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
      router.push("/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface text-text border-2 border-border text-sm font-medium focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-text mb-2">Sign In</h1>
        <p className="text-sm text-text-muted mb-8 font-medium">Welcome back to PowerBook</p>

        <div className="border-4 border-border p-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-danger text-text-inverse text-sm font-bold">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Your password" required />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-text text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all disabled:opacity-40">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-sm text-text-muted">
          No account? <Link href="/register" className="font-bold text-primary underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
