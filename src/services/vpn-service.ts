/**
 * VPN Service - Handles VPN connection logic and API integration
 * Integrates with AndVPN backend API and native VPN implementation
 */

import { apiClient } from "../lib/api-client";
import { VPN_SERVERS, VPN_PROTOCOLS, VPN_CONFIG } from "../lib/constants";
import { nativeVPN, NativeVPNConfig } from "./native-vpn";

export interface VPNDevice {
  id: string;
  name: string;
  publicKey: string;
  privateKey: string;
  ipAddress: string;
  serverId: string;
  protocol: keyof typeof VPN_PROTOCOLS;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

export interface VPNConnectionConfig {
  deviceId: string;
  serverId: string;
  protocol: keyof typeof VPN_PROTOCOLS;
  privateKey: string;
  publicKey: string;
  endpoint: string;
  allowedIPs: string[];
  dns?: string[];
}

export interface VPNStatus {
  status: "ACTIVE" | "CONNECTING" | "DISCONNECTED" | "BLOCKED" | "ERROR";
  serverId?: string;
  protocol?: keyof typeof VPN_PROTOCOLS;
  connectedAt?: string;
  bytesReceived?: number;
  bytesSent?: number;
  lastHandshake?: string;
}

class VPNService {
  private currentDevice: VPNDevice | null = null;
  private connectionStatus: VPNStatus = { status: "DISCONNECTED" };
  // eslint-disable-next-line no-unused-vars
  private statusListeners: ((status: VPNStatus) => void)[] = [];

