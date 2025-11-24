export interface User {
  id: string;
  display_name: string;
  email: string;
}

export interface Competition {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  points_per_minute: number;
  status: string;
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
