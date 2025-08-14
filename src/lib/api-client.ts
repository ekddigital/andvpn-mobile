/**
 * API client for AndVPN mobile app
 * Handles all HTTP requests to the backend
 */

import { ApiResponse, Device, User, DeviceCreationData } from "../types";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
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
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>("/user/profile");
  }

  async updateUserRole(
    userId: string,
    role: string
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/user/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }

  // Device endpoints
  async getDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>("/vpn/devices");
  }

  async getDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/vpn/devices/${deviceId}`);
  }

  async createDevice(
    deviceData: DeviceCreationData
  ): Promise<ApiResponse<Device>> {
    return this.request<Device>("/vpn/devices/create", {
      method: "POST",
      body: JSON.stringify(deviceData),
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

  async deleteDevice(deviceId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/vpn/devices/${deviceId}`, {
      method: "DELETE",
    });
  }

  async getDeviceConfig(
    deviceId: string
  ): Promise<ApiResponse<{ config: string }>> {
    return this.request<{ config: string }>(`/vpn/devices/${deviceId}/config`);
  }

  async getDeviceQR(
    deviceId: string
  ): Promise<ApiResponse<{ qrCode: string }>> {
    return this.request<{ qrCode: string }>(`/vpn/devices/${deviceId}/qr`);
  }

  async downloadDeviceConfig(
    deviceId: string,
    type: "wireguard" | "openvpn"
  ): Promise<ApiResponse<{ config: string; filename: string }>> {
    return this.request<{ config: string; filename: string }>(
      `/vpn/devices/${deviceId}/download/${type}`
    );
  }

  // VPN status endpoints
  async getVPNStatus(): Promise<
    ApiResponse<{ isConnected: boolean; peers: any[] }>
  > {
    return this.request<{ isConnected: boolean; peers: any[] }>("/vpn/status");
  }

  async getVPNPeers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>("/vpn/peers");
  }

  // Analytics endpoints
  async getAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>("/vpn/analytics");
  }

  // Admin endpoints
  async getAdminAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>("/admin/analytics");
  }

  async getAllDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>("/admin/devices");
  }

  async blockDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/admin/devices/${deviceId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "BLOCKED" }),
    });
  }

  async unblockDevice(deviceId: string): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/admin/devices/${deviceId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: "ACTIVE" }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>("/health");
  }
}

export const apiClient = new ApiClient();
export default apiClient;
