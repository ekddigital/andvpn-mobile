/**
 * API client for AndVPN mobile app
 * Handles all HTTP requests to the backend
 */

import {
  ApiResponse,
  Device,
  User,
  DeviceCreationData,
  UsageStats,
  UserSubscriptionInfo,
} from "../types";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
    console.log("🔐 Auth token set for API client");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    try {
      console.log(`🌐 API Request: ${options.method || "GET"} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        console.error(
          `❌ API Error: ${response.status} - ${response.statusText}`
        );
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`✅ API Success: ${options.method || "GET"} ${endpoint}`);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Authentication methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/user/me");
  }

  async getUserRole(): Promise<ApiResponse<{ role: string }>> {
    return this.request<{ role: string }>("/user/role");
  }

  // Device management methods
  async getDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>("/vpn/devices");
  }

  async getAllDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>("/admin/devices");
  }

  async createDevice(
    deviceData: DeviceCreationData
  ): Promise<ApiResponse<Device>> {
    return this.request<Device>("/vpn/devices", {
      method: "POST",
      body: JSON.stringify(deviceData),
    });
  }

  async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/vpn/devices/${deviceId}`, {
      method: "DELETE",
    });
  }

  async updateDevice(
    deviceId: string,
    updates: Partial<Device>
  ): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/vpn/devices/${deviceId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  async getDeviceConfig(
    deviceId: string
  ): Promise<ApiResponse<{ config: string }>> {
    return this.request<{ config: string }>(`/vpn/devices/${deviceId}/config`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>("/health");
  }

  // Test connection (simplified version for mobile)
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.healthCheck();
      return response.success;
    } catch {
      return false;
    }
  }

  // Subscription management methods
  async getUserSubscription(): Promise<ApiResponse<UserSubscriptionInfo>> {
    return this.request<UserSubscriptionInfo>("/user/subscription");
  }

  async getUsageStats(): Promise<ApiResponse<UsageStats>> {
    return this.request<UsageStats>("/user/usage");
  }

  async getDeviceUsage(deviceId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/user/devices/${deviceId}/usage`);
  }

  async getConnectionSessions(deviceId?: string): Promise<ApiResponse<any[]>> {
    const endpoint = deviceId
      ? `/user/devices/${deviceId}/sessions`
      : "/user/sessions";
    return this.request<any[]>(endpoint);
  }

  async startConnectionSession(
    deviceId: string,
    serverId: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>("/user/sessions", {
      method: "POST",
      body: JSON.stringify({ deviceId, serverId }),
    });
  }

  async endConnectionSession(
    sessionId: string,
    dataStats: { received: number; sent: number }
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/user/sessions/${sessionId}/end`, {
      method: "PATCH",
      body: JSON.stringify(dataStats),
    });
  }

  // Server management (admin only)
  async getServerStats(): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/stats");
  }

  async getServerInfo(): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/server-info");
  }

  async getSubscriptionPlans(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/subscription/plans");
  }
}

export const apiClient = new ApiClient();
