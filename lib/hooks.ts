import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: () => api.listCompetitions(),
    select: (data: unknown) => (Array.isArray(data) ? data : []),
  });
}

export function useMyCompetitions() {
  return useQuery({
    queryKey: ["my-competitions"],
    queryFn: () => api.getMyCompetitions(),
    select: (data: unknown) => (Array.isArray(data) ? data : []),
  });
}

export function useLeaderboard(competitionId: string) {
  return useQuery({
    queryKey: ["leaderboard", competitionId],
    queryFn: () => api.getLeaderboard(competitionId, 50),
    select: (data: unknown) => (Array.isArray(data) ? data : []),
  });
}

export function useMyRank(competitionId: string) {
  return useQuery({
    queryKey: ["my-rank", competitionId],
    queryFn: () => api.getMyRank(competitionId),
  });
}

export function useCompetition(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId],
    queryFn: () => api.getCompetition(competitionId),
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => api.getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 min cache for profiles
  });
}

export function useGiftExchanges(competitionId: string) {
  return useQuery({
    queryKey: ["gifts", competitionId],
    queryFn: () => api.getGiftExchanges(competitionId),
    enabled: !!competitionId,
    select: (data: unknown) => (Array.isArray(data) ? data : []),
  });
}

export function useReadingHistory() {
  return useQuery({
    queryKey: ["reading-history"],
    queryFn: () => api.getReadingHistory(),
    select: (data: unknown) => (Array.isArray(data) ? data : []),
  });
}

export function useJoinCompetition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (competitionId: string) => api.joinCompetition(competitionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competitions"] });
      queryClient.invalidateQueries({ queryKey: ["my-competitions"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-rank"] });
    },
  });
}

export function useLogReading() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { minutes: number; source: string; timestamp: string }) =>
      api.logReading(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-history"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-rank"] });
      queryClient.invalidateQueries({ queryKey: ["my-competitions"] });
    },
  });
}
