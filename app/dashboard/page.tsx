"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StreakCalendar from "@/components/StreakCalendar";
import ReadingGoal from "@/components/ReadingGoal";
import Badges from "@/components/Badges";
import ReadingInsights from "@/components/ReadingInsights";
import { api } from "@/lib/api";
import { Clock, Flame, Trophy, BookOpen, Calendar, ArrowRight } from "lucide-react";

interface Competition { id: string; name: string; start_date: string; end_date: string; points_per_minute: number; status: string; }
interface ReadingEntry { id: string; minutes: number; source: string; timestamp: string; }

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);
  const [readings, setReadings] = useState<ReadingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comps, readingData] = await Promise.all([
        api.getMyCompetitions().catch(() => []),
        api.getReadingHistory().catch(() => []),
      ]);
      setMyCompetitions(Array.isArray(comps) ? comps : []);
      setReadings(Array.isArray(readingData) ? readingData : []);
    } finally { setLoading(false); }
  };

  if (!user) return null;

  const totalMinutes = user.total_minutes || 0;
  const streak = user.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const activeComps = myCompetitions.filter((c) => c.status === "active" || c.status === "open");
  const today = new Date().toISOString().slice(0, 10);
  const todayMinutes = readings.filter((r) => r.timestamp.slice(0, 10) === today).reduce((s, r) => s + r.minutes, 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <div className="mb-8 border-b-4 border-border pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-text">
            {user.display_name}
          </h1>
          <p className="text-sm text-text-muted font-medium mt-1">Your reading overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 border-4 border-border mb-6">
          {[
            { icon: <Clock size={18} />, value: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`, label: "Total Reading" },
            { icon: <Flame size={18} />, value: `${streak}d`, label: "Streak" },
            { icon: <Trophy size={18} />, value: activeComps.length, label: "Active" },
            { icon: <BookOpen size={18} />, value: readings.length, label: "Sessions" },
          ].map((stat, i) => (
            <div key={i} className={`p-5 text-center ${i < 3 ? "border-r-2 border-border" : ""} ${i < 2 ? "border-b-2 sm:border-b-0 border-border" : ""}`}>
              <div className="text-text-muted mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-text font-mono">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Goal + Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <ReadingGoal todayMinutes={todayMinutes} />
          <div className="lg:col-span-2"><StreakCalendar readings={readings} /></div>
        </div>

        {/* Insights + Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ReadingInsights readings={readings} totalMinutes={totalMinutes} />
          <Badges totalMinutes={totalMinutes} streak={streak} competitionsJoined={myCompetitions.length} />
        </div>

        {/* Competitions */}
        <div className="border-4 border-border">
          <div className="px-5 py-4 border-b-4 border-border flex items-center justify-between bg-surface-sunken">
            <h3 className="text-sm font-black uppercase tracking-wider text-text">My Competitions</h3>
            <Link href="/competitions" className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 hover:underline">
              All <ArrowRight size={10} />
            </Link>
          </div>
          {loading ? (
            <div className="py-8 text-center text-sm font-bold uppercase animate-pulse">Loading...</div>
          ) : myCompetitions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-text-muted mb-2">No competitions yet</p>
              <Link href="/competitions" className="text-xs font-bold text-primary uppercase hover:underline">Browse</Link>
            </div>
          ) : (
            <div>
              {myCompetitions.slice(0, 5).map((comp) => (
                <Link key={comp.id} href={`/competitions/${comp.id}`}
                  className="flex items-center justify-between px-5 py-3 border-b-2 border-border hover:bg-surface-sunken transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 border-2 border-border ${comp.status === "active" || comp.status === "open" ? "bg-success" : "bg-surface-sunken"}`} />
                    <div>
                      <div className="text-sm font-bold text-text uppercase">{comp.name}</div>
                      <div className="text-xs text-text-muted font-mono flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />{new Date(comp.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${comp.status === "active" || comp.status === "open" ? "bg-success text-text-inverse" : "bg-surface-sunken text-text-muted"}`}>{comp.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
