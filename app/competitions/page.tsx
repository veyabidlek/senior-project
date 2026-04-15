"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { BookOpen, Plus, Calendar, Zap, Users } from "lucide-react";

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  points_per_minute: number;
  status: string;
  participants?: Array<{
    user: { id: string; display_name: string };
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
    e.preventDefault();
    try {
      setJoiningId(competitionId);
      await api.joinCompetition(competitionId);
      await loadCompetitions();
    } catch (error) {
      console.error("Failed to join competition:", error);
      alert("Failed to join competition. Please try again.");
    } finally {
      setJoiningId(null);
    }
  };

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isUserParticipant = (competition: Competition) => {
    if (!competition.participants || !user) return false;
    return competition.participants.some((p) => p.user.id === user.id);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "upcoming":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-surface-sunken text-text-muted border-border";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight">
              Competitions
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Join a challenge or create your own
            </p>
          </div>
          <Link
            href="/create-competition"
            className="px-5 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            <span>New Competition</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-sunken rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen size={28} className="text-text-muted" />
            </div>
            <h2 className="text-lg font-semibold text-text mb-1">
              No competitions yet
            </h2>
            <p className="text-sm text-text-muted mb-6">
              Be the first to create a reading competition!
            </p>
            <Link
              href="/create-competition"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              <span>Create One Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitions.map((competition) => (
              <Link
                key={competition.id}
                href={`/competitions/${competition.id}`}
                className="group bg-surface-raised rounded-2xl border border-border hover:border-secondary/40 hover:shadow-md transition-all"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <h3 className="text-base font-semibold text-text group-hover:text-secondary transition-colors leading-snug">
                      {competition.name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border whitespace-nowrap ${getStatusStyle(
                        competition.status
                      )}`}
                    >
                      {competition.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {formatDate(competition.start_date)} &ndash;{" "}
                        {formatDate(competition.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} />
                      <span>{competition.points_per_minute} pts/min</span>
                    </div>
                    {competition.participants && (
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>{competition.participants.length} participants</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-border">
                  {isUserParticipant(competition) ? (
                    <div className="text-xs font-medium text-success flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-success" />
                      Joined
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleJoinCompetition(competition.id, e)}
                      disabled={joiningId === competition.id}
                      className="text-xs font-medium text-secondary hover:text-secondary/80 disabled:opacity-40"
                    >
                      {joiningId === competition.id
                        ? "Joining..."
                        : "Join Competition"}
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
