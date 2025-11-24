import axios, { AxiosInstance } from "axios";

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

    // Add response interceptor for better error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
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
    // Handle nested data structure
    return response.data?.data || response.data || [];
  }

  async getMyRank(id: string) {
    const response = await this.client.get(`/competitions/${id}/rank/me`);
    // Handle nested data structure
    return response.data?.data || response.data;
  }

  async getUserRank(id: string, userId: string) {
    const response = await this.client.get(
      `/competitions/${id}/rank/${userId}`
    );
    return response.data?.data || response.data;
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
