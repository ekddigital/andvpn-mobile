import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const useSplashScreen = (isReady: boolean) => {
  useEffect(() => {
    async function prepare() {
      try {
        if (isReady) {
          // Hide the splash screen once the app is ready
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }

    prepare();
  }, [isReady]);
};
