"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { Trophy, Medal, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

  if (!user) return null;

  const getRankDisplay = (rank: number) => {
    if (rank === 1)
      return (
        <div className="flex items-center gap-1.5">
          <Medal size={16} className="text-warning" />
          <span className="text-warning font-bold">1st</span>
        </div>
      );
    if (rank === 2)
      return (
        <div className="flex items-center gap-1.5">
          <Medal size={16} className="text-text-muted" />
          <span className="text-text-muted font-bold">2nd</span>
        </div>
      );
    if (rank === 3)
      return (
        <div className="flex items-center gap-1.5">
          <Medal size={16} className="text-primary" />
          <span className="text-primary font-bold">3rd</span>
        </div>
      );
    return <span className="text-text-muted font-medium">#{rank}</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          href="/competitions"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Back to competitions
        </Link>

        {error && (
          <div className="mb-6 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {/* Stats cards - Bento grid */}
        {myRank && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-surface-raised rounded-2xl p-5 border border-border text-center">
              <div className="text-2xl font-bold text-text tracking-tight">
                #{myRank.rank}
              </div>
              <div className="text-xs text-text-muted mt-1">Your Rank</div>
            </div>
            <div className="bg-surface-raised rounded-2xl p-5 border border-border text-center">
              <div className="text-2xl font-bold text-secondary tracking-tight">
                {myRank.points.toLocaleString()}
              </div>
              <div className="text-xs text-text-muted mt-1">Points</div>
            </div>
            <div className="bg-surface-raised rounded-2xl p-5 border border-border text-center">
              <div className="text-2xl font-bold text-text tracking-tight">
                {myRank.total_participants}
              </div>
              <div className="text-xs text-text-muted mt-1">Participants</div>
            </div>
          </div>
        )}

        {!myRank && !loading && (
          <div className="bg-secondary/10 rounded-2xl border border-secondary/20 p-6 mb-6 text-center">
            <h2 className="text-base font-semibold text-text mb-1">
              Join the Competition
            </h2>
            <p className="text-sm text-text-muted mb-4">
              You haven&apos;t joined this competition yet
            </p>
            <button
              onClick={handleJoin}
              disabled={joining}
              className="px-5 py-2.5 bg-secondary text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium disabled:opacity-40 text-sm"
            >
              {joining ? "Joining..." : "Join Now"}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-surface-raised rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Trophy size={16} className="text-warning" />
            <h2 className="text-base font-semibold text-text">Leaderboard</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-surface-sunken rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trophy size={24} className="text-text-muted" />
              </div>
              <p className="text-sm text-text-muted">
                No participants yet. Be the first to join!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {leaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    entry.user_id === user.id
                      ? "bg-secondary/5"
                      : "hover:bg-surface-sunken"
                  } transition-colors`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center">
                      {getRankDisplay(entry.rank)}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/40 flex items-center justify-center text-xs font-bold text-text">
                      {entry.display_name[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-text">
                        {entry.display_name}
                      </span>
                      {entry.user_id === user.id && (
                        <span className="ml-2 text-xs text-secondary font-medium">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-text font-mono">
                    {entry.points.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
