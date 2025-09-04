/**
 * Connect Button Component
 * Large circular connect button with beautiful animations and states
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../lib/constants";
import { VPNStatus } from "../../services/vpn-service";

interface ConnectButtonProps {
  status: VPNStatus["status"];
  onPress: () => void;
  disabled?: boolean;
  protocol: string;
  serverName?: string;
}

const { width } = Dimensions.get("window");
const BUTTON_SIZE = Math.min(width * 0.5, 200);

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  status,
  onPress,
  disabled = false,
  protocol,
  serverName,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  // Animation for connecting state
  React.useEffect(() => {
    if (status === "CONNECTING") {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      pulse.start();
      rotate.start();

      return () => {
        pulse.stop();
        rotate.stop();
      };
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [status, pulseAnim, rotateAnim]);

  const getButtonConfig = () => {
    switch (status) {
      case "ACTIVE":
        return {
          colors: [COLORS.success[500], COLORS.success[600]] as const,
          icon: "shield-checkmark" as const,
          text: "Connected",
          subtext: `Secured via ${protocol}`,
        };
      case "CONNECTING":
        return {
          colors: [COLORS.warning[500], COLORS.warning[600]] as const,
          icon: "sync" as const,
          text: "Connecting...",
          subtext: `Establishing ${protocol} tunnel`,
        };
      case "ERROR":
        return {
          colors: [COLORS.error[500], COLORS.error[600]] as const,
          icon: "alert-circle" as const,
          text: "Connection Error",
          subtext: "Tap to retry connection",
        };
      case "BLOCKED":
        return {
          colors: [COLORS.error[500], COLORS.error[600]] as const,
          icon: "shield" as const,
          text: "Blocked",
          subtext: "Connection is blocked",
        };
      default: // DISCONNECTED
        return {
          colors: [COLORS.primary[500], COLORS.primary[600]] as const,
          icon: "shield-outline" as const,
          text: "Connect",
          subtext: serverName ? `Connect to ${serverName}` : "Tap to connect",
        };
    }
  };

  const config = getButtonConfig();
  const isLoading = status === "CONNECTING";

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <View style={styles.container}>
      {/* Connection Status Info */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{config.text}</Text>
        <Text style={styles.subtextText}>{config.subtext}</Text>
      </View>

      {/* Main Connect Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
          disabled && styles.disabledContainer,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          disabled={disabled || isLoading}
          activeOpacity={0.8}
          style={styles.touchableButton}
        >
          <LinearGradient
            colors={config.colors}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Outer Ring for Connected State */}
            {status === "ACTIVE" && <View style={styles.outerRing} />}

            {/* Icon */}
            <Animated.View
              style={[
                styles.iconContainer,
                isLoading && {
                  transform: [{ rotate: rotateInterpolate }],
                },
              ]}
            >
              <Ionicons name={config.icon} size={48} color="white" />
            </Animated.View>

            {/* Connection Indicator */}
            {status === "ACTIVE" && (
              <View style={styles.connectedIndicator}>
                <View style={styles.indicatorDot} />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Protocol Badge */}
      <View style={styles.protocolBadge}>
        <Text style={styles.protocolText}>{protocol}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 30,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.gray[800],
    marginBottom: 4,
  },
  subtextText: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: "center",
  },
  buttonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    marginBottom: 16,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  touchableButton: {
    width: "100%",
    height: "100%",
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  outerRing: {
    position: "absolute",
    width: BUTTON_SIZE + 20,
    height: BUTTON_SIZE + 20,
    borderRadius: (BUTTON_SIZE + 20) / 2,
    borderWidth: 3,
    borderColor: COLORS.success[500],
    top: -10,
    left: -10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  connectedIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success[500],
  },
  protocolBadge: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  protocolText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray[700],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
