"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Badges from "@/components/Badges";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Clock, Flame, Trophy, Calendar, Mail, Star, Send, Check } from "lucide-react";
import Link from "next/link";
import { LEVELS } from "@/lib/types";

interface Competition {
  id: string;
  name: string;
  status: string;
  end_date: string;
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTg, setEditingTg] = useState(false);
  const [tgHandle, setTgHandle] = useState("");
  const [savingTg, setSavingTg] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setTgHandle(user.telegram_handle || "");
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const comps = await api.getMyCompetitions().catch(() => []);
      setCompetitions(Array.isArray(comps) ? comps : []);
    } finally {
      setLoading(false);
    }
  };

  const saveTelegram = async () => {
    setSavingTg(true);
    try {
      await api.updateProfile({ telegram_handle: tgHandle });
      toast("Telegram updated!", "success");
      setEditingTg(false);
      refreshUser();
    } catch { toast("Failed to update", "error"); }
    finally { setSavingTg(false); }
  };

  if (!user) return null;

  const totalMinutes = user.total_minutes || 0;
  const streak = user.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const xp = user.xp || 0;
  const level = user.level || 1;
  const levelName = user.level_name || "Newbie";
  const nextLevel = LEVELS[level] || null;
  const currentLevelXP = LEVELS[level - 1]?.xp || 0;
  const xpProgress = nextLevel ? ((xp - currentLevelXP) / (nextLevel.xp - currentLevelXP)) * 100 : 100;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        {/* Profile header */}
        <div className="border-4 border-border p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary flex items-center justify-center text-2xl font-black text-text-inverse border-2 border-border">
              {user.display_name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-text tracking-tight">{user.display_name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-secondary text-text-inverse text-[10px] font-black uppercase">Lvl {level}</span>
                <span className="text-xs font-bold text-text-muted">{levelName}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted font-medium">
                <Mail size={10} /> {user.email}
              </div>

              {/* Telegram */}
              <div className="flex items-center gap-2 mt-1">
                <Send size={10} className="text-text-muted" />
                {editingTg ? (
                  <div className="flex items-center gap-1">
                    <input type="text" value={tgHandle} onChange={(e) => setTgHandle(e.target.value)}
                      placeholder="@username"
                      className="px-2 py-0.5 border-2 border-border bg-surface text-text text-xs font-medium focus:border-primary outline-none w-32" />
                    <button onClick={saveTelegram} disabled={savingTg}
                      className="p-1 bg-success text-text-inverse border border-border"><Check size={10} /></button>
                    <button onClick={() => { setEditingTg(false); setTgHandle(user.telegram_handle || ""); }}
                      className="text-xs text-text-muted hover:text-text">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingTg(true)} className="text-xs text-text-muted font-medium hover:text-primary">
                    {user.telegram_handle || "Set Telegram handle"}
                  </button>
                )}
              </div>
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
              <Star size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{competitions.length}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Comps</div>
            </div>
            <div className="p-3 text-center">
              <Trophy size={14} className="text-text-muted mx-auto mb-1" />
              <div className="text-sm font-black text-text">{competitions.filter((c) => c.status === "closed").length}</div>
              <div className="text-[10px] text-text-muted font-bold uppercase">Completed</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <Badges totalMinutes={totalMinutes} streak={streak} competitionsJoined={competitions.length} />
        </div>

        {/* Competition history */}
        <div className="border-4 border-border">
          <div className="px-5 py-4 border-b-4 border-border bg-surface-sunken flex items-center gap-2">
            <Trophy size={14} className="text-secondary" />
            <h3 className="text-sm font-black uppercase tracking-wider text-text">Competition History</h3>
          </div>
          {loading ? (
            <div className="text-center py-8 text-sm font-bold uppercase animate-pulse">Loading...</div>
          ) : competitions.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted font-medium">No competitions yet</div>
          ) : (
            <div>
              {competitions.map((comp) => (
                <Link key={comp.id} href={`/competitions/${comp.id}`}
                  className="flex items-center justify-between px-5 py-3 border-b-2 border-border hover:bg-surface-sunken transition-colors">
                  <div className="flex items-center gap-3">
                    <Trophy size={14} className="text-text-muted shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-text">{comp.name}</div>
                      <div className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(comp.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                    comp.status === "active" || comp.status === "open" ? "bg-success text-text-inverse" : "bg-surface-sunken text-text-muted"
                  }`}>{comp.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
