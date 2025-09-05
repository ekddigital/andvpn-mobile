/**
 * Subscription Service - Handles user subscription and usage management
 * Tracks device usage, data consumption, and subscription limits
 */

import { apiClient } from "../lib/api-client";
import {
  UserSubscription,
  UserUsageStats,
  DeviceUsage,
  ConnectionSession,
} from "../types/subscription";

class SubscriptionService {
  private currentSubscription: UserSubscription | null = null;
  private usageStats: UserUsageStats | null = null;
  private activeSession: ConnectionSession | null = null;

  /**
   * Get user's current subscription details
   */
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await apiClient.getUserSubscription();

      if (response.success && response.data) {
        this.currentSubscription = response.data;
        return response.data;
      }

      // Return default free plan if no subscription found
      return this.getDefaultFreePlan();
    } catch (error) {
      console.warn("Could not fetch subscription, using free plan:", error);
      return this.getDefaultFreePlan();
    }
  }

  /**
   * Get comprehensive usage statistics
   */
  async getUserUsageStats(): Promise<UserUsageStats | null> {
    try {
      const response = await apiClient.getUserUsageStats();

      if (response.success && response.data) {
        this.usageStats = response.data;
        return response.data;
      }

      // Return default stats if API fails
      const subscription = await this.getUserSubscription();
      return this.getDefaultUsageStats(subscription!);
    } catch (error) {
      console.warn("Could not fetch usage stats:", error);
      const subscription = await this.getUserSubscription();
      return this.getDefaultUsageStats(subscription!);
    }
  }

  /**
   * Check if user can add more devices
   */
  async canAddDevice(): Promise<{ canAdd: boolean; reason?: string }> {
    const stats = await this.getUserUsageStats();

    if (!stats) {
      return {
        canAdd: false,
        reason: "Could not load subscription information",
      };
    }

    if (stats.remainingDevices <= 0) {
      return {
        canAdd: false,
        reason: `Device limit reached (${stats.subscription.deviceLimit} devices)`,
      };
    }

    if (!stats.subscription.isActive) {
      return { canAdd: false, reason: "Subscription is not active" };
    }

    if (new Date() > new Date(stats.subscription.endDate)) {
      return { canAdd: false, reason: "Subscription has expired" };
    }

    return { canAdd: true };
  }

  /**
   * Start tracking a VPN connection session
   */
  async startConnectionSession(
    deviceId: string,
    serverId: string
  ): Promise<ConnectionSession | null> {
    try {
      const response = await apiClient.startConnectionSession(
        deviceId,
        serverId
      );

      if (response.success && response.data) {
        this.activeSession = response.data;
        return response.data;
      }

      return null;
    } catch (error) {
      console.error("Failed to start connection session:", error);
      return null;
    }
  }

  /**
   * End tracking a VPN connection session
   */
  async endConnectionSession(
    sessionId: string,
    dataStats: { received: number; sent: number }
  ): Promise<void> {
    try {
      await apiClient.endConnectionSession(sessionId, dataStats);
      this.activeSession = null;
    } catch (error) {
      console.error("Failed to end connection session:", error);
    }
  }

  /**
   * Get device usage for a specific device
   */
  async getDeviceUsage(deviceId: string): Promise<DeviceUsage | null> {
    try {
      const response = await apiClient.getDeviceUsage(deviceId);

      if (response.success && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.warn("Could not fetch device usage:", error);
      return null;
    }
  }

  /**
   * Format data usage for display
   */
  formatDataUsage(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  /**
   * Format connection time for display
   */
  formatConnectionTime(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return `${hours}h ${remainingMinutes}m`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }

  /**
   * Get days until subscription expiry
   */
  getDaysUntilExpiry(endDate: Date): number {
    const now = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Default free plan for users without subscription
   */
  private getDefaultFreePlan(): UserSubscription {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + 7); // 7-day trial

    return {
      id: "free-trial",
      userId: "current-user",
      planName: "Free Trial",
      planType: "FREE",
      deviceLimit: 1,
      dataLimit: 1, // 1GB
      durationLimit: 60, // 60 hours
      startDate: now,
      endDate,
      isActive: true,
      autoRenew: false,
      price: 0,
      currency: "USD",
      features: ["1 Device", "1GB Data", "Basic Support"],
    };
  }

  /**
   * Default usage stats when API is not available
   */
  private getDefaultUsageStats(subscription: UserSubscription): UserUsageStats {
    return {
      subscription,
      deviceUsages: [],
      totalDevicesUsed: 0,
      totalDataUsedThisMonth: 0,
      totalTimeConnectedThisMonth: 0,
      remainingDevices: subscription.deviceLimit,
      remainingData: subscription.dataLimit * 1024 * 1024 * 1024, // Convert GB to bytes
      remainingTime: subscription.durationLimit * 60, // Convert hours to minutes
      daysUntilExpiry: this.getDaysUntilExpiry(subscription.endDate),
      usagePercentage: {
        devices: 0,
        data: 0,
        time: 0,
      },
    };
  }

  /**
   * Get current subscription (cached)
   */
  getCurrentSubscription(): UserSubscription | null {
    return this.currentSubscription;
  }

  /**
   * Get current usage stats (cached)
   */
  getCurrentUsageStats(): UserUsageStats | null {
    return this.usageStats;
  }

  /**
   * Clear cached data (useful for refresh)
   */
  clearCache(): void {
    this.currentSubscription = null;
    this.usageStats = null;
  }
}

export const subscriptionService = new SubscriptionService();