  /**
   * Create or get existing VPN device
   */
  async createDevice(
    name: string,
    serverId: string,
    protocol: keyof typeof VPN_PROTOCOLS
  ): Promise<VPNDevice> {
    try {
      const server = VPN_SERVERS[serverId as keyof typeof VPN_SERVERS];
      if (!server) {
        throw new Error(`Server ${serverId} not found`);
      }

      // Create device using your backend API
      const response = await apiClient.post(
        "/vpn/devices/create-multi-protocol",
        {
          name,
          serverId,
          protocol: protocol.toLowerCase(),
          region: server.region,
          endpoint:
            server.endpoints[
              protocol.toLowerCase() as keyof typeof server.endpoints
            ],
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create device: ${response.statusText}`);
      }

      const deviceData = await response.json();

      this.currentDevice = {
        id: deviceData.id,
        name: deviceData.name,
        publicKey: deviceData.publicKey,
        privateKey: deviceData.privateKey,
        ipAddress: deviceData.ipAddress,
        serverId,
        protocol,
        status: "INACTIVE",
        createdAt: deviceData.createdAt,
        updatedAt: deviceData.updatedAt,
      };

      return this.currentDevice;
    } catch (error) {
      console.error("Error creating VPN device:", error);
      throw error;
    }
  }

  /**
   * Get device configuration for connection
   */
  async getDeviceConfig(deviceId: string): Promise<VPNConnectionConfig> {
    try {
      const response = await apiClient.get(
        `/vpn/devices/${deviceId}/config-json`
      );

      if (!response.ok) {
        throw new Error(`Failed to get device config: ${response.statusText}`);
      }

      const configData = await response.json();

      return {
        deviceId,
        serverId: configData.serverId,
        protocol:
          configData.protocol.toUpperCase() as keyof typeof VPN_PROTOCOLS,
        privateKey: configData.privateKey,
        publicKey: configData.publicKey,
        endpoint: configData.endpoint,
        allowedIPs: configData.allowedIPs || ["0.0.0.0/0", "::/0"],
        dns: configData.dns || ["1.1.1.1", "8.8.8.8"],
      };
    } catch (error) {
      console.error("Error getting device config:", error);
      throw error;
    }
  }

  /**
   * Connect to VPN server
   */
  async connect(
    serverId: string,
    protocol: keyof typeof VPN_PROTOCOLS,
    deviceName?: string
  ): Promise<void> {
    try {
      this.updateStatus({ status: "CONNECTING", serverId, protocol });

      const server = VPN_SERVERS[serverId as keyof typeof VPN_SERVERS];
      if (!server) {
        throw new Error(`Server ${serverId} not found`);
      }

      // Create or get device if not exists
      if (
        !this.currentDevice ||
        this.currentDevice.serverId !== serverId ||
        this.currentDevice.protocol !== protocol
      ) {
        const name = deviceName || `AndVPN-Mobile-${Date.now()}`;
        await this.createDevice(name, serverId, protocol);
      }

      if (!this.currentDevice) {
        throw new Error("Failed to create or get device");
      }

      // Get device configuration
      const config = await this.getDeviceConfig(this.currentDevice.id);

      // Validate server endpoint using VPN_CONFIG
      const isValidEndpoint = this.validateServerEndpoint(server, protocol);
      if (!isValidEndpoint) {
        throw new Error("Invalid server endpoint configuration");
      }

      // Create native VPN configuration using sensible defaults
      const nativeConfig: NativeVPNConfig = {
        serverEndpoint:
          server.endpoints[
            protocol.toLowerCase() as keyof typeof server.endpoints
          ],
        protocol: protocol.toLowerCase() as "wireguard" | "openvpn",
        credentials: {
          privateKey: config.privateKey,
          publicKey: config.publicKey,
          // For OpenVPN, you might need certificate data instead
          ...(protocol === "OPENVPN" && { certificate: config.privateKey }),
        },
        dns: config.dns || ["1.1.1.1", "8.8.8.8"],
        allowedIPs: config.allowedIPs,
        mtu: 1420,
      };

      // Connect using native VPN implementation
      const success = await nativeVPN.connect(nativeConfig);

      if (!success) {
        throw new Error("Native VPN connection failed");
      }

      // Subscribe to native VPN status changes
      nativeVPN.onStatusChange((nativeStatus) => {
        if (nativeStatus.isConnected) {
          this.updateStatus({
            status: "ACTIVE",
            bytesReceived: nativeStatus.bytesReceived,
            bytesSent: nativeStatus.bytesSent,
            lastHandshake: nativeStatus.lastHandshake?.toISOString(),
          });
        } else {
          this.updateStatus({ status: "DISCONNECTED" });
        }
      });

      this.updateStatus({
        status: "ACTIVE",
        serverId,
        protocol,
        connectedAt: new Date().toISOString(),
      });

      console.log(`Successfully connected to ${server.name} using ${protocol}`);
    } catch (error) {
      console.error("VPN connection error:", error);
      this.updateStatus({ status: "ERROR" });
      throw error;
    }
  }

  /**
   * Disconnect from VPN
   */
  async disconnect(): Promise<void> {
    try {
      // Disconnect using native VPN implementation
      const success = await nativeVPN.disconnect();

      if (!success) {
        console.warn("Native VPN disconnect returned false, but continuing...");
      }

      this.updateStatus({ status: "DISCONNECTED" });
      console.log("VPN disconnected successfully");
    } catch (error) {
      console.error("VPN disconnection error:", error);
      throw error;
    }
  }

  /**
   * Get current VPN status
   */
  getStatus(): VPNStatus {
    return this.connectionStatus;
  }

  /**
   * Subscribe to status changes
   */
  // eslint-disable-next-line no-unused-vars
  onStatusChange(callback: (status: VPNStatus) => void): () => void {
    this.statusListeners.push(callback);

    // Immediately call with current status
    callback(this.connectionStatus);

    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(callback);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get available devices for current user
   */
  async getDevices(): Promise<VPNDevice[]> {
    try {
      const response = await apiClient.get("/vpn/devices");

      if (!response.ok) {
        throw new Error(`Failed to get devices: ${response.statusText}`);
      }

      const devicesData = await response.json();

      return devicesData.map((device: any) => ({
        id: device.id,
        name: device.name,
        publicKey: device.publicKey,
        privateKey: device.privateKey,
        ipAddress: device.ipAddress,
        serverId: device.serverId,
        protocol: device.protocol.toUpperCase() as keyof typeof VPN_PROTOCOLS,
        status: device.status,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
      }));
    } catch (error) {
      console.error("Error getting devices:", error);
      throw error;
    }
  }

  /**
   * Get VPN analytics
   */
  async getAnalytics(): Promise<any> {
    try {
      const response = await apiClient.get("/vpn/analytics");

      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error getting analytics:", error);
      throw error;
    }
  }

  /**
   * Validate server endpoint configuration against VPN_CONFIG
   */
  private validateServerEndpoint(
    server: (typeof VPN_SERVERS)[keyof typeof VPN_SERVERS],
    protocol: keyof typeof VPN_PROTOCOLS
  ): boolean {
    const endpoint =
      server.endpoints[protocol.toLowerCase() as keyof typeof server.endpoints];

    if (!endpoint) {
      return false;
    }

    // Validate against VPN_CONFIG expected patterns
    const protocolConfig =
      VPN_CONFIG[protocol.toLowerCase() as keyof typeof VPN_CONFIG];

    if (!protocolConfig) {
      console.warn(`Unknown protocol configuration: ${protocol}`);
      return false;
    }

    if (protocol === "WIREGUARD") {
      // Validate WireGuard endpoint format and port
      const [, port] = endpoint.split(":");
      return port === "51820" || port === "51821"; // Main or TCP fallback
    } else if (protocol === "OPENVPN") {
      // Validate OpenVPN endpoint format and port
      const [, port] = endpoint.split(":");
      return port === "443" || port === "1194"; // HTTPS or standard OpenVPN
    }

    return false;
  }

  /**
   * Test VPN server connectivity
   */
  async testServerConnectivity(serverId: string): Promise<boolean> {
    try {
      const server = VPN_SERVERS[serverId as keyof typeof VPN_SERVERS];
      if (!server) {
        return false;
      }

      // Use native VPN to test connectivity
      return await nativeVPN.testConnection(server.endpoints.wireguard);
    } catch (error) {
      console.warn(`Server ${serverId} connectivity test failed:`, error);
      return false;
    }
  }

  // Private methods

  private updateStatus(newStatus: Partial<VPNStatus>): void {
    this.connectionStatus = { ...this.connectionStatus, ...newStatus };
    this.statusListeners.forEach((callback) => callback(this.connectionStatus));
  }

  private async simulateConnection(config: VPNConnectionConfig): Promise<void> {
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real implementation, you would:
    // 1. Configure the VPN tunnel with the provided config
    // 2. Start the VPN connection
    // 3. Monitor connection status

    console.log("VPN Connection Config:", {
      protocol: config.protocol,
      endpoint: config.endpoint,
      allowedIPs: config.allowedIPs,
      dns: config.dns,
    });
  }

  private async simulateDisconnection(): Promise<void> {
    // Simulate disconnection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would:
    // 1. Stop the VPN connection
    // 2. Clean up resources
    // 3. Reset network configuration
  }
}

// Export singleton instance
export const vpnService = new VPNService();
export default vpnService;
