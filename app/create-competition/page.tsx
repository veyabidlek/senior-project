"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCompetitionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pointsPerMinute, setPointsPerMinute] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const competition = await api.createCompetition({
        name,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        points_per_minute: parseInt(pointsPerMinute),
      });
      router.push(`/competitions/${competition.id}`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create competition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          href="/competitions"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to competitions
        </Link>

        <div className="bg-surface-raised p-6 sm:p-8 rounded-2xl border border-border">
          <h1 className="text-xl font-bold text-text mb-6 tracking-tight">
            Create New Competition
          </h1>

          {error && (
            <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Competition Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                placeholder="January Reading Challenge"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-text mb-1.5"
                >
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pointsPerMinute"
                className="block text-sm font-medium text-text mb-1.5"
              >
                Points Per Minute
              </label>
              <input
                type="number"
                id="pointsPerMinute"
                value={pointsPerMinute}
                onChange={(e) => setPointsPerMinute(e.target.value)}
                min="1"
                className="w-full px-4 py-2.5 bg-surface-sunken text-text border border-border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 text-sm"
                required
              />
              <p className="mt-1.5 text-xs text-text-muted">
                Points awarded per minute of reading
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-40 text-sm"
              >
                {loading ? "Creating..." : "Create Competition"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/competitions")}
                className="px-5 py-2.5 bg-surface-sunken text-text border border-border rounded-xl hover:bg-border transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
