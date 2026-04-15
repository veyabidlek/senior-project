"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { BarChart3, Plus, BookOpen, LogOut, Menu, X, LayoutDashboard, Sun, Moon, Library, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import NotificationCenter from "./NotificationCenter";
import Image from "next/image";
import { useState } from "react";
import ReadingLogModal from "./ReadingLogModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showReadingModal, setShowReadingModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <ReadingLogModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
      />
      <nav className="bg-surface-raised border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-surface shadow-sm relative">
                <Image
                  src="/power-book-logo.jpeg"
                  alt="PowerBook Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-base font-semibold text-text tracking-tight">
                PowerBook
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/competitions"
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors flex items-center gap-2"
                  >
                    <BarChart3 size={16} />
                    <span>Competitions</span>
                  </Link>
                  <Link
                    href="/activity"
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Live</span>
                  </Link>
                  <button
                    onClick={() => setShowReadingModal(true)}
                    className="px-4 py-2 bg-secondary text-text-inverse text-sm font-medium rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                  >
                    <BookOpen size={16} />
                    <span>Log Reading</span>
                  </button>
                  <NotificationCenter
                    streak={user.streak_current || 0}
                    totalMinutes={user.total_minutes || 0}
                    competitionsCount={0}
                  />
                  <div className="w-px h-6 bg-border mx-2" />
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-text leading-tight">
                        {user.display_name}
                      </div>
                      <div className="text-xs text-text-muted leading-tight">
                        @{user.email.split("@")[0]}
                      </div>
                    </div>
                    <Link href="/profile" className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-text hover:opacity-80 transition-opacity">
                      {user.display_name[0].toUpperCase()}
                    </Link>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  </button>
                  <button
                    onClick={logout}
                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  </button>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text rounded-lg transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-text text-text-inverse text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="md:hidden border-t border-border py-3 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-sm font-bold text-text">
                      {user.display_name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text">{user.display_name}</div>
                      <div className="text-xs text-text-muted">@{user.email.split("@")[0]}</div>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <Link
                    href="/competitions"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg"
                  >
                    <BarChart3 size={16} />
                    Competitions
                  </Link>
                  <Link
                    href="/activity"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg"
                  >
                    <Sparkles size={16} />
                    Live Activity
                  </Link>
                  <Link
                    href="/books"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg"
                  >
                    <Library size={16} />
                    Books
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-sunken rounded-lg"
                  >
                    <LayoutDashboard size={16} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowReadingModal(true);
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-secondary font-medium hover:bg-secondary/10 rounded-lg"
                  >
                    <BookOpen size={16} />
                    Log Reading
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-danger/10 rounded-lg"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-text-muted hover:text-text rounded-lg"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-text bg-surface-sunken rounded-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
