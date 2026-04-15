"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, TrendingUp, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-black uppercase tracking-wider animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-20 flex-1">
        {/* Hero Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-border mb-16">
          {/* Main hero */}
          <div className="sm:col-span-2 p-8 sm:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-border">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted mb-6">Reading Platform</div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.9] text-text mb-6 tracking-tighter">
              Read.<br />Compete.<br />
              <span className="text-primary">Win.</span>
            </h1>
            <p className="text-lg text-text-muted mb-8 max-w-md font-medium leading-relaxed">
              Track your reading. Join competitions. Climb leaderboards. Build the habit.
            </p>
            {!user ? (
              <div className="flex flex-wrap gap-0">
                <Link href="/register" className="px-8 py-4 bg-text text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all flex items-center gap-2">
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link href="/competitions" className="px-8 py-4 bg-surface text-text font-bold uppercase tracking-wider text-sm border-2 border-border hover:bg-surface-sunken transition-all">
                  Browse
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-0">
                <Link href="/dashboard" className="px-8 py-4 bg-primary text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-secondary transition-all flex items-center gap-2">
                  Dashboard <ArrowRight size={16} />
                </Link>
                <Link href="/competitions" className="px-8 py-4 bg-surface text-text font-bold uppercase tracking-wider text-sm border-2 border-border hover:bg-surface-sunken transition-all">
                  Competitions
                </Link>
              </div>
            )}
          </div>

          {/* Stats column */}
          <div className="flex flex-col">
            <div className="p-6 sm:p-8 border-b-4 border-border flex-1">
              <Trophy size={28} className="text-secondary mb-4" />
              <div className="text-3xl font-black uppercase tracking-tight text-text mb-1">Compete</div>
              <p className="text-sm text-text-muted font-medium">Join competitions. Beat the leaderboard.</p>
            </div>
            <div className="p-6 sm:p-8 border-b-4 border-border flex-1">
              <TrendingUp size={28} className="text-primary mb-4" />
              <div className="text-3xl font-black uppercase tracking-tight text-text mb-1">Track</div>
              <p className="text-sm text-text-muted font-medium">Daily streaks. Reading goals. Analytics.</p>
            </div>
            <div className="p-6 sm:p-8 flex-1 bg-text text-text-inverse">
              <Users size={28} className="text-secondary mb-4" />
              <div className="text-3xl font-black uppercase tracking-tight mb-1">Community</div>
              <p className="text-sm opacity-70 font-medium">200+ readers. Live activity feed.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
