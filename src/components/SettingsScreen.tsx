/**
 * Settings Screen - User subscription, usage, and account management
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSubscription } from "../hooks/useSubscription";
import { COLORS } from "../lib/constants";

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const {
    subscription,
    usageStats,
    loading,
    error,
    refreshData,
    formatDataUsage,
    formatConnectionTime,
  } = useSubscription();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading subscription data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? COLORS.success[500] : COLORS.error[500];
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return COLORS.success[500];
    if (percentage < 80) return COLORS.warning[500];
    return COLORS.error[500];
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>
            {user?.primaryEmailAddress?.emailAddress || "Not available"}
          </Text>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.valueSmall}>{user?.id || "Not available"}</Text>
        </View>
      </View>

      {/* Subscription Section */}
      {subscription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Plan</Text>
              <Text style={styles.value}>{subscription.planName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text
                style={[
                  styles.value,
                  { color: getStatusColor(subscription.isActive) },
                ]}
              >
                {subscription.isActive ? "Active" : "Inactive"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Expires</Text>
              <Text style={styles.value}>
                {new Date(subscription.endDate).toLocaleDateString()}
              </Text>
            </View>
            {usageStats && (
              <View style={styles.row}>
                <Text style={styles.label}>Days Remaining</Text>
                <Text
                  style={[
                    styles.value,
                    {
                      color:
                        usageStats.daysUntilExpiry > 7
                          ? Colors.success
                          : Colors.warning,
                    },
                  ]}
                >
                  {usageStats.daysUntilExpiry} days
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Price</Text>
              <Text style={styles.value}>
                {subscription.price > 0
                  ? `$${subscription.price.toFixed(2)}/${
                      subscription.planType === "FREE" ? "trial" : "month"
                    }`
                  : "Free"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Usage Statistics */}
      {usageStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage This Month</Text>
          <View style={styles.card}>
            {/* Device Usage */}
            <View style={styles.usageItem}>
              <Text style={styles.label}>Devices</Text>
              <View style={styles.usageRow}>
                <Text style={styles.usageText}>
                  {usageStats.totalDevicesUsed} / {subscription?.deviceLimit}
                </Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${usageStats.usagePercentage.devices}%`,
                        backgroundColor: getUsageColor(
                          usageStats.usagePercentage.devices
                        ),
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Data Usage */}
            <View style={styles.usageItem}>
              <Text style={styles.label}>Data Usage</Text>
              <View style={styles.usageRow}>
                <Text style={styles.usageText}>
                  {formatDataUsage(usageStats.totalDataUsedThisMonth)} /{" "}
                  {subscription?.dataLimit === -1
                    ? "Unlimited"
                    : formatDataUsage(
                        (subscription?.dataLimit || 0) * 1024 * 1024 * 1024
                      )}
                </Text>
                {subscription?.dataLimit !== -1 && (
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${usageStats.usagePercentage.data}%`,
                          backgroundColor: getUsageColor(
                            usageStats.usagePercentage.data
                          ),
                        },
                      ]}
                    />
                  </View>
                )}
              </View>
            </View>

            {/* Time Usage */}
            <View style={styles.usageItem}>
              <Text style={styles.label}>Connection Time</Text>
              <View style={styles.usageRow}>
                <Text style={styles.usageText}>
                  {formatConnectionTime(usageStats.totalTimeConnectedThisMonth)}{" "}
                  /{" "}
                  {subscription?.durationLimit === -1
                    ? "Unlimited"
                    : formatConnectionTime(
                        (subscription?.durationLimit || 0) * 60
                      )}
                </Text>
                {subscription?.durationLimit !== -1 && (
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${usageStats.usagePercentage.time}%`,
                          backgroundColor: getUsageColor(
                            usageStats.usagePercentage.time
                          ),
                        },
                      ]}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Device Usage Details */}
      {usageStats?.deviceUsages && usageStats.deviceUsages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Usage</Text>
          {usageStats.deviceUsages.map((device) => (
            <View key={device.deviceId} style={styles.card}>
              <Text style={styles.deviceName}>{device.deviceName}</Text>
              <View style={styles.deviceStats}>
                <Text style={styles.deviceStat}>
                  Data: {formatDataUsage(device.dataUsedThisMonth)}
                </Text>
                <Text style={styles.deviceStat}>
                  Time: {formatConnectionTime(device.timeConnectedThisMonth)}
                </Text>
                <Text style={styles.deviceStat}>
                  Status:{" "}
                  {device.isCurrentlyConnected ? "Connected" : "Disconnected"}
                </Text>
                {device.lastConnected && (
                  <Text style={styles.deviceStat}>
                    Last: {new Date(device.lastConnected).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Plan Features */}
      {subscription?.features && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Features</Text>
          <View style={styles.card}>
            {subscription.features.map((feature, index) => (
              <Text key={index} style={styles.feature}>
                • {feature}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  valueSmall: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontFamily: "monospace",
  },
  usageItem: {
    marginBottom: 16,
  },
  usageRow: {
    marginTop: 4,
  },
  usageText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.background.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  deviceStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  deviceStat: {
    fontSize: 12,
    color: Colors.text.secondary,
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  feature: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signOutButton: {
    backgroundColor: Colors.error,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
