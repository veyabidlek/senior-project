"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  rank: number;
}

interface MyRank {
  rank: number;
  points: number;
  total_participants: number;
}

export default function CompetitionDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadData();
  }, [user, router, competitionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leaderboardData, rankData] = await Promise.all([
        api.getLeaderboard(competitionId, 50),
        api.getMyRank(competitionId).catch(() => null),
      ]);
      setLeaderboard(leaderboardData);
      setMyRank(rankData);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Failed to load competition data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.joinCompetition(competitionId);
      await loadData();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to join competition");
    } finally {
      setJoining(false);
    }
  };

  if (!user) {
    return null;
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-[#74725A]";
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return <Medal size={20} className="text-yellow-400" />;
    if (rank === 2) return <Medal size={20} className="text-gray-300" />;
    if (rank === 3) return <Medal size={20} className="text-orange-400" />;
    return null;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {myRank && (
          <div className="bg-[#1F1F1F] p-6 rounded-lg border border-[#262524] mb-8">
            <h2 className="text-xl font-bold text-[#DDEEC6] mb-4">
              Your Performance
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#DDEEC6]">
                  #{myRank.rank}
                </div>
                <div className="text-sm text-[#74725A]">Your Rank</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DDEEC6]">
                  {myRank.points}
                </div>
                <div className="text-sm text-[#74725A]">Points</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#DDEEC6]">
                  {myRank.total_participants}
                </div>
                <div className="text-sm text-[#74725A]">Total Participants</div>
              </div>
            </div>
          </div>
        )}

        {!myRank && !loading && (
          <div className="bg-[#1F1F1F] p-6 rounded-lg border border-[#262524] mb-8 text-center">
            <h2 className="text-xl font-bold text-[#DDEEC6] mb-2">
              Join the Competition
            </h2>
            <p className="text-[#74725A] mb-4">
              You haven&apos;t joined this competition yet
            </p>
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-6 py-3 bg-[#DDEEC6] text-[#000013] rounded-lg hover:bg-[#74725A] hover:text-[#DDEEC6] transition-colors font-medium disabled:opacity-50"
            >
              {joining ? "Joining..." : "Join Now"}
            </button>
          </div>
        )}

        <div className="bg-[#1F1F1F] rounded-lg border border-[#262524] overflow-hidden">
          <div className="p-6 border-b border-[#262524]">
            <h2 className="text-2xl font-bold text-[#DDEEC6]">Leaderboard</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[#74725A]">
              Loading leaderboard...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-4 flex justify-center">
                <Trophy size={64} className="text-[#74725A]" />
              </div>
              <p className="text-[#74725A]">
                No participants yet. Be the first to join!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#262524]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#74725A] uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-[#74725A] uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-[#74725A] uppercase tracking-wider">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262524]">
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.user_id}
                      className={`${
                        entry.user_id === user.id
                          ? "bg-[#262524]"
                          : "hover:bg-[#1E1F1F]"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`flex items-center gap-2 text-lg font-bold ${getRankColor(
                            entry.rank
                          )}`}
                        >
                          {getRankMedal(entry.rank)}
                          <span>#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[#DDEEC6] font-medium">
                          {entry.display_name}
                          {entry.user_id === user.id && (
                            <span className="ml-2 text-xs text-[#74725A]">
                              (You)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-[#DDEEC6] text-lg font-bold">
                          {entry.points.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
