export interface User {
  id: string;
  display_name: string;
  email: string;
  streak_current?: number;
  total_minutes?: number;
  xp?: number;
  level?: number;
  level_name?: string;
  telegram_handle?: string;
  is_admin?: boolean;
}

export interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  points_per_minute: number;
  status: string;
  participants?: Array<{ user: { id: string; display_name: string }; points: number; days_read: number; minutes_total: number }>;
}

export interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  points: number;
  rank: number;
}

export interface RankInfo {
  rank: number;
  points: number;
  total_participants: number;
}

export interface GiftExchange {
  id: string;
  competition_id: string;
  giver_id: string;
  giver_name: string;
  receiver_id: string;
  receiver_name: string;
  gift_description: string;
  giver_confirmed: boolean;
  receiver_confirmed: boolean;
}

export interface UserProfile {
  id: string;
  display_name: string;
  streak_current: number;
  total_minutes: number;
  xp: number;
  level: number;
  level_name: string;
  telegram_handle: string;
}

export const LEVELS = [
  { name: "Newbie", xp: 0 },
  { name: "Reader", xp: 100 },
  { name: "Bookworm", xp: 300 },
  { name: "Scholar", xp: 600 },
  { name: "Sage", xp: 1000 },
  { name: "Expert", xp: 1500 },
  { name: "Master", xp: 2200 },
  { name: "Grandmaster", xp: 3000 },
  { name: "Legend", xp: 4000 },
  { name: "Book King", xp: 5500 },
];

// Generate consistent avatar color from a string
const AVATAR_COLORS = [
  "bg-[#DD614C]", "bg-[#DAA144]", "bg-[#16A34A]", "bg-[#2563EB]",
  "bg-[#7C3AED]", "bg-[#DC2626]", "bg-[#0891B2]", "bg-[#CA8A04]",
  "bg-[#059669]", "bg-[#4F46E5]", "bg-[#BE185D]", "bg-[#EA580C]",
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
