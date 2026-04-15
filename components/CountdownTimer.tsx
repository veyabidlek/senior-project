"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string;
  startDate: string;
  status: string;
  compact?: boolean;
}

export default function CountdownTimer({ endDate, startDate, status, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (status === "closed") {
        setTimeLeft("Ended");
        setLabel("");
        return;
      }

      if (now < start) {
        // Not started yet
        const diff = start - now;
        setTimeLeft(formatTime(diff));
        setLabel("Starts in");
      } else if (now < end) {
        // Active
        const diff = end - now;
        setTimeLeft(formatTime(diff));
        setLabel("Ends in");
      } else {
        setTimeLeft("Ended");
        setLabel("");
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate, startDate, status]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  if (timeLeft === "Ended") {
    if (compact) return <span className="text-xs text-text-muted">Ended</span>;
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs text-text-muted">
        <Clock size={10} className="shrink-0" />
        <span>{label} {timeLeft}</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock size={16} className="text-secondary" />
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-text tracking-tight font-mono">
        {timeLeft}
      </div>
    </div>
  );
}
