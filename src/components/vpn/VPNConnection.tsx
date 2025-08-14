/**
 * Enhanced VPN Connection Component
 * Main VPN interface with protocol switching and server selection
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import {
  COLORS,
  STATUS_COLORS,
  CONNECTION_STATUS,
  VPN_SERVERS,
  VPN_PROTOCOLS,
} from "../../lib/constants";
import { useVPN } from "../../hooks/useVPN";
import { ServerSelection } from "./ServerSelection";

interface VPNConnectionProps {
  // Props are now optional since we use the hook
  status?: keyof typeof CONNECTION_STATUS;
  onConnect?: (serverId: string, protocol: keyof typeof VPN_PROTOCOLS) => void;
  onDisconnect?: () => void;
}

export const VPNConnection: React.FC<VPNConnectionProps> = ({
  // Legacy props for backwards compatibility
  status: legacyStatus,
  onConnect: legacyOnConnect,
  onDisconnect: legacyOnDisconnect,
}) => {
  // Use VPN hook for real functionality
  const {
    status: vpnStatus,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    isLoading,
    error,
    testServer,
  } = useVPN();

  const [selectedServer, setSelectedServer] = useState("us-east-1");
  const [selectedProtocol, setSelectedProtocol] =
    useState<keyof typeof VPN_PROTOCOLS>("WIREGUARD");
  const [showServerSelection, setShowServerSelection] = useState(false);

  // Use hook status or fallback to legacy prop
  const currentStatus =
    vpnStatus.status === "DISCONNECTED"
      ? "DISCONNECTED"
      : vpnStatus.status === "ACTIVE"
      ? "ACTIVE"
      : vpnStatus.status === "CONNECTING"
      ? "CONNECTING"
      : vpnStatus.status === "BLOCKED"
      ? "BLOCKED"
      : legacyStatus || "DISCONNECTED";

  const server = VPN_SERVERS[selectedServer as keyof typeof VPN_SERVERS];

  const handleToggleConnection = async () => {
    if (isConnected) {
      // Disconnect
      if (legacyOnDisconnect) {
        legacyOnDisconnect();
      } else {
        await disconnect();
      }
    } else {
      // Connect
      if (legacyOnConnect) {
        legacyOnConnect(selectedServer, selectedProtocol);
      } else {
        // Test server connectivity first
        const isServerReachable = await testServer(selectedServer);
        if (!isServerReachable) {
          Alert.alert(
            "Server Unavailable",
            `The selected server (${server.name}) appears to be unreachable. Would you like to try anyway?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Try Anyway",
                onPress: () =>
                  connect(
                    selectedServer,
                    selectedProtocol,
                    `AndVPN-Mobile-${Date.now()}`
                  ),
              },
            ]
          );
          return;
        }

        await connect(
          selectedServer,
          selectedProtocol,
          `AndVPN-Mobile-${Date.now()}`
        );
      }
    }
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case "ACTIVE":
        return STATUS_COLORS.ACTIVE;
      case "CONNECTING":
        return COLORS.warning[500];
      case "BLOCKED":
        return STATUS_COLORS.BLOCKED;
      default:
        return COLORS.gray[300];
    }
  };

  const getStatusText = () => {
    return (
      CONNECTION_STATUS[currentStatus as keyof typeof CONNECTION_STATUS] ||
      "Disconnected"
    );
  };

  const getButtonText = () => {
    if (isConnecting || isLoading || currentStatus === "CONNECTING") {
      return "Connecting...";
    }
    return currentStatus === "ACTIVE" ? "Disconnect" : "Connect";
  };

  const handleProtocolToggle = () => {
    if (currentStatus !== "ACTIVE" && currentStatus !== "CONNECTING") {
      setSelectedProtocol(
        selectedProtocol === "WIREGUARD" ? "OPENVPN" : "WIREGUARD"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicatorContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor() },
            ]}
          />
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {/* Protocol Selector */}
      <View style={styles.protocolContainer}>
        <Text style={styles.sectionLabel}>Protocol</Text>
        <View style={styles.protocolSelector}>
          <Text style={styles.protocolText}>WireGuard</Text>
          <Switch
            value={selectedProtocol === "OPENVPN"}
            onValueChange={handleProtocolToggle}
            disabled={
              currentStatus === "ACTIVE" || currentStatus === "CONNECTING"
            }
            trackColor={{
              false: COLORS.primary[100],
              true: COLORS.warning[500],
            }}
            thumbColor={
              selectedProtocol === "OPENVPN"
                ? COLORS.warning[600]
                : COLORS.primary[600]
            }
          />
          <Text style={styles.protocolText}>OpenVPN</Text>
        </View>
        <Text style={styles.protocolDescription}>
          {selectedProtocol === "WIREGUARD"
            ? "Fast, modern VPN protocol"
            : "Reliable, proven VPN protocol"}
        </Text>
      </View>

      {/* Server Selection */}
      <TouchableOpacity
        style={styles.serverContainer}
        onPress={() => setShowServerSelection(true)}
        disabled={currentStatus === "ACTIVE" || currentStatus === "CONNECTING"}
      >
        <Text style={styles.sectionLabel}>Server Location</Text>
        <View style={styles.serverInfo}>
          <Text style={styles.serverFlag}>{server?.flag}</Text>
          <View style={styles.serverDetails}>
            <Text style={styles.serverName}>{server?.name}</Text>
            <Text style={styles.serverLocation}>{server?.location}</Text>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </View>
      </TouchableOpacity>

      {/* Connection Display for Active Connection */}
      {currentStatus === "ACTIVE" && (
        <View style={styles.connectionInfo}>
          <View style={styles.connectionRow}>
            <Text style={styles.connectionLabel}>Protocol:</Text>
            <Text style={styles.connectionValue}>{selectedProtocol}</Text>
          </View>
          <View style={styles.connectionRow}>
            <Text style={styles.connectionLabel}>Endpoint:</Text>
            <Text style={styles.connectionValue}>
              {
                server?.endpoints[
                  selectedProtocol.toLowerCase() as keyof typeof server.endpoints
                ]
              }
            </Text>
          </View>
        </View>
      )}

      {/* Main Connect Button */}
      <TouchableOpacity
        style={[
          styles.connectButton,
          {
            backgroundColor:
              currentStatus === "ACTIVE"
                ? STATUS_COLORS.BLOCKED
                : COLORS.primary[600],
          },
        ]}
        onPress={handleToggleConnection}
        disabled={isConnecting || isLoading || currentStatus === "CONNECTING"}
      >
        {(isConnecting || isLoading || currentStatus === "CONNECTING") && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.loadingIndicator}
          />
        )}
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Server Selection Modal */}
      <ServerSelection
        visible={showServerSelection}
        selectedServer={selectedServer}
        selectedProtocol={selectedProtocol}
        onServerSelect={setSelectedServer}
        onProtocolChange={setSelectedProtocol}
        onClose={() => setShowServerSelection(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  statusIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.gray[800],
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  protocolContainer: {
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  protocolSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 5,
  },
  protocolText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.gray[700],
  },
  protocolDescription: {
    fontSize: 12,
    color: COLORS.gray[500],
    textAlign: "center",
  },
  serverContainer: {
    width: "100%",
    marginBottom: 30,
  },
  serverInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  serverFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  serverDetails: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[900],
  },
  serverLocation: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  changeText: {
    fontSize: 14,
    color: COLORS.primary[600],
    fontWeight: "500",
  },
  connectionInfo: {
    width: "100%",
    padding: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: COLORS.success[500],
  },
  connectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  connectionLabel: {
    fontSize: 14,
    color: COLORS.gray[600],
    fontWeight: "500",
  },
  connectionValue: {
    fontSize: 14,
    color: COLORS.gray[800],
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    minWidth: 200,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingIndicator: {
    marginRight: 10,
  },
  errorContainer: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fee2e2", // light red background
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fecaca", // light red border
  },
  errorText: {
    color: COLORS.error[700],
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
