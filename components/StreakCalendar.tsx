"use client";

interface ReadingEntry {
  minutes: number;
  timestamp: string;
}

interface StreakCalendarProps {
  readings: ReadingEntry[];
}

export default function StreakCalendar({ readings }: StreakCalendarProps) {
  // Build a map of date -> total minutes for the last 12 weeks
  const today = new Date();
  const weeks = 12;
  const days = weeks * 7;

  const minutesByDate: Record<string, number> = {};
  for (const r of readings) {
    const date = new Date(r.timestamp).toISOString().slice(0, 10);
    minutesByDate[date] = (minutesByDate[date] || 0) + r.minutes;
  }

  // Generate grid of days
  const grid: { date: string; minutes: number; dayOfWeek: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    grid.push({
      date: dateStr,
      minutes: minutesByDate[dateStr] || 0,
      dayOfWeek: d.getDay(),
    });
  }

  // Group into weeks (columns)
  const columns: typeof grid[] = [];
  for (let i = 0; i < grid.length; i += 7) {
    columns.push(grid.slice(i, i + 7));
  }

  const getIntensity = (minutes: number) => {
    if (minutes === 0) return "bg-border/40";
    if (minutes < 15) return "bg-success/20";
    if (minutes < 30) return "bg-success/40";
    if (minutes < 60) return "bg-success/60";
    return "bg-success/80";
  };

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border">
      <h3 className="text-sm font-semibold text-text mb-4">Reading Activity</h3>
      <div className="flex gap-1 overflow-x-auto">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1 shrink-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-3 text-[9px] text-text-muted leading-3 w-6">
              {label}
            </div>
          ))}
        </div>
        {/* Grid */}
        {columns.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getIntensity(day.minutes)} transition-colors`}
                title={`${day.date}: ${day.minutes} min`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-[10px] text-text-muted">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-sm bg-border/40" />
          <div className="w-3 h-3 rounded-sm bg-success/20" />
          <div className="w-3 h-3 rounded-sm bg-success/40" />
          <div className="w-3 h-3 rounded-sm bg-success/60" />
          <div className="w-3 h-3 rounded-sm bg-success/80" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
