"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Badges from "@/components/Badges";
import { api } from "@/lib/api";
import { BookOpen, Clock, Flame, Trophy, Calendar, Mail } from "lucide-react";

interface Competition {
  id: string;
  name: string;
  status: string;
  end_date: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
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

  if (!user) return null;

  const totalMinutes = user.total_minutes || 0;
  const streak = user.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const memberSince = "2026";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        {/* Profile header */}
        <div className="bg-surface-raised rounded-2xl border border-border p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-text mx-auto mb-4">
            {user.display_name[0].toUpperCase()}
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">
            {user.display_name}
          </h1>
          <div className="flex items-center justify-center gap-1.5 text-sm text-text-muted mt-1">
            <Mail size={12} />
            {user.email}
          </div>
          <div className="text-xs text-text-muted mt-1">
            Member since {memberSince}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div>
              <div className="text-lg font-bold text-text">
                {hours > 0 ? `${hours}h` : `${mins}m`}
              </div>
              <div className="text-[10px] text-text-muted">Reading</div>
            </div>
            <div>
              <div className="text-lg font-bold text-text">{streak}</div>
              <div className="text-[10px] text-text-muted">Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-text">
                {competitions.length}
              </div>
              <div className="text-[10px] text-text-muted">Competitions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-text">
                {competitions.filter((c) => c.status === "closed").length}
              </div>
              <div className="text-[10px] text-text-muted">Completed</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <Badges
            totalMinutes={totalMinutes}
            streak={streak}
            competitionsJoined={competitions.length}
          />
        </div>

        {/* Competition history */}
        <div className="bg-surface-raised rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-text">Competition History</h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : competitions.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted">
              No competitions yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {competitions.map((comp) => (
                <div key={comp.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy size={14} className="text-text-muted shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-text">{comp.name}</div>
                      <div className="text-xs text-text-muted flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(comp.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                    comp.status === "active" || comp.status === "open"
                      ? "bg-success/10 text-success"
                      : "bg-surface-sunken text-text-muted"
                  }`}>
                    {comp.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
