/**
 * VPN Connection Status Component
 * Shows current connection status and allows connect/disconnect
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { COLORS, STATUS_COLORS, CONNECTION_STATUS } from "../../lib/constants";

interface ConnectionStatusProps {
  status?: keyof typeof CONNECTION_STATUS;
  onConnect?: () => void;
  onDisconnect?: () => void;
  serverLocation?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status = "DISCONNECTED",
  onConnect,
  onDisconnect,
  serverLocation = "United States",
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleToggleConnection = async () => {
    if (status === "ACTIVE") {
      onDisconnect?.();
    } else {
      setIsConnecting(true);
      try {
        await onConnect?.();
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
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
    return CONNECTION_STATUS[status] || "Disconnected";
  };

  const getButtonText = () => {
    if (isConnecting || status === "CONNECTING") {
      return "Connecting...";
    }
    return status === "ACTIVE" ? "Disconnect" : "Connect";
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor() },
          ]}
        />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {status === "ACTIVE" && (
        <Text style={styles.serverLocation}>
          Connected to: {serverLocation}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.connectButton,
          {
            backgroundColor:
              status === "ACTIVE" ? STATUS_COLORS.BLOCKED : COLORS.primary[600],
          },
        ]}
        onPress={handleToggleConnection}
        disabled={isConnecting || status === "CONNECTING"}
      >
        {(isConnecting || status === "CONNECTING") && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={styles.loadingIndicator}
          />
        )}
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray[800],
  },
  serverLocation: {
    fontSize: 14,
    color: COLORS.primary[600],
    marginBottom: 20,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 160,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIndicator: {
    marginRight: 8,
  },
});
