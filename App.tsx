import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import "./global.css";

import { AUTH_CONFIG } from "./src/lib/constants";
import { VPNConnection } from "./src/components/vpn/VPNConnection";
import { SplashScreen } from "./src/components/ui/SplashScreenSimple";
import { AuthFlow } from "./src/screens/auth/AuthFlow";
import { UserProfileScreen } from "./src/screens/UserProfileScreen";

// Create a token cache for Clerk
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("SecureStore get item error: ", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("SecureStore save item error: ", err);
    }
  },
};

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const MainApp: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  if (!isLoaded) {
    return <SplashScreen />;
  }

  if (!isSignedIn) {
    return <AuthFlow />;
  }

  if (showProfile) {
    return <UserProfileScreen onClose={() => setShowProfile(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowProfile(true)}
        >
          <Ionicons name="person-circle-outline" size={28} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VPNConnection />
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("App mounted, splash screen will show for 2 seconds");
    // Reduced timeout for faster loading during development
    const timer = setTimeout(() => {
      console.log("Splash screen timeout completed, transitioning to main app");
      setIsLoading(false);
    }, 2000); // Reduced to 2 seconds for faster testing

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    console.log("Showing splash screen");
    return <SplashScreen />;
  }

  console.log("App fully loaded, showing main content");
  return (
    <ClerkProvider
      publishableKey={AUTH_CONFIG.clerkPublishableKey}
      tokenCache={tokenCache}
      signInFallbackRedirectUrl={AUTH_CONFIG.afterSignInUrl}
      signUpFallbackRedirectUrl={AUTH_CONFIG.afterSignUpUrl}
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <MainApp />
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  profileButton: {
    padding: 8,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 50,
  },
});
