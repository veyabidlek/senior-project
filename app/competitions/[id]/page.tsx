"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import CountdownTimer from "@/components/CountdownTimer";
import Confetti from "@/components/Confetti";
import { Trophy, ArrowLeft, Calendar, Zap, Share2, LogIn, Gift, ArrowRight, Check, X } from "lucide-react";
import Link from "next/link";
import type { GiftExchange } from "@/lib/types";

interface LeaderboardEntry { user_id: string; display_name: string; points: number; rank: number; }
interface MyRank { rank: number; points: number; total_participants: number; }

export default function CompetitionDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const { toast } = useToast();
  const competitionId = params.id as string;

  const [competition, setCompetition] = useState<{ name: string; start_date: string; end_date: string; points_per_minute: number; status: string; participants?: Array<{ user: { id: string; display_name: string }; points: number; days_read: number; minutes_total: number }> } | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [gifts, setGifts] = useState<GiftExchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState<"gifts" | "standings">("gifts");

  useEffect(() => {
    loadData();
  }, [user, competitionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lb, rank, comp, giftList] = await Promise.all([
        api.getLeaderboard(competitionId, 50).catch(() => []),
        user ? api.getMyRank(competitionId).catch(() => null) : Promise.resolve(null),
        api.getCompetition(competitionId).catch(() => null),
        api.getGiftExchanges(competitionId).catch(() => []),
      ]);

      let leaderboardData = Array.isArray(lb) ? lb : [];

      // For closed competitions (or when Redis has no data), build leaderboard from participants
      if (leaderboardData.length === 0 && comp?.participants && comp.participants.length > 0) {
        leaderboardData = [...comp.participants]
          .sort((a, b) => b.points - a.points)
          .map((p, i) => ({
            user_id: p.user.id,
            display_name: p.user.display_name,
            points: p.points,
            rank: i + 1,
          }));
      }

      setLeaderboard(leaderboardData);
      setMyRank(rank);
      setCompetition(comp);
      setGifts(Array.isArray(giftList) ? giftList : []);
    } catch { toast("Failed to load data", "error"); }
    finally { setLoading(false); }
  };

  const handleJoin = async () => {
    setJoining(true);
    try { await api.joinCompetition(competitionId); toast("Joined!", "success"); await loadData(); }
    catch { toast("Failed to join", "error"); }
    finally { setJoining(false); }
  };

  const handleConfirmGift = async (giftId: string, description?: string) => {
    try {
      await api.confirmGift(giftId, description);
      toast("Confirmed!", "success");
      await loadData();
    } catch { toast("Failed to confirm", "error"); }
  };

  const getRank = (rank: number) => {
    if (rank === 1) return <span className="text-secondary font-black">1ST</span>;
    if (rank === 2) return <span className="text-text-muted font-black">2ND</span>;
    if (rank === 3) return <span className="text-primary font-black">3RD</span>;
    return <span className="text-text-muted font-bold">#{rank}</span>;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const isClosed = competition?.status === "closed";

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

        {/* Timer - only for active */}
        {competition && !isClosed && (
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

        {/* Join CTA */}
        {!loading && !isClosed && !user && (
          <div className="border-4 border-primary p-6 mb-6 text-center">
            <h2 className="text-base font-black uppercase text-text mb-1">Want to Compete?</h2>
            <p className="text-xs text-text-muted mb-4">Sign in to join this competition</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-secondary transition-all">
              <LogIn size={14} /> Sign In to Join
            </Link>
          </div>
        )}

        {user && !myRank && !loading && !isClosed && (
          <div className="border-4 border-secondary p-6 mb-6 text-center">
            <h2 className="text-base font-black uppercase text-text mb-1">Join This Competition</h2>
            <p className="text-xs text-text-muted mb-4">You haven&apos;t joined yet</p>
            <button onClick={handleJoin} disabled={joining}
              className="px-6 py-3 bg-secondary text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all disabled:opacity-40">
              {joining ? "Joining..." : "Join Now"}
            </button>
          </div>
        )}

        {/* CLOSED: Tab switcher */}
        {isClosed && !loading && (
          <div className="flex border-4 border-border mb-0">
            <button onClick={() => setActiveTab("gifts")}
              className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === "gifts" ? "bg-primary text-text-inverse" : "bg-surface-sunken text-text-muted hover:bg-surface-raised"}`}>
              <Gift size={14} /> Gift Exchange
            </button>
            <button onClick={() => setActiveTab("standings")}
              className={`flex-1 px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-l-2 border-border transition-colors ${activeTab === "standings" ? "bg-primary text-text-inverse" : "bg-surface-sunken text-text-muted hover:bg-surface-raised"}`}>
              <Trophy size={14} /> Final Standings
            </button>
          </div>
        )}

        {/* CLOSED: Gift Exchange View */}
        {isClosed && !loading && activeTab === "gifts" && (
          <div className="border-4 border-border border-t-0">
            {gifts.length === 0 ? (
              <div className="py-16 text-center">
                <Gift size={28} className="text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-muted font-medium">No gift pairings yet</p>
              </div>
            ) : (
              <div>
                <div className="px-5 py-3 bg-surface-sunken border-b-2 border-border">
                  <p className="text-xs text-text-muted font-medium">Top 50% give gifts to bottom 50%. Confirm once given/received.</p>
                </div>
                {gifts.map((g) => {
                  const isGiver = user?.id === g.giver_id;
                  const isReceiver = user?.id === g.receiver_id;
                  return (
                    <div key={g.id} className={`px-5 py-4 border-b-2 border-border ${isGiver || isReceiver ? "bg-primary/5" : ""}`}>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link href={`/users/${g.giver_id}`} className="flex items-center gap-2 hover:opacity-80">
                          <div className="w-8 h-8 bg-success/20 border-2 border-success flex items-center justify-center text-xs font-black">
                            {g.giver_name[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-text">{g.giver_name}</span>
                          {isGiver && <span className="text-[10px] font-bold text-primary uppercase">You</span>}
                        </Link>

                        <div className="flex items-center gap-1 text-primary">
                          <ArrowRight size={16} strokeWidth={3} />
                        </div>

                        <Link href={`/users/${g.receiver_id}`} className="flex items-center gap-2 hover:opacity-80">
                          <div className="w-8 h-8 bg-secondary/20 border-2 border-secondary flex items-center justify-center text-xs font-black">
                            {g.receiver_name[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-text">{g.receiver_name}</span>
                          {isReceiver && <span className="text-[10px] font-bold text-primary uppercase">You</span>}
                        </Link>
                      </div>

                      {g.gift_description && (
                        <div className="mt-2 ml-10 px-3 py-1.5 bg-surface-sunken border-l-4 border-secondary">
                          <span className="text-xs text-text-muted font-medium">Gift: </span>
                          <span className="text-xs text-text font-bold">{g.gift_description}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2 ml-10">
                        <div className="flex items-center gap-1">
                          {g.giver_confirmed ? <Check size={12} className="text-success" /> : <X size={12} className="text-danger" />}
                          <span className="text-[10px] text-text-muted font-bold uppercase">Giver {g.giver_confirmed ? "confirmed" : "pending"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {g.receiver_confirmed ? <Check size={12} className="text-success" /> : <X size={12} className="text-danger" />}
                          <span className="text-[10px] text-text-muted font-bold uppercase">Receiver {g.receiver_confirmed ? "confirmed" : "pending"}</span>
                        </div>
                      </div>

                      {/* Action buttons for involved users */}
                      {isGiver && !g.giver_confirmed && (
                        <div className="mt-3 ml-10">
                          <GiftConfirmForm onConfirm={(desc) => handleConfirmGift(g.id, desc)} />
                        </div>
                      )}
                      {isReceiver && !g.receiver_confirmed && (
                        <button onClick={() => handleConfirmGift(g.id)}
                          className="mt-3 ml-10 px-4 py-2 bg-success text-text-inverse text-xs font-black uppercase border-2 border-border hover:opacity-90 transition-all">
                          Confirm Received
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CLOSED: Final Standings View OR ACTIVE: Leaderboard */}
        {((!isClosed) || (isClosed && activeTab === "standings")) && (
          <div className={`border-4 border-border ${isClosed ? "border-t-0" : ""}`}>
            {!isClosed && (
              <div className="px-5 py-4 border-b-4 border-border flex items-center gap-2 bg-surface-sunken">
                <Trophy size={16} className="text-secondary" />
                <h2 className="text-sm font-black uppercase tracking-wider text-text">Leaderboard</h2>
              </div>
            )}

            {/* Group legend for closed competitions */}
            {isClosed && leaderboard.length > 0 && (
              <div className="px-5 py-2 border-b-2 border-border flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success/20 border border-success inline-block" /> Top 50% (Givers)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-surface-sunken border border-text-muted inline-block" /> Neutral</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-secondary/20 border border-secondary inline-block" /> Bottom 50% (Receivers)</span>
              </div>
            )}

            {loading ? (
              <div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b-2 border-border">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-5 bg-border/20 animate-pulse" />
                      <div className="w-8 h-8 bg-border/20 animate-pulse" />
                      <div className="h-4 w-28 bg-border/20 animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-border/20 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-16 text-center">
                <Trophy size={28} className="text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-muted font-medium">No participants yet</p>
              </div>
            ) : (
              <div>
                {leaderboard.map((entry) => {
                  const total = leaderboard.length;
                  const half = Math.floor(total / 2);
                  const isNeutral = isClosed && total % 2 !== 0 && entry.rank === half + 1;
                  const isTop = isClosed && entry.rank <= half;
                  const isBottom = isClosed && entry.rank > half && !isNeutral;
                  const groupBg = isNeutral ? "bg-surface-sunken/50 border-l-4 border-l-text-muted" :
                    isTop ? "bg-success/5 border-l-4 border-l-success" :
                    isBottom ? "bg-secondary/5 border-l-4 border-l-secondary" : "";

                  return (
                  <div key={entry.user_id}
                    className={`flex items-center justify-between px-5 py-3 border-b-2 border-border transition-colors ${
                      user && entry.user_id === user.id ? "bg-primary/10 border-l-4 border-l-primary" : isClosed ? groupBg : "hover:bg-surface-sunken"
                    }`}>
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-8 sm:w-10 text-center text-sm shrink-0">
                        {isClosed ? <span className="text-base sm:text-lg">{getRankIcon(entry.rank)}</span> : getRank(entry.rank)}
                      </div>
                      <Link href={`/users/${entry.user_id}`} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity min-w-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 border-2 flex items-center justify-center text-xs font-black text-text shrink-0 ${
                          isClosed && entry.rank === 1 ? "bg-secondary/20 border-secondary" :
                          isClosed && entry.rank === 2 ? "bg-surface-sunken border-text-muted" :
                          isClosed && entry.rank === 3 ? "bg-primary/20 border-primary" :
                          "bg-surface-sunken border-border"
                        }`}>
                          {(entry.display_name || "?")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-text hover:text-primary transition-colors truncate block">{entry.display_name}</span>
                          <div className="flex items-center gap-1">
                            {user && entry.user_id === user.id && <span className="text-[10px] font-bold text-primary uppercase">You</span>}
                            {isNeutral && <span className="text-[10px] font-bold text-text-muted uppercase">Neutral</span>}
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className="text-sm font-black text-text font-mono">{entry.points.toLocaleString()}</div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function GiftConfirmForm({ onConfirm }: { onConfirm: (desc: string) => void }) {
  const [desc, setDesc] = useState("");
  return (
    <div className="flex gap-2">
      <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
        placeholder="What did you give?"
        className="flex-1 px-3 py-2 border-2 border-border bg-surface text-text text-xs font-medium focus:border-primary outline-none" />
      <button onClick={() => onConfirm(desc)} disabled={!desc.trim()}
        className="px-4 py-2 bg-success text-text-inverse text-xs font-black uppercase border-2 border-border hover:opacity-90 transition-all disabled:opacity-40">
        Confirm Sent
      </button>
    </div>
  );
}
