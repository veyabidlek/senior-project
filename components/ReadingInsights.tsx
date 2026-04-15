"use client";

import { TrendingUp, TrendingDown, Minus, Clock, Calendar, Zap } from "lucide-react";

interface ReadingEntry {
  minutes: number;
  timestamp: string;
}

interface ReadingInsightsProps {
  readings: ReadingEntry[];
  totalMinutes: number;
}

export default function ReadingInsights({ readings, totalMinutes }: ReadingInsightsProps) {
  const now = new Date();

  // This week vs last week
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const thisWeekMinutes = readings
    .filter((r) => new Date(r.timestamp) >= startOfThisWeek)
    .reduce((sum, r) => sum + r.minutes, 0);

  const lastWeekMinutes = readings
    .filter((r) => {
      const d = new Date(r.timestamp);
      return d >= startOfLastWeek && d < startOfThisWeek;
    })
    .reduce((sum, r) => sum + r.minutes, 0);

  const weekChange = lastWeekMinutes > 0
    ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100)
    : thisWeekMinutes > 0 ? 100 : 0;

  // Average session length
  const avgSession = readings.length > 0
    ? Math.round(totalMinutes / readings.length)
    : 0;

  // Most active day
  const dayMinutes: Record<number, number> = {};
  for (const r of readings) {
    const day = new Date(r.timestamp).getDay();
    dayMinutes[day] = (dayMinutes[day] || 0) + r.minutes;
  }
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let bestDay = "-";
  let bestDayMinutes = 0;
  for (const [day, mins] of Object.entries(dayMinutes)) {
    if (mins > bestDayMinutes) {
      bestDayMinutes = mins;
      bestDay = dayNames[parseInt(day)];
    }
  }

  // Sessions this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthSessions = readings.filter(
    (r) => new Date(r.timestamp) >= startOfMonth
  ).length;

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border">
      <h3 className="text-sm font-semibold text-text mb-4">Reading Insights</h3>

      <div className="grid grid-cols-2 gap-3">
        {/* This week */}
        <div className="bg-surface-sunken rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-text-muted" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">This week</span>
          </div>
          <div className="text-lg font-bold text-text">{thisWeekMinutes} min</div>
          <div className="flex items-center gap-1 mt-0.5">
            {weekChange > 0 ? (
              <TrendingUp size={10} className="text-success" />
            ) : weekChange < 0 ? (
              <TrendingDown size={10} className="text-danger" />
            ) : (
              <Minus size={10} className="text-text-muted" />
            )}
            <span
              className={`text-[10px] font-medium ${
                weekChange > 0 ? "text-success" : weekChange < 0 ? "text-danger" : "text-text-muted"
              }`}
            >
              {weekChange > 0 ? "+" : ""}
              {weekChange}% vs last week
            </span>
          </div>
        </div>

        {/* Avg session */}
        <div className="bg-surface-sunken rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={12} className="text-text-muted" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Avg session</span>
          </div>
          <div className="text-lg font-bold text-text">{avgSession} min</div>
          <span className="text-[10px] text-text-muted">
            across {readings.length} sessions
          </span>
        </div>

        {/* Best day */}
        <div className="bg-surface-sunken rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} className="text-text-muted" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Best day</span>
          </div>
          <div className="text-lg font-bold text-text">{bestDay}</div>
          <span className="text-[10px] text-text-muted">
            {bestDayMinutes} min total
          </span>
        </div>

        {/* This month */}
        <div className="bg-surface-sunken rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={12} className="text-text-muted" />
            <span className="text-[10px] text-text-muted uppercase tracking-wider">This month</span>
          </div>
          <div className="text-lg font-bold text-text">{thisMonthSessions}</div>
          <span className="text-[10px] text-text-muted">
            reading sessions
          </span>
        </div>
      </div>
    </div>
  );
}
