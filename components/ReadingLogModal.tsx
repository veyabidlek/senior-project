"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { X, BookOpen, Check, Timer, Keyboard } from "lucide-react";

interface ReadingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadingLogModal({
  isOpen,
  onClose,
}: ReadingLogModalProps) {
  const { refreshUser } = useAuth();
  const [mode, setMode] = useState<"manual" | "timer">("manual");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const presetOptions = [5, 10, 15, 20, 30, 45, 60, 90, 120];

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  if (!isOpen) return null;

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value);
    setCustomMinutes("");
  };

  const handleCustomChange = (value: string) => {
    setCustomMinutes(value);
    setSelectedPreset(null);
  };

  const submitMinutes = async (minutes: number) => {
    setError("");
    setSuccess(false);
    if (minutes <= 0) {
      setError("Please log at least 1 minute");
      return;
    }
    setLoading(true);
    try {
      await api.logReading({
        minutes,
        source: "web",
        timestamp: new Date().toISOString(),
      });
      await refreshUser();
      setSuccess(true);
      setSelectedPreset(null);
      setCustomMinutes("");
      setTimerSeconds(0);
      setTimerRunning(false);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to log reading time");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutesNum = selectedPreset || parseInt(customMinutes);
    if (!minutesNum || minutesNum <= 0) {
      setError("Please select or enter a valid number of minutes");
      return;
    }
    submitMinutes(minutesNum);
  };

  const handleTimerStop = () => {
    setTimerRunning(false);
    const minutes = Math.ceil(timerSeconds / 60);
    if (minutes > 0) {
      submitMinutes(minutes);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-raised rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-border animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-surface-sunken rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-text-muted" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-text-inverse" />
          </div>
          <h2 className="text-xl font-semibold text-text">Log Reading Time</h2>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-surface-sunken rounded-xl p-1 mb-5">
          <button
            onClick={() => setMode("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "manual" ? "bg-surface-raised text-text shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            <Keyboard size={14} />
            Manual
          </button>
          <button
            onClick={() => setMode("timer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "timer" ? "bg-surface-raised text-text shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            <Timer size={14} />
            Timer
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-2">
            <Check size={16} />
            Reading time logged!
          </div>
        )}

        {mode === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text mb-3">
                How many minutes did you read?
              </label>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {presetOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handlePresetClick(option)}
                    className={`py-3 rounded-xl font-medium transition-all text-center ${
                      selectedPreset === option
                        ? "bg-secondary text-text-inverse shadow-sm"
                        : "bg-surface-sunken text-text hover:bg-border border border-border"
                    }`}
                  >
                    <div className="text-lg font-bold">{option}</div>
                    <div className="text-[11px] opacity-70">min</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <label htmlFor="custom" className="block text-text-muted mb-2 text-sm">
                  Or enter a custom time:
                </label>
                <input
                  type="number"
                  id="custom"
                  value={customMinutes}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-surface-sunken text-text border rounded-xl focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20 ${
                    customMinutes ? "border-border-focus" : "border-border"
                  }`}
                  placeholder="Enter custom minutes"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || success || (!selectedPreset && !customMinutes)}
                className="flex-1 px-5 py-3 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-all font-medium disabled:opacity-40 text-sm"
              >
                {loading ? "Logging..." : success ? "Logged!" : "Log Reading Time"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-3 bg-surface-sunken text-text border border-border rounded-xl hover:bg-border transition-all font-medium disabled:opacity-40 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div>
              <div className="text-5xl font-bold font-mono text-text tracking-tight mb-2">
                {formatTimer(timerSeconds)}
              </div>
              <p className="text-sm text-text-muted">
                {timerRunning ? "Reading in progress..." : timerSeconds > 0 ? `${Math.ceil(timerSeconds / 60)} min will be logged` : "Press start to begin reading"}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              {!timerRunning && timerSeconds === 0 && (
                <button
                  onClick={() => setTimerRunning(true)}
                  className="px-8 py-3 bg-success text-white rounded-xl hover:opacity-90 transition-all font-medium text-sm"
                >
                  Start Reading
                </button>
              )}
              {timerRunning && (
                <button
                  onClick={handleTimerStop}
                  disabled={loading}
                  className="px-8 py-3 bg-danger text-white rounded-xl hover:opacity-90 transition-all font-medium text-sm disabled:opacity-40"
                >
                  {loading ? "Logging..." : "Stop & Log"}
                </button>
              )}
              {!timerRunning && timerSeconds > 0 && !success && (
                <>
                  <button
                    onClick={() => submitMinutes(Math.ceil(timerSeconds / 60))}
                    disabled={loading}
                    className="px-6 py-3 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-all font-medium text-sm disabled:opacity-40"
                  >
                    {loading ? "Logging..." : `Log ${Math.ceil(timerSeconds / 60)} min`}
                  </button>
                  <button
                    onClick={() => setTimerSeconds(0)}
                    className="px-6 py-3 bg-surface-sunken text-text border border-border rounded-xl hover:bg-border transition-all font-medium text-sm"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>

            {timerRunning && (
              <button
                onClick={() => setTimerRunning(false)}
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Pause
              </button>
            )}
            {!timerRunning && timerSeconds > 0 && !success && (
              <button
                onClick={() => setTimerRunning(true)}
                className="text-sm text-secondary hover:text-secondary/80 transition-colors"
              >
                Resume
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
