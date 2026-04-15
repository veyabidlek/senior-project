"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { BookOpen, Clock, Flame, Users, Sparkles } from "lucide-react";

interface ActivityEntry {
  id: string;
  user_name: string;
  minutes: number;
  timestamp: string;
  type: "reading" | "join" | "competition";
}

export default function ActivityFeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    generateActivities();
    const interval = setInterval(addNewActivity, 5000);
    return () => clearInterval(interval);
  }, [user, router]);

  const generateActivities = async () => {
    // Fetch real reading history and create activity entries
    try {
      const history = await api.getReadingHistory();
      const entries: ActivityEntry[] = (Array.isArray(history) ? history : [])
        .slice(0, 20)
        .map((r: { id: string; minutes: number; timestamp: string }) => ({
          id: r.id,
          user_name: user?.display_name || "You",
          minutes: r.minutes,
          timestamp: r.timestamp,
          type: "reading" as const,
        }));

      // Add simulated community activity
      const names = [
        "Aisha Khan", "Marcus Chen", "Sofia Rodriguez", "Emma Wilson",
        "Daniel Kim", "Lucas Meyer", "Priya Sharma", "Mei Lin",
        "Lena Fischer", "Omar Hassan", "Anna Kowalski", "Leo Thompson",
      ];

      const now = Date.now();
      for (let i = 0; i < 15; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const mins = [10, 15, 20, 25, 30, 45, 60][Math.floor(Math.random() * 7)];
        entries.push({
          id: `sim-${i}`,
          user_name: name,
          minutes: mins,
          timestamp: new Date(now - i * 180000 - Math.random() * 60000).toISOString(),
          type: "reading",
        });
      }

      entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(entries.slice(0, 30));
      setLiveCount(Math.floor(Math.random() * 5) + 8);
    } catch {
      setActivities([]);
    }
  };

  const addNewActivity = () => {
    const names = [
      "Yuki Tanaka", "Raj Patel", "Noah Anderson", "Alexander Volkov",
      "Ethan Park", "Zara Ahmed", "Chloe Martin", "David Nguyen",
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const mins = [5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)];

    const newEntry: ActivityEntry = {
      id: `live-${Date.now()}`,
      user_name: name,
      minutes: mins,
      timestamp: new Date().toISOString(),
      type: "reading",
    };

    setActivities((prev) => [newEntry, ...prev.slice(0, 29)]);
    setLiveCount((prev) => {
      const delta = Math.random() > 0.5 ? 1 : -1;
      return Math.max(3, Math.min(20, prev + delta));
    });
  };

  if (!user) return null;

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight flex items-center gap-2">
              <Sparkles size={20} className="text-warning" />
              Live Activity
            </h1>
            <p className="text-sm text-text-muted mt-1">
              See what the community is reading right now
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">
              {liveCount} reading now
            </span>
          </div>
        </div>

        {/* Live feed */}
        <div ref={containerRef} className="space-y-2">
          {activities.map((activity, i) => (
            <div
              key={activity.id}
              className="bg-surface-raised rounded-xl border border-border p-4 flex items-center gap-4 transition-all hover:shadow-sm"
              style={{
                animation: i === 0 ? "slideIn 0.3s ease-out" : undefined,
              }}
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-lg bg-primary/40 flex items-center justify-center text-xs font-bold text-text shrink-0">
                {activity.user_name[0].toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-semibold text-text">
                    {activity.user_name}
                  </span>
                  <span className="text-text-muted"> read for </span>
                  <span className="font-semibold text-secondary">
                    {activity.minutes} min
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  {timeAgo(activity.timestamp)}
                </div>
              </div>

              {/* Icon */}
              <BookOpen size={14} className="text-text-muted shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
