import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator } from "react-native";

export const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple timer to show splash for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onFinish) {
        onFinish();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Main logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App name and tagline */}
        <Text style={styles.appName}>AndVPN</Text>
        <Text style={styles.tagline}>Secure. Private. Global.</Text>
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>
            Initializing secure connection...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "white",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "#cbd5e1",
    fontWeight: "600",
    letterSpacing: 2,
    textAlign: "center",
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 120,
    width: "100%",
  },
  loadingText: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
    letterSpacing: 1,
    textAlign: "center",
    opacity: 0.8,
  },
});
