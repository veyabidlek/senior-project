"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useUserProfile, useCompetitions } from "@/lib/hooks";
import { Clock, Flame, ArrowLeft, Trophy, Star, Send } from "lucide-react";
import Link from "next/link";
import { LEVELS } from "@/lib/types";
import type { Competition } from "@/lib/types";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { data: profile, isLoading: profileLoading } = useUserProfile(userId);
  const { data: allComps = [], isLoading: compsLoading } = useCompetitions();
  const loading = profileLoading || compsLoading;

  const competitions = useMemo(() =>
    (allComps as Competition[]).filter((c: Competition) =>
      c.participants?.some((p) => p.user.id === userId)
    ), [allComps, userId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-20 text-lg font-bold uppercase animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-10 text-center">
          <div className="text-5xl font-black text-text-muted mb-4">404</div>
          <p className="text-sm text-text-muted font-medium mb-4">User not found</p>
          <Link href="/competitions" className="text-xs font-bold text-primary uppercase hover:underline">Back to competitions</Link>
        </div>
      </div>
    );
  }

  const totalMinutes = profile.total_minutes || 0;
  const streak = profile.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const xp = profile.xp || 0;
  const level = profile.level || 1;
  const levelName = profile.level_name || "Newbie";
  const nextLevel = LEVELS[level] || null;
  const currentLevelXP = LEVELS[level - 1]?.xp || 0;
  const xpProgress = nextLevel ? ((xp - currentLevelXP) / (nextLevel.xp - currentLevelXP)) * 100 : 100;

  // Count wins (1st place in closed competitions)
  const wins = competitions.filter((c) => {
    if (c.status !== "closed" || !c.participants) return false;
    const sorted = [...c.participants].sort((a, b) => b.points - a.points);
    return sorted[0]?.user.id === userId;
  }).length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        <Link href="/competitions" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text border-b-2 border-transparent hover:border-border transition-all mb-6">
          <ArrowLeft size={12} /> Back
        </Link>

        {/* Profile header */}
        <div className="border-4 border-border p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary flex items-center justify-center text-2xl font-black text-text-inverse border-2 border-border">
              {profile.display_name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-text tracking-tight">{profile.display_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-secondary text-text-inverse text-[10px] font-black uppercase">Lvl {level}</span>
                <span className="text-xs font-bold text-text-muted">{levelName}</span>
              </div>
              {profile.telegram_handle && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted font-medium">
                  <Send size={10} /> {profile.telegram_handle}
                </div>
              )}
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold uppercase text-text-muted mb-1">
              <span>{xp.toLocaleString()} XP</span>
              <span>{nextLevel ? `${nextLevel.xp.toLocaleString()} XP to ${nextLevel.name}` : "Max Level"}</span>
            </div>
            <div className="h-3 bg-surface-sunken border-2 border-border">
              <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(xpProgress, 100)}%` }} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-0 mt-4 border-2 border-border">
            <div className="p-3 text-center border-r-2 border-border">
              <Clock size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{hours > 0 ? `${hours}h` : `${mins}m`}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Reading</div>
            </div>
            <div className="p-3 text-center border-r-2 border-border">
              <Flame size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{streak}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Streak</div>
            </div>
            <div className="p-3 text-center border-r-2 border-border">
              <Trophy size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{wins}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Wins</div>
            </div>
            <div className="p-3 text-center">
              <Star size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{competitions.length}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Comps</div>
            </div>
          </div>
        </div>

        {/* Competition History */}
        <div className="border-4 border-border">
          <div className="px-5 py-4 border-b-4 border-border bg-surface-sunken flex items-center gap-2">
            <Trophy size={14} className="text-secondary" />
            <h2 className="text-sm font-black uppercase tracking-wider text-text">Competition History</h2>
          </div>
          {competitions.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted font-medium">No competitions yet</div>
          ) : (
            <div>
              {competitions.map((c) => {
                const participant = c.participants?.find((p) => p.user.id === userId);
                const sorted = c.participants ? [...c.participants].sort((a, b) => b.points - a.points) : [];
                const rank = sorted.findIndex((p) => p.user.id === userId) + 1;
                const isWinner = rank === 1 && c.status === "closed";

                return (
                  <Link key={c.id} href={`/competitions/${c.id}`}
                    className="flex items-center justify-between px-5 py-3 border-b-2 border-border hover:bg-surface-sunken transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{isWinner ? "🥇" : rank <= 3 && c.status === "closed" ? (rank === 2 ? "🥈" : "🥉") : "📖"}</span>
                      <div>
                        <div className="text-sm font-bold text-text">{c.name}</div>
                        <div className="text-xs text-text-muted font-medium">
                          {c.status === "closed" ? `Rank #${rank}` : "Active"} · {participant?.points?.toLocaleString() || 0} pts · {participant?.days_read || 0} days
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${c.status === "closed" ? "bg-surface-sunken text-text-muted" : "bg-success text-text-inverse"}`}>
                      {c.status === "closed" ? "Done" : c.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
