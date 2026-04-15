"use client";

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-border/50 rounded-xl ${className}`}
    />
  );
}

export function CompetitionCardSkeleton() {
  return (
    <div className="bg-surface-raised rounded-2xl border border-border p-5">
      <div className="flex justify-between items-start mb-3">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="h-6 w-16 rounded-lg" />
      </div>
      <div className="space-y-2 mb-4">
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-4 w-28" />
      </div>
      <div className="pt-3 border-t border-border">
        <SkeletonBlock className="h-4 w-24" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="w-8 h-5" />
            <SkeletonBlock className="w-8 h-8 rounded-lg" />
            <SkeletonBlock className="h-4 w-28" />
          </div>
          <SkeletonBlock className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-border text-center">
      <SkeletonBlock className="h-7 w-12 mx-auto mb-2" />
      <SkeletonBlock className="h-3 w-16 mx-auto" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
