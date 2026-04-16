"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Plus, Calendar, Zap, Users, Check, LogIn, Trophy, Sparkles } from "lucide-react";

interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  points_per_minute: number;
  status: string;
  participants?: Array<{ user: { id: string }; points: number }>;
}

type Filter = "all" | "active" | "completed" | "upcoming";

export default function CompetitionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (authLoading) return;
    loadCompetitions();
  }, [user, authLoading]);

  const loadCompetitions = async () => {
    try {
      setLoading(true);
      const data = await api.listCompetitions();
      setCompetitions(Array.isArray(data) ? data : []);
    } catch { setCompetitions([]); }
    finally { setLoading(false); }
  };

  const handleJoin = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      setJoiningId(id);
      await api.joinCompetition(id);
      toast("Joined!", "success");
      await loadCompetitions();
    } catch { toast("Failed to join", "error"); }
    finally { setJoiningId(null); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const isJoined = (c: Competition) => c.participants?.some((p) => p.user.id === user?.id) ?? false;

  const getStatus = (c: Competition): "active" | "upcoming" | "completed" => {
    if (c.status === "closed") return "completed";
    const now = new Date();
    const start = new Date(c.start_date);
    if (start > now) return "upcoming";
    return "active";
  };

  const filteredCompetitions = competitions.filter((c) => {
    if (filter === "all") return true;
    return getStatus(c) === filter;
  });

  const counts = {
    all: competitions.length,
    active: competitions.filter((c) => getStatus(c) === "active").length,
    completed: competitions.filter((c) => getStatus(c) === "completed").length,
    upcoming: competitions.filter((c) => getStatus(c) === "upcoming").length,
  };

  const statusBadge = (c: Competition) => {
    const s = getStatus(c);
    if (s === "active") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-success text-text-inverse">Active</span>;
    if (s === "completed") return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-surface-sunken text-text-muted flex items-center gap-1"><Trophy size={10} /> Completed</span>;
    return <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-secondary text-text-inverse flex items-center gap-1"><Sparkles size={10} /> Coming Soon</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-text">Competitions</h1>
            <p className="text-sm text-text-muted font-medium mt-1">{user ? "Join or create" : "Browse active challenges"}</p>
          </div>
          {user && (
            <Link href="/create-competition" className="px-5 py-2.5 bg-text text-text-inverse font-bold uppercase tracking-wider text-xs border-2 border-border hover:bg-primary transition-all flex items-center gap-2">
              <Plus size={14} /> New
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-0 border-4 border-border mb-6">
          {(["all", "active", "upcoming", "completed"] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-1 px-3 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
                filter === f ? "bg-text text-text-inverse" : "bg-surface-sunken text-text-muted hover:bg-surface-raised"
              } ${f !== "all" ? "border-l-2 border-border" : ""}`}>
              {f} <span className="font-mono ml-1">({counts[f]})</span>
            </button>
          ))}
        </div>

        {!user && !authLoading && (
          <div className="border-4 border-primary p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-text">Want to compete?</p>
              <p className="text-xs text-text-muted">Sign in to join competitions</p>
            </div>
            <Link href="/login" className="px-4 py-2 bg-primary text-text-inverse font-bold uppercase text-xs border-2 border-border flex items-center gap-2">
              <LogIn size={12} /> Sign In
            </Link>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-lg font-bold uppercase animate-pulse">Loading...</div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="text-center py-20 border-4 border-border">
            <div className="text-5xl font-black text-text-muted mb-4">0</div>
            <p className="text-sm text-text-muted font-medium mb-4">No {filter !== "all" ? filter : ""} competitions</p>
            {user && filter === "all" && <Link href="/create-competition" className="inline-flex items-center gap-2 px-5 py-2.5 bg-text text-text-inverse font-bold uppercase text-xs border-2 border-border"><Plus size={14} /> Create One</Link>}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-border">
            {filteredCompetitions.map((c, i) => {
              const status = getStatus(c);
              return (
                <Link key={c.id} href={`/competitions/${c.id}`}
                  className={`group p-5 border-b-2 border-r-2 border-border hover:bg-surface-sunken transition-all ${i % 3 === 2 ? 'border-r-0 lg:border-r-2' : ''}`}>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-base font-black uppercase tracking-tight text-text group-hover:text-primary transition-colors">{c.name}</h3>
                    {statusBadge(c)}
                  </div>
                  <div className="space-y-1.5 text-xs text-text-muted font-medium mb-4">
                    <div className="flex items-center gap-2"><Calendar size={12} />{formatDate(c.start_date)} — {formatDate(c.end_date)}</div>
                    <div className="flex items-center gap-2"><Zap size={12} />{c.points_per_minute} pts/min</div>
                    {c.participants && <div className="flex items-center gap-2"><Users size={12} />{c.participants.length} participants</div>}
                  </div>
                  <div className="pt-3 border-t-2 border-border">
                    {status === "completed" ? (
                      <span className="text-xs font-bold text-text-muted uppercase flex items-center gap-1"><Trophy size={12} /> View Results</span>
                    ) : status === "upcoming" ? (
                      <span className="text-xs font-bold text-secondary uppercase flex items-center gap-1"><Sparkles size={12} /> Join Early</span>
                    ) : !user ? (
                      <span className="text-xs font-bold text-primary uppercase">Sign in to join</span>
                    ) : isJoined(c) ? (
                      <div className="text-xs font-bold text-success flex items-center gap-1"><Check size={12} /> Joined</div>
                    ) : (
                      <button onClick={(e) => handleJoin(c.id, e)} disabled={joiningId === c.id}
                        className="text-xs font-bold text-primary uppercase hover:underline disabled:opacity-40">
                        {joiningId === c.id ? "Joining..." : "Join →"}
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
