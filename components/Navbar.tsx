"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";
import { BookOpen, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import ReadingLogModal from "./ReadingLogModal";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLink = "px-3 py-2 text-sm font-bold uppercase tracking-wider text-text hover:bg-primary hover:text-text-inverse border-2 border-transparent hover:border-border transition-all";
  const navLinkMobile = "block px-3 py-2 text-sm font-bold uppercase tracking-wider text-text hover:bg-primary hover:text-text-inverse transition-all";

  return (
    <>
      <ReadingLogModal isOpen={showReadingModal} onClose={() => setShowReadingModal(false)} />
      <nav className="bg-surface border-b-4 border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-center gap-2 font-black text-xl uppercase tracking-tighter text-text">
              <span className="bg-primary text-text-inverse px-2 py-0.5 text-lg">PB</span>
              PowerBook
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {user ? (
                <>
                  <Link href="/dashboard" className={navLink}>Dashboard</Link>
                  <Link href="/competitions" className={navLink}>Compete</Link>
                  <Link href="/activity" className={navLink}>Live</Link>
                  <Link href="/books" className={navLink}>Books</Link>
                  <button onClick={() => setShowReadingModal(true)} className="px-3 py-2 text-sm font-bold uppercase tracking-wider bg-primary text-text-inverse border-2 border-border hover:bg-secondary transition-all">
                    <BookOpen size={14} className="inline mr-1" />Log
                  </button>
                  <NotificationCenter streak={user.streak_current || 0} totalMinutes={user.total_minutes || 0} competitionsCount={0} />
                  <div className="w-0.5 h-6 bg-border mx-2" />
                  <Link href="/profile" className="px-2 py-1 border-2 border-border bg-surface font-bold text-sm hover:bg-surface-sunken transition-all">
                    {user.display_name}
                  </Link>
                  <button onClick={toggleTheme} className="p-2 border-2 border-border hover:bg-surface-sunken transition-all" aria-label="Toggle theme">
                    {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                  </button>
                  <button onClick={logout} className="p-2 text-text-muted hover:text-primary border-2 border-transparent hover:border-border transition-all" aria-label="Logout">
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <>
                  <Link href="/competitions" className={navLink}>Browse</Link>
                  <button onClick={toggleTheme} className="p-2 border-2 border-border hover:bg-surface-sunken transition-all" aria-label="Toggle theme">
                    {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
                  </button>
                  <Link href="/login" className={navLink}>Sign In</Link>
                  <Link href="/register" className="px-3 py-2 text-sm font-bold uppercase tracking-wider bg-text text-text-inverse border-2 border-border hover:bg-primary transition-all">
                    Join
                  </Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 border-2 border-border" aria-label="Menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile */}
          {mobileOpen && (
            <div className="md:hidden border-t-2 border-border py-2 space-y-1">
              {user ? (
                <>
                  <div className="px-3 py-2 font-black text-sm border-b-2 border-border mb-2">{user.display_name}</div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Dashboard</Link>
                  <Link href="/competitions" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Competitions</Link>
                  <Link href="/activity" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Live Activity</Link>
                  <Link href="/books" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Books</Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Profile</Link>
                  <button onClick={() => { setShowReadingModal(true); setMobileOpen(false); }} className={navLinkMobile + " text-primary"}>Log Reading</button>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className={navLinkMobile + " text-danger"}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/competitions" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Browse</Link>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className={navLinkMobile}>Sign In</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className={navLinkMobile + " bg-text text-text-inverse"}>Join</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
