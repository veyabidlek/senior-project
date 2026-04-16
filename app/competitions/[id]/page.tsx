"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";
import { Trophy, ArrowLeft, Calendar, Zap, Share2, LogIn } from "lucide-react";
import Link from "next/link";

interface LeaderboardEntry { user_id: string; display_name: string; points: number; rank: number; }
interface MyRank { rank: number; points: number; total_participants: number; }

export default function CompetitionDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<{ name: string; start_date: string; end_date: string; points_per_minute: number; status: string } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, competitionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const promises: [Promise<LeaderboardEntry[]>, Promise<MyRank | null>, Promise<typeof competition>] = [
        api.getLeaderboard(competitionId, 50),
        user ? api.getMyRank(competitionId).catch(() => null) : Promise.resolve(null),
        api.getCompetition(competitionId).catch(() => null),
      ];
      const [lb, rank, comp] = await Promise.all(promises);
      setLeaderboard(Array.isArray(lb) ? lb : []);
      setMyRank(rank);
      setCompetition(comp);
    } catch { toast("Failed to load data", "error"); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    setJoining(true);
    try { await api.joinCompetition(competitionId); toast("Joined!", "success"); await loadData(); }
    catch { toast("Failed to join", "error"); }
    finally { setJoining(false); }
  };

  const getRank = (rank: number) => {
    if (rank === 1) return <span className="text-secondary font-black">1ST</span>;
    if (rank === 2) return <span className="text-text-muted font-black">2ND</span>;
    if (rank === 3) return <span className="text-primary font-black">3RD</span>;
    return <span className="text-text-muted font-bold">#{rank}</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <Confetti show={!loading && myRank?.rank === 1} />
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <Link href="/competitions" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text border-b-2 border-transparent hover:border-border transition-all mb-6">
          <ArrowLeft size={12} /> Back
        </Link>

        {/* Header */}
        {competition && (
          <div className="mb-6 border-b-4 border-border pb-6">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-text">{competition.name}</h1>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Link copied!", "success"); }}
                className="p-2 border-2 border-border hover:bg-surface-sunken transition-all" aria-label="Share">
                <Share2 size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-text-muted mt-3">
              <div className="flex items-center gap-1.5"><Calendar size={12} />{new Date(competition.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(competition.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              <div className="flex items-center gap-1.5"><Zap size={12} />{competition.points_per_minute} pts/min</div>
              <span className={`px-2 py-0.5 ${competition.status === "active" || competition.status === "open" ? "bg-success text-text-inverse" : "bg-surface-sunken"}`}>{competition.status}</span>
            </div>
          </div>
        )}

        {/* Timer */}
        {competition && competition.status !== "closed" && (
          <div className="mb-6"><CountdownTimer endDate={competition.end_date} startDate={competition.start_date} status={competition.status} /></div>
        )}

        {/* Stats - only for logged-in joined users */}
        {!loading && user && myRank && (
          <div className="grid grid-cols-3 gap-0 border-4 border-border mb-6">
            <div className="p-4 sm:p-5 text-center border-r-2 border-border">
              <div className="text-2xl font-black text-text">#{myRank.rank}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Rank</div>
            </div>
            <div className="p-4 sm:p-5 text-center border-r-2 border-border">
              <div className="text-2xl font-black text-primary font-mono">{myRank.points.toLocaleString()}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Points</div>
            </div>
            <div className="p-4 sm:p-5 text-center">
              <div className="text-2xl font-black text-text">{myRank.total_participants}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">Players</div>
            </div>
          </div>
        )}

        {/* Join CTA - different for logged-in vs logged-out */}
        {!loading && !user && (
          <div className="border-4 border-primary p-6 mb-6 text-center">
            <h2 className="text-base font-black uppercase text-text mb-1">Want to Compete?</h2>
            <p className="text-xs text-text-muted mb-4">Sign in to join this competition</p>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-secondary transition-all">
              <LogIn size={14} /> Sign In to Join
            </Link>
          </div>
        )}

        {user && !myRank && !loading && (
          <div className="border-4 border-secondary p-6 mb-6 text-center">
            <h2 className="text-base font-black uppercase text-text mb-1">Join This Competition</h2>
            <p className="text-xs text-text-muted mb-4">You haven&apos;t joined yet</p>
            <button onClick={handleJoin} disabled={joining}
              className="px-6 py-3 bg-secondary text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all disabled:opacity-40">
              {joining ? "Joining..." : "Join Now"}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="border-4 border-border">
          <div className="px-5 py-4 border-b-4 border-border flex items-center gap-2 bg-surface-sunken">
            <Trophy size={16} className="text-secondary" />
            <h2 className="text-sm font-black uppercase tracking-wider text-text">Leaderboard</h2>
          </div>

          {loading ? (
            <div className="text-center py-16 text-lg font-bold uppercase animate-pulse">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 text-center">
              <Trophy size={28} className="text-text-muted mx-auto mb-3" />
              <p className="text-sm text-text-muted font-medium">No participants yet</p>
            </div>
          ) : (
            <div>
              {leaderboard.map((entry) => (
                <div key={entry.user_id}
                  className={`flex items-center justify-between px-5 py-3 border-b-2 border-border transition-colors ${
                    user && entry.user_id === user.id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-surface-sunken"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center text-sm">{getRank(entry.rank)}</div>
                    <Link href={`/users/${entry.user_id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                      <div className="w-8 h-8 bg-surface-sunken border-2 border-border flex items-center justify-center text-xs font-black text-text">
                        {(entry.display_name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-text hover:text-primary transition-colors">{entry.display_name}</span>
                        {user && entry.user_id === user.id && <span className="ml-2 text-xs font-bold text-primary uppercase">You</span>}
                      </div>
                    </Link>
                  </div>
                  <div className="text-sm font-black text-text font-mono">{entry.points.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
