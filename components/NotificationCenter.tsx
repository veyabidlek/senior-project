"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Trophy, Flame, BookOpen, X } from "lucide-react";

interface Notification {
  id: string;
  type: "streak" | "competition" | "badge" | "reading";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationCenterProps {
  streak: number;
  totalMinutes: number;
  competitionsCount: number;
}

export default function NotificationCenter({
  streak,
  totalMinutes,
  competitionsCount,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  // Generate notifications based on user stats
  useEffect(() => {
    const notifs: Notification[] = [];
    const now = new Date().toISOString();

    if (streak >= 3 && streak < 7) {
      notifs.push({
        id: "streak-3",
        type: "streak",
        title: "Streak Alert",
        message: `${streak}-day streak! Keep it up to earn the Week Warrior badge.`,
        time: now,
        read: false,
      });
    }

    if (streak >= 7) {
      notifs.push({
        id: "streak-7",
        type: "streak",
        title: "Week Warrior!",
        message: `Amazing ${streak}-day streak! You earned the Week Warrior badge.`,
        time: now,
        read: false,
      });
    }

    if (totalMinutes > 0 && totalMinutes < 60) {
      notifs.push({
        id: "milestone-60",
        type: "reading",
        title: "Almost there!",
        message: `${60 - totalMinutes} more minutes to earn the Hour Reader badge.`,
        time: now,
        read: false,
      });
    }

    if (totalMinutes >= 60 && totalMinutes < 500) {
      notifs.push({
        id: "earned-60",
        type: "badge",
        title: "Badge Earned!",
        message: "You unlocked the Hour Reader badge. Next: Bookworm at 500 min!",
        time: now,
        read: false,
      });
    }

    if (totalMinutes >= 500) {
      notifs.push({
        id: "earned-500",
        type: "badge",
        title: "Bookworm Unlocked!",
        message: "You've read over 500 minutes. You're a true bookworm!",
        time: now,
        read: false,
      });
    }

    if (competitionsCount === 0) {
      notifs.push({
        id: "no-comp",
        type: "competition",
        title: "Join a Competition",
        message: "Browse available competitions and start competing with others!",
        time: now,
        read: false,
      });
    }

    if (streak === 0 && totalMinutes > 0) {
      notifs.push({
        id: "streak-broken",
        type: "streak",
        title: "Streak Lost",
        message: "You lost your reading streak. Log a reading session to start a new one!",
        time: now,
        read: false,
      });
    }

    setNotifications(notifs.filter((n) => !dismissed.has(n.id)));
  }, [streak, totalMinutes, competitionsCount, dismissed]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const icons = {
    streak: <Flame size={14} className="text-warning" />,
    competition: <Trophy size={14} className="text-success" />,
    badge: <Trophy size={14} className="text-secondary" />,
    reading: <BookOpen size={14} className="text-secondary" />,
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full flex items-center justify-center text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-raised rounded-2xl border border-border shadow-xl z-50 overflow-hidden animate-scale-in">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text">Notifications</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted">
              All caught up!
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-3 hover:bg-surface-sunken transition-colors flex gap-3"
                >
                  <div className="w-7 h-7 bg-surface-sunken rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    {icons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-text">{n.title}</div>
                    <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {n.message}
                    </div>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="p-1 text-text-muted hover:text-text shrink-0"
                    aria-label="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
