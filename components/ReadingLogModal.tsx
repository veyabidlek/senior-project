"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { X, BookOpen, Check } from "lucide-react";

interface ReadingLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadingLogModal({
  isOpen,
  onClose,
}: ReadingLogModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customMinutes, setCustomMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const presetOptions = [5, 10, 15, 20, 30, 45, 60, 90, 120];

  if (!isOpen) return null;

  const handlePresetClick = (value: number) => {
    setSelectedPreset(value);
    setCustomMinutes("");
  };

  const handleCustomChange = (value: string) => {
    setCustomMinutes(value);
    setSelectedPreset(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const minutesNum = selectedPreset || parseInt(customMinutes);
    if (!minutesNum || minutesNum <= 0) {
      setError("Please select or enter a valid number of minutes");
      return;
    }

    setLoading(true);

    try {
      await api.logReading({
        minutes: minutesNum,
        source: "web",
        timestamp: new Date().toISOString(),
      });
      setSuccess(true);
      setSelectedPreset(null);
      setCustomMinutes("");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-raised rounded-2xl shadow-2xl max-w-md w-full p-6 relative border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 hover:bg-surface-sunken rounded-lg transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-text-muted" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-text-inverse" />
          </div>
          <h2 className="text-xl font-semibold text-text">Log Reading Time</h2>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 px-4 py-3 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-2">
            <Check size={16} />
            Reading time logged successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-3">
              How many minutes did you read?
            </label>

            {/* Preset Time Options */}
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

            {/* Custom Input */}
            <div className="pt-4 border-t border-border">
              <label
                htmlFor="custom"
                className="block text-text-muted mb-2 text-sm"
              >
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
      </div>
    </div>
  );
}
