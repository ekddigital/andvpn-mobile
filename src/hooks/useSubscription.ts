/**
 * useSubscription hook - React hook for subscription management
 */

import { useState, useEffect, useCallback } from "react";
import { subscriptionService } from "../services/subscription-service";
import { UserSubscription, UserUsageStats } from "../types/subscription";

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [usageStats, setUsageStats] = useState<UserUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscriptionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📊 Loading subscription and usage data...");

      const [subscriptionData, usageData] = await Promise.all([
        subscriptionService.getUserSubscription(),
        subscriptionService.getUserUsageStats(),
      ]);

      setSubscription(subscriptionData);
      setUsageStats(usageData);

      console.log("✅ Subscription data loaded successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load subscription data";
      console.error("❌ Error loading subscription:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    subscriptionService.clearCache();
    await loadSubscriptionData();
  }, [loadSubscriptionData]);

  const checkCanAddDevice = useCallback(async () => {
    return await subscriptionService.canAddDevice();
  }, []);

  useEffect(() => {
    loadSubscriptionData();
  }, [loadSubscriptionData]);

  return {
    subscription,
    usageStats,
    loading,
    error,
    refreshData,
    checkCanAddDevice,
    formatDataUsage: subscriptionService.formatDataUsage,
    formatConnectionTime: subscriptionService.formatConnectionTime,
    getDaysUntilExpiry: subscriptionService.getDaysUntilExpiry,
  };
}
