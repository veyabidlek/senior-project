"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trophy, TrendingUp, Users, ArrowRight, Gift, Star, BookOpen, Zap } from "lucide-react";

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

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-text mb-2">How It Works</h2>
          <p className="text-sm text-text-muted font-medium mb-8">From joining to winning — here&apos;s the full flow.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-4 border-border">
            <div className="p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-border">
              <div className="w-10 h-10 bg-primary flex items-center justify-center text-text-inverse font-black text-lg mb-4 border-2 border-border">1</div>
              <h3 className="text-base font-black uppercase text-text mb-2">Join a Competition</h3>
              <p className="text-xs text-text-muted font-medium">Browse active competitions and join one that interests you. Each has a start date, end date, and points per minute.</p>
            </div>
            <div className="p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-border">
              <div className="w-10 h-10 bg-secondary flex items-center justify-center text-text-inverse font-black text-lg mb-4 border-2 border-border">2</div>
              <h3 className="text-base font-black uppercase text-text mb-2">Log Your Reading</h3>
              <p className="text-xs text-text-muted font-medium">Log your daily reading minutes. Every minute earns points in active competitions. Build streaks for bonus XP.</p>
            </div>
            <div className="p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-border">
              <div className="w-10 h-10 bg-success flex items-center justify-center text-text-inverse font-black text-lg mb-4 border-2 border-border">3</div>
              <h3 className="text-base font-black uppercase text-text mb-2">Climb the Ranks</h3>
              <p className="text-xs text-text-muted font-medium">Watch your rank rise on the leaderboard. Top readers earn XP rewards and level up from Newbie to Book King.</p>
            </div>
            <div className="p-6">
              <div className="w-10 h-10 bg-text flex items-center justify-center text-text-inverse font-black text-lg mb-4 border-2 border-border">4</div>
              <h3 className="text-base font-black uppercase text-text mb-2">Win & Give Gifts</h3>
              <p className="text-xs text-text-muted font-medium">When a competition ends, top 50% are paired with bottom 50% for gift exchange. Read more, give more!</p>
            </div>
          </div>
        </div>

        {/* XP System Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-text mb-2">XP & Levels</h2>
          <p className="text-sm text-text-muted font-medium mb-8">Earn XP from competitions. Level up your profile.</p>

          <div className="grid sm:grid-cols-2 gap-0 border-4 border-border">
            <div className="p-6 border-b-2 sm:border-b-0 sm:border-r-2 border-border">
              <h3 className="text-sm font-black uppercase text-text mb-4 flex items-center gap-2"><Zap size={14} className="text-primary" /> How to Earn XP</h3>
              <div className="space-y-2">
                {[
                  ["1st Place", "+200 XP", "text-secondary"],
                  ["2nd Place", "+150 XP", "text-text-muted"],
                  ["3rd Place", "+100 XP", "text-primary"],
                  ["Top 50%", "+50 XP", "text-success"],
                  ["Participation", "+20 XP", "text-text-muted"],
                  ["Per Day Read", "+5 XP each", "text-text-muted"],
                  ["Perfect Streak", "+30 XP bonus", "text-secondary"],
                ].map(([label, xp, color]) => (
                  <div key={label} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-xs font-bold text-text">{label}</span>
                    <span className={`text-xs font-black font-mono ${color}`}>{xp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-black uppercase text-text mb-4 flex items-center gap-2"><Star size={14} className="text-secondary" /> 10 Levels</h3>
              <div className="space-y-2">
                {[
                  ["1. Newbie", "0 XP"],
                  ["2. Reader", "100 XP"],
                  ["3. Bookworm", "300 XP"],
                  ["4. Scholar", "600 XP"],
                  ["5. Sage", "1,000 XP"],
                  ["6. Expert", "1,500 XP"],
                  ["7. Master", "2,200 XP"],
                  ["8. Grandmaster", "3,000 XP"],
                  ["9. Legend", "4,000 XP"],
                  ["10. Book King", "5,500 XP"],
                ].map(([name, xp]) => (
                  <div key={name} className="flex justify-between items-center py-1 border-b border-border last:border-0">
                    <span className="text-xs font-bold text-text">{name}</span>
                    <span className="text-xs text-text-muted font-mono">{xp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link href="/faq" className="text-xs font-bold text-primary uppercase hover:underline">Read Full FAQ →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
