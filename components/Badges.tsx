"use client";

import { Trophy, Flame, BookOpen, Star, Award, Zap, Crown, Target, Clock, Heart, Sparkles, Sun, Moon as MoonIcon, Mountain, Rocket, Shield, Coffee, Compass, Gem, Globe, Layers, Lightbulb, Map, Palette, Sword } from "lucide-react";

interface BadgesProps {
  totalMinutes: number;
  streak: number;
  competitionsJoined: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  color: string;
}

export default function Badges({ totalMinutes, streak, competitionsJoined }: BadgesProps) {
  const badges: Badge[] = [
    // Reading milestones
    { id: "first-read", name: "First Read", description: "Log your first reading session", icon: <BookOpen size={14} />, unlocked: totalMinutes > 0, color: "text-secondary" },
    { id: "hour-reader", name: "Hour Reader", description: "Read for 60 minutes total", icon: <Clock size={14} />, unlocked: totalMinutes >= 60, color: "text-warning" },
    { id: "bookworm", name: "Bookworm", description: "Read for 500 minutes total", icon: <Award size={14} />, unlocked: totalMinutes >= 500, color: "text-success" },
    { id: "scholar", name: "Scholar", description: "Read for 1,000 minutes total", icon: <Lightbulb size={14} />, unlocked: totalMinutes >= 1000, color: "text-secondary" },
    { id: "sage", name: "Sage", description: "Read for 2,500 minutes", icon: <Compass size={14} />, unlocked: totalMinutes >= 2500, color: "text-warning" },
    { id: "legend", name: "Legend", description: "Read for 5,000 minutes", icon: <Crown size={14} />, unlocked: totalMinutes >= 5000, color: "text-danger" },
    { id: "transcendent", name: "Transcendent", description: "Read for 10,000 minutes", icon: <Sparkles size={14} />, unlocked: totalMinutes >= 10000, color: "text-secondary" },

    // Streak milestones
    { id: "streak-3", name: "On Fire", description: "3-day reading streak", icon: <Flame size={14} />, unlocked: streak >= 3, color: "text-danger" },
    { id: "streak-7", name: "Week Warrior", description: "7-day reading streak", icon: <Flame size={14} />, unlocked: streak >= 7, color: "text-warning" },
    { id: "streak-14", name: "Fortnight Focus", description: "14-day reading streak", icon: <Shield size={14} />, unlocked: streak >= 14, color: "text-secondary" },
    { id: "streak-30", name: "Monthly Master", description: "30-day reading streak", icon: <Zap size={14} />, unlocked: streak >= 30, color: "text-success" },
    { id: "streak-60", name: "Iron Will", description: "60-day reading streak", icon: <Mountain size={14} />, unlocked: streak >= 60, color: "text-warning" },
    { id: "streak-100", name: "Centurion", description: "100-day reading streak", icon: <Sword size={14} />, unlocked: streak >= 100, color: "text-danger" },
    { id: "streak-365", name: "Year Reader", description: "365-day reading streak", icon: <Globe size={14} />, unlocked: streak >= 365, color: "text-secondary" },

    // Competition milestones
    { id: "competitor", name: "Competitor", description: "Join your first competition", icon: <Trophy size={14} />, unlocked: competitionsJoined >= 1, color: "text-warning" },
    { id: "veteran", name: "Veteran", description: "Join 3 competitions", icon: <Star size={14} />, unlocked: competitionsJoined >= 3, color: "text-secondary" },
    { id: "champion", name: "Champion", description: "Join 5 competitions", icon: <Trophy size={14} />, unlocked: competitionsJoined >= 5, color: "text-success" },
    { id: "gladiator", name: "Gladiator", description: "Join 10 competitions", icon: <Sword size={14} />, unlocked: competitionsJoined >= 10, color: "text-danger" },

    // Special / fun badges
    { id: "early-bird", name: "Early Bird", description: "Read before 8 AM", icon: <Sun size={14} />, unlocked: false, color: "text-warning" },
    { id: "night-owl", name: "Night Owl", description: "Read after 10 PM", icon: <MoonIcon size={14} />, unlocked: false, color: "text-secondary" },
    { id: "speed-reader", name: "Speed Reader", description: "Log 120+ min in one session", icon: <Rocket size={14} />, unlocked: false, color: "text-danger" },
    { id: "consistent", name: "Consistent", description: "Read same time 5 days in a row", icon: <Target size={14} />, unlocked: false, color: "text-success" },
    { id: "explorer", name: "Explorer", description: "Track 5 different books", icon: <Map size={14} />, unlocked: false, color: "text-secondary" },
    { id: "collector", name: "Collector", description: "Finish 3 books", icon: <Layers size={14} />, unlocked: false, color: "text-warning" },
    { id: "coffee-reader", name: "Coffee & Books", description: "Log reading 7 mornings", icon: <Coffee size={14} />, unlocked: false, color: "text-primary" },
    { id: "gem", name: "Hidden Gem", description: "Read for exactly 42 minutes", icon: <Gem size={14} />, unlocked: totalMinutes >= 42 && totalMinutes <= 42, color: "text-secondary" },
    { id: "palette", name: "Diverse Reader", description: "Use all reading sources", icon: <Palette size={14} />, unlocked: false, color: "text-danger" },
    { id: "heart", name: "Book Lover", description: "Read every day for a week", icon: <Heart size={14} />, unlocked: streak >= 7, color: "text-danger" },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-surface-raised p-5 border-4 border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-text">Badges</h3>
        <span className="text-xs text-text-muted">
          {unlockedCount}/{badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-1.5 rounded-xl text-center transition-all ${
              badge.unlocked ? "bg-surface-sunken" : "opacity-25"
            }`}
            title={`${badge.name}: ${badge.description}`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 ${
                badge.unlocked ? badge.color : "text-text-muted"
              } ${badge.unlocked ? "bg-surface-raised shadow-sm" : ""}`}
            >
              {badge.icon}
            </div>
            <span className="text-[8px] font-medium text-text leading-tight truncate w-full">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
