"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { BookOpen, Plus } from "lucide-react";

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  points_per_minute: number;
  status: string;
  participants?: Array<{
    user: {
      id: string;
      display_name: string;
    };
    points: number;
    days_read: number;
    minutes_total: number;
  }>;
}

export default function CompetitionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadCompetitions();
  }, [user, router]);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      const data = await api.listCompetitions();
      // Ensure we always have an array
      setCompetitions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load competitions:", error);
      setCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async (
    competitionId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault(); // Prevent navigation to competition detail
    try {
      setJoiningId(competitionId);
      await api.joinCompetition(competitionId);
      // Reload competitions to update join status
      await loadCompetitions();
    } catch (error) {
      console.error("Failed to join competition:", error);
      alert("Failed to join competition. Please try again.");
    } finally {
      setJoiningId(null);
    }
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isUserParticipant = (competition: Competition) => {
    if (!competition.participants || !user) return false;
    return competition.participants.some((p) => p.user.id === user.id);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C2C]">
            Competitions
          </h1>
          <Link
            href="/create-competition"
            className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium shadow-md flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Create Competition</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-[#5C5C5C] py-12">
            Loading competitions...
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <BookOpen size={64} className="text-[#74725A]" />
            </div>
            <h2 className="text-2xl text-[#2C2C2C] mb-2">
              No competitions yet
            </h2>
            <p className="text-[#5C5C5C] mb-6">
              Be the first to create a reading competition!
            </p>
            <Link
              href="/create-competition"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium shadow-md"
            >
              <Plus size={18} />
              <span>Create One Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl transition-all border border-[#E8E4D9]"
              >
                <Link href={`/competitions/${competition.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-[#2C2C2C]">
                      {competition.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        competition.status === "active"
                          ? "bg-green-100 text-green-700"
                          : competition.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {competition.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-[#5C5C5C] mb-4">
                    <div>
                      <span className="font-medium">Start:</span>{" "}
                      {formatDate(competition.start_date)}
                    </div>
                    <div>
                      <span className="font-medium">End:</span>{" "}
                      {formatDate(competition.end_date)}
                    </div>
                    <div>
                      <span className="font-medium">Points/min:</span>{" "}
                      {competition.points_per_minute}
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col gap-2 pt-4 border-t border-[#E8E4D9]">
                  {isUserParticipant(competition) ? (
                    <div className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-full text-center font-medium text-sm border border-green-200">
                      ✓ Already Joined
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleJoinCompetition(competition.id, e)}
                      disabled={joiningId === competition.id}
                      className="w-full px-4 py-2 bg-[#7BA5C8] text-white rounded-full hover:bg-[#5A9B8E] transition-all font-medium disabled:opacity-50 text-sm"
                    >
                      {joiningId === competition.id
                        ? "Joining..."
                        : "Join Competition"}
                    </button>
                  )}
                  <Link
                    href={`/competitions/${competition.id}`}
                    className="w-full px-4 py-2 text-center text-[#1A1A1A] text-sm font-medium hover:underline"
                  >
                    View Leaderboard →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
