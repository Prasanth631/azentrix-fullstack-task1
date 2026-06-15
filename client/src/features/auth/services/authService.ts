import api from "@/services/api";
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", credentials);
    return data.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    return data.data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
