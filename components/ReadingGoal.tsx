"use client";

import { useState, useEffect } from "react";
import { Target, Check } from "lucide-react";

interface ReadingGoalProps {
  todayMinutes: number;
}

export default function ReadingGoal({ todayMinutes }: ReadingGoalProps) {
  const [goal, setGoal] = useState(30);
  const [editing, setEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState("30");

  useEffect(() => {
    const saved = localStorage.getItem("powerbook-daily-goal");
    if (saved) {
      setGoal(parseInt(saved));
      setTempGoal(saved);
    }
  }, []);

  const saveGoal = () => {
    const val = parseInt(tempGoal) || 30;
    setGoal(val);
    localStorage.setItem("powerbook-daily-goal", String(val));
    setEditing(false);
  };

  const progress = Math.min(todayMinutes / goal, 1);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference * (1 - progress);
  const completed = todayMinutes >= goal;

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text">Daily Goal</h3>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            className="w-20 px-3 py-2 bg-surface-sunken text-text border border-border rounded-xl text-sm focus:outline-none focus:border-border-focus"
            min="1"
          />
          <span className="text-sm text-text-muted">min/day</span>
          <button
            onClick={saveGoal}
            className="px-3 py-2 bg-text text-text-inverse rounded-xl text-xs font-medium"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Progress ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-border"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={completed ? "text-success" : "text-secondary"}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {completed ? (
                <Check size={20} className="text-success" />
              ) : (
                <span className="text-sm font-bold text-text">
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="text-lg font-bold text-text">
              {todayMinutes} / {goal} min
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {completed
                ? "Goal reached! Great job!"
                : `${goal - todayMinutes} min remaining`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
