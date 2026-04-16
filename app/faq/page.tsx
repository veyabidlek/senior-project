"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface FAQItem { q: string; a: string; }

const faqs: FAQItem[] = [
  {
    q: "How do competitions work?",
    a: "Each competition has a start date, end date, and a points-per-minute rate. While a competition is active, every minute you log reading earns you points. Points = minutes × rate. The leaderboard ranks all participants by total points."
  },
  {
    q: "How is the winner decided?",
    a: "When a competition ends, participants are ranked by total points. 1st place gets the gold, 2nd silver, 3rd bronze. Everyone earns XP based on their final position."
  },
  {
    q: "How does the gift exchange work?",
    a: "After a competition closes, the top 50% of participants are randomly paired with the bottom 50%. Each person in the top half gives a physical gift to their paired person from the bottom half. The giver describes what they gave, and the receiver confirms when they get it."
  },
  {
    q: "What is XP and how do I earn it?",
    a: "XP (Experience Points) is earned from competitions. 1st place: 200 XP, 2nd: 150 XP, 3rd: 100 XP, Top 50%: 50 XP, Bottom 50%: 20 XP. You also get +5 XP per day you read during a competition, and a +30 XP bonus if you read every single day (perfect streak)."
  },
  {
    q: "What are the levels?",
    a: "There are 10 levels based on cumulative XP: Newbie (0), Reader (100), Bookworm (300), Scholar (600), Sage (1000), Expert (1500), Master (2200), Grandmaster (3000), Legend (4000), Book King (5500). XP carries across all competitions."
  },
  {
    q: "How do I log my reading?",
    a: "Click the \"Log\" button in the navigation bar. You can either manually enter minutes with preset buttons (5, 10, 15, 30, etc.) or use the built-in timer to track in real time. Your reading is automatically counted toward all active competitions you've joined."
  },
  {
    q: "Can I join multiple competitions at once?",
    a: "Yes! Your reading minutes count toward every active competition you're participating in. Join as many as you like."
  },
  {
    q: "How do streaks work?",
    a: "A streak counts consecutive days with at least one reading log. If you miss a day, your streak resets to 0. Streaks earn you the perfect attendance bonus (+30 XP) in competitions if you read every day."
  },
  {
    q: "Can I see other users' profiles?",
    a: "Yes! Click any user name on a leaderboard to view their public profile. You can see their level, XP, reading stats, streak, and competition history."
  },
  {
    q: "What happens if there's an odd number of participants?",
    a: "If there's an odd number, the extra person in the top half doesn't get paired. Gift pairing only happens for the minimum of top-half and bottom-half sizes."
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 animate-fade-in">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-text mb-2">FAQ</h1>
        <p className="text-sm text-text-muted font-medium mb-8">Everything you need to know about PowerBook.</p>

        <div className="border-4 border-border">
          {faqs.map((faq, i) => (
            <div key={i} className={i > 0 ? "border-t-2 border-border" : ""}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-surface-sunken transition-colors text-left">
                <span className="text-sm font-bold text-text">{faq.q}</span>
                {open === i ? <ChevronUp size={16} className="text-text-muted shrink-0" /> : <ChevronDown size={16} className="text-text-muted shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-xs text-text-muted font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-xs font-bold text-primary uppercase hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
