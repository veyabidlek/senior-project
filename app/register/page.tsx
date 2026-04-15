"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
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
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(displayName, email, password);
      toast("Account created!", "success");
      router.push("/login");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-surface text-text border-2 border-border text-sm font-medium focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-text mb-2">Join</h1>
        <p className="text-sm text-text-muted mb-8 font-medium">Create your PowerBook account</p>

        <div className="border-4 border-border p-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-danger text-text-inverse text-sm font-bold">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Name</label>
              <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} placeholder="Your name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Confirm</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Repeat password" required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-text text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all disabled:opacity-40">
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-sm text-text-muted">
          Have an account? <Link href="/login" className="font-bold text-primary underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
