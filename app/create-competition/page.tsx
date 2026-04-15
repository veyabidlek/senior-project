"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCompetitionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pointsPerMinute, setPointsPerMinute] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!user) router.push("/login"); }, [user, router]);
  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (new Date(startDate) >= new Date(endDate)) { setError("End date must be after start date"); return; }
    setLoading(true);
    try {
      const comp = await api.createCompetition({ name, start_date: new Date(startDate).toISOString(), end_date: new Date(endDate).toISOString(), points_per_minute: parseInt(pointsPerMinute) });
      toast("Competition created!", "success");
      router.push(`/competitions/${comp.id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create");
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-surface text-text border-2 border-border text-sm font-medium focus:outline-none focus:border-primary font-mono";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">
        <Link href="/competitions" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text mb-6">
          <ArrowLeft size={12} /> Back
        </Link>
        <div className="border-4 border-border p-6 sm:p-8">
          <h1 className="text-xl font-black uppercase tracking-tighter text-text mb-6">New Competition</h1>
          {error && <div className="mb-4 px-4 py-3 bg-danger text-text-inverse text-sm font-bold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="April Reading Challenge" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Start</label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">End</label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">Points/Minute</label>
              <input type="number" value={pointsPerMinute} onChange={(e) => setPointsPerMinute(e.target.value)} min="1" className={inputClass} required />
            </div>
            <div className="flex gap-0">
              <button type="submit" disabled={loading} className="flex-1 px-5 py-3 bg-text text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all disabled:opacity-40">
                {loading ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => router.push("/competitions")} className="px-5 py-3 bg-surface text-text font-bold uppercase tracking-wider text-sm border-2 border-border hover:bg-surface-sunken transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
