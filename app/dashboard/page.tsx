"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import {
  BookOpen,
  Clock,
  Flame,
  Trophy,
  Calendar,
  ArrowRight,
} from "lucide-react";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myCompetitions, setMyCompetitions] = useState<Competition[]>([]);
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
      setLoading(true);
      const comps = await api.getMyCompetitions();
      setMyCompetitions(Array.isArray(comps) ? comps : []);
    } catch {
      setMyCompetitions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const totalMinutes = user.total_minutes || 0;
  const streak = user.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const activeComps = myCompetitions.filter((c) => c.status === "active");

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Welcome back, {user.display_name}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Here&apos;s your reading overview
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {/* Total Reading Time */}
          <div className="bg-surface-raised rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-secondary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
            </div>
            <div className="text-xs text-text-muted mt-1">Total Reading</div>
          </div>

          {/* Current Streak */}
          <div className="bg-surface-raised rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                <Flame size={16} className="text-warning" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {streak} {streak === 1 ? "day" : "days"}
            </div>
            <div className="text-xs text-text-muted mt-1">Current Streak</div>
          </div>

          {/* Active Competitions */}
          <div className="bg-surface-raised rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Trophy size={16} className="text-success" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {activeComps.length}
            </div>
            <div className="text-xs text-text-muted mt-1">Active Competitions</div>
          </div>

          {/* Total Competitions */}
          <div className="bg-surface-raised rounded-2xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-text" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text tracking-tight">
              {myCompetitions.length}
            </div>
            <div className="text-xs text-text-muted mt-1">All Competitions</div>
          </div>
        </div>

        {/* My Competitions */}
        <div className="bg-surface-raised rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">
              My Competitions
            </h2>
            <Link
              href="/competitions"
              className="text-xs font-medium text-secondary hover:text-secondary/80 flex items-center gap-1"
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myCompetitions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 bg-surface-sunken rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trophy size={24} className="text-text-muted" />
              </div>
              <p className="text-sm text-text-muted mb-3">
                You haven&apos;t joined any competitions yet
              </p>
              <Link
                href="/competitions"
                className="text-sm font-medium text-secondary hover:underline"
              >
                Browse competitions
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {myCompetitions.slice(0, 5).map((comp) => (
                <Link
                  key={comp.id}
                  href={`/competitions/${comp.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-sunken transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        comp.status === "active"
                          ? "bg-success"
                          : comp.status === "upcoming"
                          ? "bg-secondary"
                          : "bg-text-muted"
                      }`}
                    />
                    <div>
                      <div className="text-sm font-medium text-text">
                        {comp.name}
                      </div>
                      <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {new Date(comp.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        <span className="mx-1">&middot;</span>
                        {comp.points_per_minute} pts/min
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                      comp.status === "active"
                        ? "bg-success/10 text-success"
                        : comp.status === "upcoming"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-surface-sunken text-text-muted"
                    }`}
                  >
                    {comp.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
