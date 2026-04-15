"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Trophy, TrendingUp, Users, BookOpen, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero - Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-16">
          {/* Main hero card - spans 2 cols */}
          <div className="sm:col-span-2 bg-surface-raised rounded-2xl p-6 sm:p-8 lg:p-10 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-secondary" />
              <span className="text-sm text-text-muted font-medium">
                Reading competition platform
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight tracking-tight">
              Where every page
              <br />
              is a new <span className="text-secondary italic">Adventure</span>
            </h1>
            <p className="text-base text-text-muted mb-8 max-w-lg leading-relaxed">
              Join reading competitions, track your progress, and climb the
              leaderboard as you explore new literary worlds.
            </p>

            {!user ? (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-surface-sunken text-text border border-border rounded-xl hover:bg-border transition-colors font-medium text-sm"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/competitions"
                  className="px-6 py-3 bg-surface-sunken text-text border border-border rounded-xl hover:bg-border transition-colors font-medium text-sm"
                >
                  Browse Competitions
                </Link>
              </div>
            )}
          </div>

          {/* Stats card */}
          <div className="bg-primary/40 rounded-2xl p-6 sm:p-8 border border-primary/60 flex flex-col justify-between">
            <div className="w-10 h-10 bg-surface-raised rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Trophy size={20} className="text-warning" />
            </div>
            <div>
              <div className="text-3xl font-bold text-text mb-1 tracking-tight">Compete</div>
              <p className="text-sm text-text-muted leading-relaxed">
                Join competitions and climb the leaderboard by reading more
              </p>
            </div>
          </div>

          {/* Feature card - Track */}
          <div className="bg-secondary/10 rounded-2xl p-6 sm:p-8 border border-secondary/20">
            <div className="w-10 h-10 bg-surface-raised rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp size={20} className="text-secondary" />
            </div>
            <div className="text-xl font-bold text-text mb-2 tracking-tight">
              Track Progress
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Monitor your reading time and points earned in real-time
            </p>
          </div>

          {/* Feature card - Community */}
          <div className="bg-success/5 rounded-2xl p-6 sm:p-8 border border-success/15">
            <div className="w-10 h-10 bg-surface-raised rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Users size={20} className="text-success" />
            </div>
            <div className="text-xl font-bold text-text mb-2 tracking-tight">
              Community
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Connect with other readers and share your love for books
            </p>
          </div>

          {/* CTA card */}
          <div className="bg-surface-overlay rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="text-sm text-text-inverse/60 font-medium mb-4">
              Ready to start?
            </div>
            <div>
              <div className="text-xl font-bold text-text-inverse mb-3 tracking-tight">
                Log your reading
                <br />
                time today
              </div>
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Go to dashboard
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Create an account
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
