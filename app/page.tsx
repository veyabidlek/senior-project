"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Trophy, TrendingUp, Users, Star, Search } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#DDEEC6] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20 sm:mb-32">
          <div>
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Star size={20} className="text-[#F4D35E] fill-[#F4D35E]" />
              <span className="text-sm sm:text-base text-[#5C5C5C]">
                Start your reading journey today
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-4 sm:mb-6 leading-tight">
              Where every page is a new{" "}
              <span className="italic">Adventure</span>
            </h1>
            <p className="text-base sm:text-lg text-[#5C5C5C] mb-6 sm:mb-8 leading-relaxed">
              Join reading competitions and compete with fellow book lovers.
              Track your progress, earn points, and climb the leaderboard as you
              explore new literary worlds.
            </p>

            {!user ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium text-base sm:text-lg shadow-lg text-center"
                >
                  Get Started
                </Link>
                <div className="flex items-center space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-white rounded-full shadow-sm">
                  <Search size={18} className="text-[#5C5C5C] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Competitions"
                    className="bg-transparent outline-none text-[#2C2C2C] placeholder-[#5C5C5C] w-full text-sm sm:text-base"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/competitions"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2C2C2C] transition-all font-medium text-base sm:text-lg shadow-lg text-center"
                >
                  View Competitions
                </Link>
                <Link
                  href="/create-competition"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#2C2C2C] rounded-full hover:bg-[#E8E4D9] transition-all font-medium text-base sm:text-lg shadow-sm text-center"
                >
                  Create Competition
                </Link>
              </div>
            )}
          </div>

          {/* Reading Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image
                src="/reading.png"
                alt="Reading books illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-[#F4D35E] rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-32 sm:h-32 bg-[#E68B7C] rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#7BA5C8] to-[#5A9B8E] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Trophy size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2C2C2C] mb-3 sm:mb-4">
              Compete
            </h3>
            <p className="text-[#5C5C5C] text-base sm:text-lg leading-relaxed">
              Join reading competitions and climb the leaderboard by reading
              more books
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F4A460] to-[#E68B7C] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <TrendingUp size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2C2C2C] mb-3 sm:mb-4">
              Track Progress
            </h3>
            <p className="text-[#5C5C5C] text-base sm:text-lg leading-relaxed">
              Monitor your reading time and points earned in real-time
              competitions
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-md hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5A9B8E] to-[#7BA5C8] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <Users size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#2C2C2C] mb-3 sm:mb-4">
              Community
            </h3>
            <p className="text-[#5C5C5C] text-base sm:text-lg leading-relaxed">
              Connect with other readers and share your love for books
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
