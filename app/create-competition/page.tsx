"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

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

  if (!user) {
    return null;
  }

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#E8E4D9]">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] mb-6">
            Create New Competition
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-[#2C2C2C] mb-2 font-medium"
              >
                Competition Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#F5F1E8] text-[#2C2C2C] border border-[#E8E4D9] rounded-2xl focus:outline-none focus:border-[#7BA5C8] focus:ring-2 focus:ring-[#7BA5C8]/20"
                placeholder="January Reading Challenge"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-[#2C2C2C] mb-2 font-medium"
                >
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F1E8] text-[#2C2C2C] border border-[#E8E4D9] rounded-2xl focus:outline-none focus:border-[#7BA5C8] focus:ring-2 focus:ring-[#7BA5C8]/20"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-[#2C2C2C] mb-2 font-medium"
                >
                  End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F1E8] text-[#2C2C2C] border border-[#E8E4D9] rounded-2xl focus:outline-none focus:border-[#7BA5C8] focus:ring-2 focus:ring-[#7BA5C8]/20"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="pointsPerMinute"
                className="block text-[#2C2C2C] mb-2 font-medium"
              >
                Points Per Minute
              </label>
              <input
                type="number"
                id="pointsPerMinute"
                value={pointsPerMinute}
                onChange={(e) => setPointsPerMinute(e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-[#F5F1E8] text-[#2C2C2C] border border-[#E8E4D9] rounded-2xl focus:outline-none focus:border-[#7BA5C8] focus:ring-2 focus:ring-[#7BA5C8]/20"
                required
              />
              <p className="mt-2 text-sm text-[#5C5C5C]">
                Points awarded per minute of reading
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium disabled:opacity-50 shadow-md"
              >
                {loading ? "Creating..." : "Create Competition"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/competitions")}
                className="px-6 py-3 bg-white text-[#2C2C2C] border border-[#E8E4D9] rounded-full hover:bg-[#F5F1E8] transition-all font-medium"
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
