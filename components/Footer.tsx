import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-text-muted">
            <BookOpen size={16} />
            <span className="text-sm font-medium">PowerBook</span>
          </div>
          <p className="text-xs text-text-muted">
            Built for readers who love a good competition.
          </p>
        </div>
      </div>
    </footer>
  );
}
