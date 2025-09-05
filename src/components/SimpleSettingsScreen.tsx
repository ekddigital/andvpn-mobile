/**
 * Simple Settings Screen for subscription and usage display
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading subscription data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
        <TouchableOpacity onPress={refreshData}>
          <Text>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <Text>
          Email: {user?.primaryEmailAddress?.emailAddress || "Not available"}
        </Text>
        <Text>User ID: {user?.id || "Not available"}</Text>
      </View>

      {/* Subscription Info */}
      {subscription && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Details</Text>
          <Text>Plan: {subscription.planName}</Text>
          <Text>Status: {subscription.isActive ? "Active" : "Inactive"}</Text>
          <Text>Device Limit: {subscription.deviceLimit} devices</Text>
          <Text>
            Data Limit:{" "}
            {subscription.dataLimit === -1
              ? "Unlimited"
              : `${subscription.dataLimit}GB`}
          </Text>
          <Text>
            Expires: {new Date(subscription.endDate).toLocaleDateString()}
          </Text>
          <Text>Price: ${subscription.price.toFixed(2)}</Text>
        </View>
      )}

      {/* Usage Stats */}
      {usageStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage This Month</Text>
          <Text>
            Devices Used: {usageStats.totalDevicesUsed} /{" "}
            {subscription?.deviceLimit}
          </Text>
          <Text>
            Data Used: {formatDataUsage(usageStats.totalDataUsedThisMonth)}
          </Text>
          <Text>
            Connection Time:{" "}
            {formatConnectionTime(usageStats.totalTimeConnectedThisMonth)}
          </Text>
          <Text>Days Until Expiry: {usageStats.daysUntilExpiry}</Text>
        </View>
      )}

      {/* Device Usage */}
      {usageStats?.deviceUsages && usageStats.deviceUsages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Usage Details</Text>
          {usageStats.deviceUsages.map((device) => (
            <View key={device.deviceId} style={styles.deviceCard}>
              <Text style={styles.deviceName}>{device.deviceName}</Text>
              <Text>Data: {formatDataUsage(device.dataUsedThisMonth)}</Text>
              <Text>
                Time: {formatConnectionTime(device.timeConnectedThisMonth)}
              </Text>
              <Text>
                Status:{" "}
                {device.isCurrentlyConnected ? "Connected" : "Disconnected"}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.button} onPress={refreshData}>
          <Text style={styles.buttonText}>Refresh Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signOutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  deviceCard: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
