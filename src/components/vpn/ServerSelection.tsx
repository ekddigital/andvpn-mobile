/**
 * VPN Server Selection Component
 * Allows users to select server location and protocol
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import {
  VPN_SERVERS,
  VPN_REGIONS,
  VPN_PROTOCOLS,
  COLORS,
} from "../../lib/constants";

// Type definition for server objects (used implicitly by VPN_SERVERS values)
// eslint-disable-next-line no-unused-vars
interface Server {
  id: string;
  name: string;
  location: string;
  region: string;
  priority: number;
  endpoints: {
    wireguard: string;
    openvpn: string;
  };
  flag: string;
}

interface ServerSelectionProps {
  selectedServer?: string;
  selectedProtocol?: keyof typeof VPN_PROTOCOLS;
  // eslint-disable-next-line no-unused-vars
  onServerSelect: (serverId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onProtocolChange: (protocol: keyof typeof VPN_PROTOCOLS) => void;
  visible: boolean;
  onClose: () => void;
}

export const ServerSelection: React.FC<ServerSelectionProps> = ({
  selectedServer = "us-east-1",
  selectedProtocol = "WIREGUARD",
  onServerSelect,
  onProtocolChange,
  visible,
  onClose,
}) => {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const getServersByRegion = (region: string) => {
    const regionConfig = VPN_REGIONS[region as keyof typeof VPN_REGIONS];
    if (!regionConfig) return [];

    return regionConfig.servers
      .map((serverId) => VPN_SERVERS[serverId as keyof typeof VPN_SERVERS])
      .sort((a, b) => b.priority - a.priority);
  };

  const handleServerSelect = (serverId: string) => {
    onServerSelect(serverId);
    onClose();
  };

  const renderProtocolSelector = () => (
    <View style={styles.protocolContainer}>
      <Text style={styles.sectionTitle}>Select Protocol</Text>
      <View style={styles.protocolButtons}>
        <TouchableOpacity
          style={[
            styles.protocolButton,
            selectedProtocol === "WIREGUARD" && styles.protocolButtonActive,
          ]}
          onPress={() => onProtocolChange("WIREGUARD")}
        >
          <Text
            style={[
              styles.protocolButtonText,
              selectedProtocol === "WIREGUARD" &&
                styles.protocolButtonTextActive,
            ]}
          >
            WireGuard
          </Text>
          <Text style={styles.protocolDescription}>Fast & Modern</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.protocolButton,
            selectedProtocol === "OPENVPN" && styles.protocolButtonActive,
          ]}
          onPress={() => onProtocolChange("OPENVPN")}
        >
          <Text
            style={[
              styles.protocolButtonText,
              selectedProtocol === "OPENVPN" && styles.protocolButtonTextActive,
            ]}
          >
            OpenVPN
          </Text>
          <Text style={styles.protocolDescription}>Reliable & Secure</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServerList = () => (
    <View style={styles.serverContainer}>
      <Text style={styles.sectionTitle}>Select Server Location</Text>

      {Object.entries(VPN_REGIONS).map(([regionId, regionConfig]) => {
        const servers = getServersByRegion(regionId);
        const isActive = activeRegion === regionId;

        return (
          <View key={regionId} style={styles.regionContainer}>
            <TouchableOpacity
              style={styles.regionHeader}
              onPress={() => setActiveRegion(isActive ? null : regionId)}
            >
              <Text style={styles.regionTitle}>{regionConfig.name}</Text>
              <Text style={styles.regionToggle}>{isActive ? "−" : "+"}</Text>
            </TouchableOpacity>

            {isActive && (
              <View style={styles.serverList}>
                {servers.map((server) => (
                  <TouchableOpacity
                    key={server.id}
                    style={[
                      styles.serverItem,
                      selectedServer === server.id && styles.serverItemSelected,
                    ]}
                    onPress={() => handleServerSelect(server.id)}
                  >
                    <View style={styles.serverInfo}>
                      <Text style={styles.serverFlag}>{server.flag}</Text>
                      <View style={styles.serverDetails}>
                        <Text style={styles.serverName}>{server.name}</Text>
                        <Text style={styles.serverLocation}>
                          {server.location}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.serverPriority}>
                      <Text style={styles.priorityText}>
                        {server.priority >= 90
                          ? "⚡"
                          : server.priority >= 80
                          ? "🟢"
                          : "🟡"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>VPN Configuration</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderProtocolSelector()}
          {renderServerList()}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gray[900],
  },
  closeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: COLORS.primary[600],
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[800],
    marginBottom: 15,
  },
  protocolContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  protocolButtons: {
    flexDirection: "row",
    gap: 12,
  },
  protocolButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    alignItems: "center",
  },
  protocolButtonActive: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  protocolButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray[700],
  },
  protocolButtonTextActive: {
    color: COLORS.primary[700],
  },
  protocolDescription: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 4,
  },
  serverContainer: {
    padding: 20,
  },
  regionContainer: {
    marginBottom: 20,
  },
  regionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
  },
  regionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[800],
  },
  regionToggle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.gray[600],
  },
  serverList: {
    marginTop: 8,
  },
  serverItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  serverItemSelected: {
    borderColor: COLORS.primary[600],
    backgroundColor: COLORS.primary[50],
  },
  serverInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  serverFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  serverDetails: {
    flex: 1,
  },
  serverName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray[900],
  },
  serverLocation: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  serverPriority: {
    alignItems: "center",
  },
  priorityText: {
    fontSize: 16,
  },
});
