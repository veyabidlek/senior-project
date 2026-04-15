import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen size={28} className="text-text" />
        </div>
        <h1 className="text-6xl font-bold text-text tracking-tight mb-2">404</h1>
        <p className="text-lg text-text-muted mb-8">
          This page got lost between chapters.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-text text-text-inverse rounded-xl hover:opacity-90 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    </div>
  );
}
