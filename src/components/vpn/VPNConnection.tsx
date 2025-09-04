/**
 * Enhanced VPN Connection Component
 * Clean connection screen with large circular Connect button and modular components
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS, VPN_SERVERS, VPN_PROTOCOLS } from "../../lib/constants";
import { useVPN } from "../../hooks/useVPN";
import { ServerSelection } from "./ServerSelection";
import { ConnectButton } from "./ConnectButton";
import { ProtocolToggle } from "./ProtocolToggle";
import { Ionicons } from "@expo/vector-icons";

interface VPNConnectionProps {
  // Optional legacy props for backward compatibility
  onConnect?: (
    _serverId: string,
    _protocol: keyof typeof VPN_PROTOCOLS
  ) => void;
  onDisconnect?: () => void;
}

export const VPNConnection: React.FC<VPNConnectionProps> = ({
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

  const handleProtocolChange = (protocol: keyof typeof VPN_PROTOCOLS) => {
    setSelectedProtocol(protocol);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AndVPN</Text>
          <Text style={styles.subtitle}>
            {isConnected ? "Protected" : "Not Protected"}
          </Text>
        </View>

        {/* Protocol Toggle */}
        <ProtocolToggle
          selectedProtocol={selectedProtocol}
          onProtocolChange={handleProtocolChange}
          disabled={isConnected || isConnecting}
        />

        {/* Server Selection */}
        <View style={styles.serverSection}>
          <Text style={styles.sectionLabel}>Server Location</Text>
          <TouchableOpacity
            style={styles.serverSelector}
            onPress={() => setShowServerSelection(true)}
            disabled={isConnected || isConnecting}
          >
            <View style={styles.serverInfo}>
              <View style={styles.serverFlag}>
                <Text style={styles.flagEmoji}>{server.flag}</Text>
              </View>
              <View style={styles.serverDetails}>
                <Text style={styles.serverName}>{server.name}</Text>
                <Text style={styles.serverLocation}>{server.location}</Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={COLORS.gray[400]}
            />
          </TouchableOpacity>
        </View>

        {/* Connect Button */}
        <ConnectButton
          status={vpnStatus.status}
          onPress={handleToggleConnection}
          disabled={isLoading}
          protocol={selectedProtocol}
          serverName={server.name}
        />

        {/* Connection Stats */}
        {isConnected && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Upload</Text>
              <Text style={styles.statValue}>
                {formatBytes(vpnStatus.bytesSent || 0)}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Download</Text>
              <Text style={styles.statValue}>
                {formatBytes(vpnStatus.bytesReceived || 0)}
              </Text>
            </View>
          </View>
        )}

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.error[500]} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Server Selection Modal */}
      <ServerSelection
        visible={showServerSelection}
        onClose={() => setShowServerSelection(false)}
        onServerSelect={(serverId: string) => {
          setSelectedServer(serverId);
          setShowServerSelection(false);
        }}
        selectedServer={selectedServer}
        selectedProtocol={selectedProtocol}
        onProtocolChange={setSelectedProtocol}
      />
    </ScrollView>
  );
};

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.gray[600],
  },
  serverSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  serverSelector: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  serverFlag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 20,
  },
  serverDetails: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[800],
    marginBottom: 2,
  },
  serverLocation: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 20,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray[800],
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error[500],
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.error[600],
    marginLeft: 12,
    lineHeight: 20,
  },
});
