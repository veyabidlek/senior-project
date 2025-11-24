"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { X, BookOpen } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-[#E8E4D9] rounded-full transition-colors"
        >
          <X size={20} className="text-[#5C5C5C]" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7BA5C8] to-[#5A9B8E] rounded-2xl flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#2C2C2C]">
            Log Reading Time
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-300 rounded-lg text-green-700 text-sm">
            ✓ Reading time logged successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#2C2C2C] mb-3 font-medium">
              How many minutes did you read?
            </label>

            {/* Preset Time Options */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {presetOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePresetClick(option)}
                  className={`px-4 py-4 rounded-2xl font-medium transition-all ${
                    selectedPreset === option
                      ? "bg-gradient-to-br from-[#7BA5C8] to-[#5A9B8E] text-white shadow-md scale-105"
                      : "bg-[#F5F1E8] text-[#2C2C2C] hover:bg-[#E8E4D9] border border-[#E8E4D9]"
                  }`}
                >
                  <div className="text-2xl font-bold">{option}</div>
                  <div className="text-xs opacity-80">min</div>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-4 border-t border-[#E8E4D9]">
              <label
                htmlFor="custom"
                className="block text-[#5C5C5C] mb-2 text-sm"
              >
                Or enter a custom time:
              </label>
              <input
                type="number"
                id="custom"
                value={customMinutes}
                onChange={(e) => handleCustomChange(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F5F1E8] text-[#2C2C2C] border rounded-2xl focus:outline-none focus:border-[#7BA5C8] focus:ring-2 focus:ring-[#7BA5C8]/20 text-lg ${
                  customMinutes ? "border-[#7BA5C8]" : "border-[#E8E4D9]"
                }`}
                placeholder="Enter custom minutes"
                min="1"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={
                loading || success || (!selectedPreset && !customMinutes)
              }
              className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium disabled:opacity-50 shadow-md"
            >
              {loading
                ? "Logging..."
                : success
                ? "✓ Logged!"
                : "Log Reading Time"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-white text-[#2C2C2C] border border-[#E8E4D9] rounded-full hover:bg-[#F5F1E8] transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
