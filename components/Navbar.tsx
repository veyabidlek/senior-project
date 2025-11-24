"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { BarChart3, Plus, Search, Bell, BookOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReadingLogModal from "./ReadingLogModal";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showReadingModal, setShowReadingModal] = useState(false);

  return (
    <>
      <ReadingLogModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
      />
      <nav className="bg-[#F5F1E8] border-b border-[#E8E4D9]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white shadow-sm relative">
                <Image
                  src="/power-book-logo.jpeg"
                  alt="PowerBook Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#2C2C2C]">
                PowerBook
              </span>
            </Link>

            {/* Navigation Pills */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {user ? (
                <>
                  <Link
                    href="/competitions"
                    className="hidden md:flex px-4 lg:px-6 py-2 lg:py-3 bg-white text-[#2C2C2C] rounded-full hover:bg-[#E8E4D9] transition-all items-center space-x-2 shadow-sm text-sm lg:text-base"
                  >
                    <BarChart3 size={18} />
                    <span className="hidden lg:inline">Competitions</span>
                  </Link>
                  <Link
                    href="/create-competition"
                    className="hidden md:flex px-4 lg:px-6 py-2 lg:py-3 bg-white text-[#2C2C2C] rounded-full hover:bg-[#E8E4D9] transition-all items-center space-x-2 shadow-sm text-sm lg:text-base"
                  >
                    <Plus size={18} />
                    <span className="hidden lg:inline">Create</span>
                  </Link>
                  <button
                    onClick={() => setShowReadingModal(true)}
                    className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-[#7BA5C8] to-[#5A9B8E] text-white rounded-full hover:opacity-90 transition-all items-center space-x-2 shadow-md text-sm lg:text-base font-medium flex"
                  >
                    <BookOpen size={18} />
                    <span className="hidden sm:inline">Log Reading</span>
                  </button>
                  <button className="hidden sm:flex w-10 h-10 rounded-full bg-white text-[#2C2C2C] hover:bg-[#E8E4D9] transition-all items-center justify-center shadow-sm">
                    <Search size={18} />
                  </button>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="hidden sm:block text-right">
                      <div className="text-xs lg:text-sm font-medium text-[#2C2C2C]">
                        {user.display_name}
                      </div>
                      <div className="text-[10px] lg:text-xs text-[#5C5C5C]">
                        @{user.email.split("@")[0]}
                      </div>
                    </div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#7BA5C8] to-[#5A9B8E] flex items-center justify-center text-base sm:text-lg font-bold text-white relative shadow-md">
                      {user.display_name[0].toUpperCase()}
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#E68B7C] rounded-full flex items-center justify-center">
                        <Bell size={10} className="text-white sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="hidden sm:block px-4 lg:px-5 py-2 lg:py-3 bg-white text-[#5C5C5C] rounded-full hover:bg-[#E8E4D9] hover:text-[#2C2C2C] transition-all text-xs lg:text-sm shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 sm:px-6 py-2 sm:py-3 text-[#2C2C2C] rounded-full hover:bg-[#E8E4D9] transition-all text-sm sm:text-base"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium shadow-md text-sm sm:text-base"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
