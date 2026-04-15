import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-[120px] font-black leading-none text-text tracking-tighter">404</div>
        <p className="text-lg font-bold uppercase tracking-wider text-text-muted mt-4 mb-8">
          Page not found
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-text text-text-inverse font-black uppercase tracking-wider text-sm border-2 border-border hover:bg-primary transition-all">
          <ArrowLeft size={16} /> Go Back
        </Link>
      </div>
    </div>
  );
}
