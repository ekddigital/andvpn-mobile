/**
 * VPN Hook - React hook for VPN functionality
 * Integrates VPN service with React components
 */

import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { vpnService, VPNStatus, VPNDevice } from "../services/vpn-service";
import { VPN_PROTOCOLS } from "../lib/constants";

export interface UseVPNReturn {
  // Status
  status: VPNStatus;
  isConnected: boolean;
  isConnecting: boolean;
  currentDevice: VPNDevice | null;

  // Actions
  connect: (
    _serverId: string,
    _protocol: keyof typeof VPN_PROTOCOLS,
    _deviceName?: string
  ) => Promise<void>;
  disconnect: () => Promise<void>;

  // Device management
  devices: VPNDevice[];
  refreshDevices: () => Promise<void>;

  // Server testing
  testServer: (_serverId: string) => Promise<boolean>;

  // Loading states
  isLoading: boolean;
  error: string | null;
}

export const useVPN = (): UseVPNReturn => {
  const { user, isSignedIn } = useUser();

  // State
  const [status, setStatus] = useState<VPNStatus>(vpnService.getStatus());
  const [devices, setDevices] = useState<VPNDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<VPNDevice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const isConnected = status.status === "ACTIVE";
  const isConnecting = status.status === "CONNECTING";

  /**
   * Refresh devices list
   */
  const refreshDevices = useCallback(async (): Promise<void> => {
    if (!isSignedIn) return;

    try {
      setError(null);
      const userDevices = await vpnService.getDevices();
      setDevices(userDevices);

      // Set current device if we have one active
      const activeDevice = userDevices.find(
        (device) => device.status === "ACTIVE"
      );
      setCurrentDevice(activeDevice || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load devices";
      setError(errorMessage);
      console.error("Error refreshing devices:", err);
    }
  }, [isSignedIn]);

  // Initialize VPN service when user signs in
  useEffect(() => {
    if (isSignedIn && user) {
      // For now, we'll handle auth in the API client
      // The API client will use Clerk's session for authentication
      console.log("User signed in, VPN service ready");
    }
  }, [isSignedIn, user]);

  // Subscribe to status changes
  useEffect(() => {
    const unsubscribe = vpnService.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setError(null); // Clear errors on status change
    });

    return unsubscribe;
  }, []);

  // Load devices on mount
  useEffect(() => {
    if (isSignedIn) {
      refreshDevices().catch(console.error);
    }
  }, [isSignedIn, refreshDevices]);

  /**
   * Connect to VPN server
   */
  const connect = useCallback(
    async (
      serverId: string,
      protocol: keyof typeof VPN_PROTOCOLS,
      deviceName?: string
    ): Promise<void> => {
      if (!isSignedIn) {
        setError("Please sign in to use VPN");
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        await vpnService.connect(serverId, protocol, deviceName);

        // Refresh devices to get updated info
        await refreshDevices();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to connect to VPN";
        setError(errorMessage);

        // Show user-friendly error alert
        Alert.alert("Connection Failed", errorMessage, [{ text: "OK" }]);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignedIn, refreshDevices]
  );

  /**
   * Disconnect from VPN
   */
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setIsLoading(true);

      await vpnService.disconnect();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect from VPN";
      setError(errorMessage);

      Alert.alert("Disconnection Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Test server connectivity
   */
  const testServer = useCallback(async (serverId: string): Promise<boolean> => {
    try {
      return await vpnService.testServerConnectivity(serverId);
    } catch (err) {
      console.error("Error testing server connectivity:", err);
      return false;
    }
  }, []);

  return {
    // Status
    status,
    isConnected,
    isConnecting,
    currentDevice,

    // Actions
    connect,
    disconnect,

    // Device management
    devices,
    refreshDevices,

    // Server testing
    testServer,

    // Loading states
    isLoading,
    error,
  };
};

export default useVPN;
