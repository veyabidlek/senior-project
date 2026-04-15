"use client";

import { Trophy, Flame, BookOpen, Star, Award, Zap } from "lucide-react";

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
    {
      id: "first-read",
      name: "First Read",
      description: "Log your first reading session",
      icon: <BookOpen size={16} />,
      unlocked: totalMinutes > 0,
      color: "text-secondary",
    },
    {
      id: "hour-reader",
      name: "Hour Reader",
      description: "Read for 60 minutes total",
      icon: <Star size={16} />,
      unlocked: totalMinutes >= 60,
      color: "text-warning",
    },
    {
      id: "bookworm",
      name: "Bookworm",
      description: "Read for 500 minutes total",
      icon: <Award size={16} />,
      unlocked: totalMinutes >= 500,
      color: "text-success",
    },
    {
      id: "streak-3",
      name: "On Fire",
      description: "Maintain a 3-day streak",
      icon: <Flame size={16} />,
      unlocked: streak >= 3,
      color: "text-danger",
    },
    {
      id: "streak-7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: <Flame size={16} />,
      unlocked: streak >= 7,
      color: "text-warning",
    },
    {
      id: "streak-30",
      name: "Monthly Master",
      description: "Maintain a 30-day streak",
      icon: <Zap size={16} />,
      unlocked: streak >= 30,
      color: "text-secondary",
    },
    {
      id: "competitor",
      name: "Competitor",
      description: "Join your first competition",
      icon: <Trophy size={16} />,
      unlocked: competitionsJoined >= 1,
      color: "text-warning",
    },
    {
      id: "champion",
      name: "Champion",
      description: "Join 5 competitions",
      icon: <Trophy size={16} />,
      unlocked: competitionsJoined >= 5,
      color: "text-success",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Badges</h3>
        <span className="text-xs text-text-muted">
          {unlockedCount}/{badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-2 rounded-xl text-center transition-all ${
              badge.unlocked
                ? "bg-surface-sunken"
                : "opacity-30"
            }`}
            title={`${badge.name}: ${badge.description}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                badge.unlocked ? badge.color : "text-text-muted"
              } ${badge.unlocked ? "bg-surface-raised shadow-sm" : ""}`}
            >
              {badge.icon}
            </div>
            <span className="text-[10px] font-medium text-text leading-tight">
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
