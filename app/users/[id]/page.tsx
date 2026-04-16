"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { BookOpen, Clock, Flame, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  display_name: string;
  streak_current: number;
  total_minutes: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getUserProfile(userId);
      setProfile(data);
    } catch {
      toast("User not found", "error");
    } finally {
      setLoading(false);
    }
  };

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
          <Link href="/competitions" className="text-xs font-bold text-primary uppercase hover:underline">
            Back to competitions
          </Link>
        </div>
      </div>
    );
  }

  const totalMinutes = profile.total_minutes || 0;
  const streak = profile.streak_current || 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        <Link href="/competitions" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-text border-b-2 border-transparent hover:border-border transition-all mb-6">
          <ArrowLeft size={12} /> Back
        </Link>

        <div className="bg-surface-raised rounded-2xl border border-border p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-3xl font-bold text-text mx-auto mb-4">
            {profile.display_name[0].toUpperCase()}
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">
            {profile.display_name}
          </h1>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-4 border-2 border-border rounded-lg">
              <Clock size={16} className="text-text-muted mx-auto mb-1" />
              <div className="text-lg font-bold text-text">
                {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
              </div>
              <div className="text-[10px] text-text-muted uppercase font-bold">Total Reading</div>
            </div>
            <div className="p-4 border-2 border-border rounded-lg">
              <Flame size={16} className="text-text-muted mx-auto mb-1" />
              <div className="text-lg font-bold text-text">{streak}</div>
              <div className="text-[10px] text-text-muted uppercase font-bold">Day Streak</div>
            </div>
            <div className="p-4 border-2 border-border rounded-lg">
              <BookOpen size={16} className="text-text-muted mx-auto mb-1" />
              <div className="text-lg font-bold text-text">
                {Math.floor(totalMinutes / 60)}
              </div>
              <div className="text-[10px] text-text-muted uppercase font-bold">Hours Read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
