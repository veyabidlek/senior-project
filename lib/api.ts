import axios, { AxiosInstance } from "axios";

// API base URL — set via NEXT_PUBLIC_API_URL env var on Vercel
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add auth token to requests if available
    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Add response interceptor — only clear token on auth-specific 401s
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 401 &&
          typeof window !== "undefined" &&
          error.response?.data?.error === "invalid Authorization format"
        ) {
          // Token is malformed or missing — clear it
          localStorage.removeItem("token");
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post("/users/login", {
      email,
      password,
    });
    // Token is nested in response.data.data.token
    const token = response.data?.data?.token || response.data?.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  }

  async register(display_name: string, email: string, password: string) {
    const response = await this.client.post("/users/register", {
      display_name,
      email,
      password,
    });
    return response.data?.data || response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get("/users/me");
    return response.data?.data || response.data;
  }

  logout() {
    localStorage.removeItem("token");
  }

  // Competition endpoints
  async listCompetitions() {
    const response = await this.client.get("/competitions");
    // Handle nested structure: response.data.data.competitions
    return (
      response.data?.data?.competitions || response.data?.competitions || []
    );
  }

  async getMyCompetitions() {
    const response = await this.client.get("/competitions/my");
    // Handle nested structure: response.data.data.competitions
    return (
      response.data?.data?.competitions || response.data?.competitions || []
    );
  }

  async createCompetition(data: {
    name: string;
    start_date: string;
    end_date: string;
    points_per_minute: number;
  }) {
    const response = await this.client.post("/competitions/create", data);
    return response.data?.data || response.data;
  }

  async closeCompetition(id: string) {
    const response = await this.client.post(`/competitions/${id}/close`);
    return response.data?.data || response.data;
  }

  async joinCompetition(id: string) {
    const response = await this.client.post(`/competitions/${id}/join`);
    return response.data?.data || response.data;
  }

  async getLeaderboard(id: string, limit: number = 50) {
    const response = await this.client.get(`/competitions/${id}/leaderboard`, {
      params: { limit },
    });
    // data.data can be an empty array (falsy) — check explicitly
    const data = response.data?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(response.data)) return response.data;
    return [];
  }

  async getMyRank(id: string) {
    const response = await this.client.get(`/competitions/${id}/rank/me`);
    const data = response.data?.data || response.data;
    // API returns {found: false} when user hasn't joined — treat as null
    if (data && data.found === false) return null;
    return data;
  }

  async getUserRank(id: string, userId: string) {
    const response = await this.client.get(
      `/competitions/${id}/rank/${userId}`
    );
    return response.data?.data || response.data;
  }

  // Get a single competition by ID
  async getCompetition(id: string) {
    const response = await this.client.get(`/competitions/${id}`);
    return response.data?.data || response.data;
  }

  // Public user profile
  async getUserProfile(id: string) {
    const response = await this.client.get(`/users/${id}`);
    return response.data?.data || response.data;
  }

  // Update profile (telegram handle)
  async updateProfile(data: { telegram_handle: string }) {
    const response = await this.client.put("/users/me/profile", data);
    return response.data?.data || response.data;
  }

  // Gift exchanges
  async getGiftExchanges(competitionId: string) {
    const response = await this.client.get(`/competitions/${competitionId}/gifts`);
    const data = response.data?.data || response.data;
    return data?.gifts || [];
  }

  async confirmGift(giftId: string, giftDescription?: string) {
    const response = await this.client.post(`/gifts/${giftId}/confirm`, {
      gift_description: giftDescription || "",
    });
    return response.data?.data || response.data;
  }

  // Admin
  async adminListUsers() {
    const response = await this.client.get("/admin/users");
    const data = response.data?.data || response.data;
    return data?.users || [];
  }

  async adminDeleteUser(id: string) {
    const response = await this.client.delete(`/admin/users/${id}`);
    return response.data?.data || response.data;
  }

  // Reading history
  async getReadingHistory() {
    const response = await this.client.get("/reading/history");
    const data = response.data?.data || response.data;
    return data?.readings || [];
  }

  // Reading endpoints
  async logReading(data: {
    minutes: number;
    source: string;
    timestamp: string;
  }) {
    const response = await this.client.post("/reading/log", data);
    return response.data?.data || response.data;
  }
}

export const api = new ApiClient();
