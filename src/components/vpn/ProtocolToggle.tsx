/**
 * Protocol Toggle Component
 * Clean, user-friendly toggle for switching between WireGuard and OpenVPN
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, VPN_PROTOCOLS } from "../../lib/constants";

interface ProtocolToggleProps {
  selectedProtocol: keyof typeof VPN_PROTOCOLS;
  onProtocolChange: (_protocol: keyof typeof VPN_PROTOCOLS) => void;
  disabled?: boolean;
}

export const ProtocolToggle: React.FC<ProtocolToggleProps> = ({
  selectedProtocol,
  onProtocolChange,
  disabled = false,
}) => {
  const isWireGuard = selectedProtocol === "WIREGUARD";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Protocol</Text>

      <View style={styles.toggleContainer}>
        {/* WireGuard Option */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftButton,
            isWireGuard && styles.activeButton,
            disabled && styles.disabledButton,
          ]}
          onPress={() => !disabled && onProtocolChange("WIREGUARD")}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              isWireGuard && styles.activeText,
              disabled && styles.disabledText,
            ]}
          >
            WireGuard
          </Text>
          <Text
            style={[
              styles.descriptionText,
              isWireGuard && styles.activeDescriptionText,
              disabled && styles.disabledText,
            ]}
          >
            Fast & Modern
          </Text>
        </TouchableOpacity>

        {/* OpenVPN Option */}
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.rightButton,
            !isWireGuard && styles.activeButton,
            disabled && styles.disabledButton,
          ]}
          onPress={() => !disabled && onProtocolChange("OPENVPN")}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              !isWireGuard && styles.activeText,
              disabled && styles.disabledText,
            ]}
          >
            OpenVPN
          </Text>
          <Text
            style={[
              styles.descriptionText,
              !isWireGuard && styles.activeDescriptionText,
              disabled && styles.disabledText,
            ]}
          >
            Proven & Stable
          </Text>
        </TouchableOpacity>
      </View>

      {/* Protocol Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {isWireGuard
            ? "WireGuard offers superior performance and battery efficiency"
            : "OpenVPN provides maximum compatibility and reliability"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[700],
    marginBottom: 12,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderRadius: 8,
    minHeight: 60,
    justifyContent: "center",
  },
  leftButton: {
    marginRight: 2,
  },
  rightButton: {
    marginLeft: 2,
  },
  activeButton: {
    backgroundColor: COLORS.primary[600],
    shadowColor: COLORS.primary[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.gray[600],
    marginBottom: 2,
  },
  activeText: {
    color: "white",
  },
  disabledText: {
    color: COLORS.gray[400],
  },
  descriptionText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.gray[500],
  },
  activeDescriptionText: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray[50],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary[500],
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray[600],
    lineHeight: 16,
    textAlign: "center",
  },
});
