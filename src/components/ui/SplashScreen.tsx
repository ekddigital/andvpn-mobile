import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Animation phases
type AnimationPhase = "outline" | "filled" | "final" | "complete";

// Shield Outline Component
const ShieldOutline = ({ size = 120 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 240" fill="none">
    <Defs>
      <LinearGradient id="outlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#3b82f6" />
        <Stop offset="50%" stopColor="#1d4ed8" />
        <Stop offset="100%" stopColor="#1e40af" />
      </LinearGradient>
    </Defs>
    {/* Subtle shadow */}
    <Path
      d="M100 22C120 22 140 27 155 37C170 47 180 62 180 82C180 122 160 142 140 162C120 182 100 212 100 212C100 212 80 182 60 162C40 142 20 122 20 82C20 62 30 47 45 37C60 27 80 22 100 22Z"
      fill="#e2e8f0"
      opacity="0.3"
    />
    <Path
      d="M100 20C120 20 140 25 155 35C170 45 180 60 180 80C180 120 160 140 140 160C120 180 100 210 100 210C100 210 80 180 60 160C40 140 20 120 20 80C20 60 30 45 45 35C60 25 80 20 100 20Z"
      stroke="url(#outlineGradient)"
      strokeWidth="4"
      fill="none"
    />
    {/* Connection dots */}
    <Circle cx="70" cy="100" r="3" fill="#3b82f6" opacity="0.8" />
    <Circle cx="130" cy="100" r="3" fill="#3b82f6" opacity="0.8" />
    <Circle cx="100" cy="130" r="3" fill="#3b82f6" opacity="0.8" />
  </Svg>
);

// Shield Filled Component
const ShieldFilled = ({ size = 120 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 240" fill="none">
    <Defs>
      <LinearGradient id="filledGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#3b82f6" />
        <Stop offset="30%" stopColor="#2563eb" />
        <Stop offset="70%" stopColor="#1d4ed8" />
        <Stop offset="100%" stopColor="#1e40af" />
      </LinearGradient>
    </Defs>
    {/* Subtle outer shadow */}
    <Path
      d="M100 22C120 22 140 27 155 37C170 47 180 62 180 82C180 122 160 142 140 162C120 182 100 212 100 212C100 212 80 182 60 162C40 142 20 122 20 82C20 62 30 47 45 37C60 27 80 22 100 22Z"
      fill="#94a3b8"
      opacity="0.2"
    />
    <Path
      d="M100 20C120 20 140 25 155 35C170 45 180 60 180 80C180 120 160 140 140 160C120 180 100 210 100 210C100 210 80 180 60 160C40 140 20 120 20 80C20 60 30 45 45 35C60 25 80 20 100 20Z"
      fill="url(#filledGradient)"
    />
    {/* Inner highlight for depth */}
    <Path
      d="M100 25C118 25 135 29 148 38C161 47 170 60 170 78C170 110 155 125 140 140C125 155 100 180 100 180C100 180 75 155 60 140C45 125 30 110 30 78C30 60 39 47 52 38C65 29 82 25 100 25Z"
      fill="rgba(255,255,255,0.1)"
    />
    {/* VPN Symbol */}
    <Path
      d="M70 90L85 105L130 60"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Lock */}
    <Path
      d="M85 130C85 128.9 85.9 128 87 128H113C114.1 128 115 128.9 115 130V150C115 151.1 114.1 152 113 152H87C85.9 152 85 151.1 85 150V130Z"
      fill="white"
    />
    <Path
      d="M90 128V120C90 115.6 93.4 112 97 112H103C106.6 112 110 115.6 110 120V128"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
  </Svg>
);

export const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const [phase, setPhase] = useState<AnimationPhase>("outline");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const startAnimation = useCallback(() => {
    console.log("Starting splash animation sequence");
    // Phase 1: Simple fade and scale in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("Phase 1 complete");
      // Phase 2: Switch to filled shield after 0.8 seconds
      setTimeout(() => {
        console.log("Switching to filled phase");
        setPhase("filled");

        // Phase 3: Switch to final logo after another 0.8 seconds
        setTimeout(() => {
          console.log("Switching to final phase");
          setPhase("final");

          // Show final logo and text
          Animated.parallel([
            Animated.timing(logoFadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(textFadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(progressAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            }),
          ]).start(() => {
            console.log("Animation complete, setting phase to complete");
            setTimeout(() => {
              setPhase("complete");
              if (onFinish) {
                onFinish();
              }
            }, 300);
          });
        }, 800);
      }, 800);
    });
  }, [fadeAnim, scaleAnim, logoFadeAnim, textFadeAnim, progressAnim, onFinish]);

  useEffect(() => {
    console.log("SplashScreen mounted, starting animation");
    startAnimation();
  }, [startAnimation]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const renderLogo = () => {
    const logoStyle = {
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    };

    if (phase === "outline") {
      return (
        <Animated.View style={logoStyle}>
          <ShieldOutline size={140} />
        </Animated.View>
      );
    }

    if (phase === "filled") {
      return (
        <Animated.View style={logoStyle}>
          <ShieldFilled size={140} />
        </Animated.View>
      );
    }

    if (phase === "final" || phase === "complete") {
      return (
        <View style={styles.finalLogoContainer}>
          {/* Background shield with subtle opacity */}
          <Animated.View style={[logoStyle, { position: "absolute" }]}>
            <ShieldFilled size={140} />
          </Animated.View>

          {/* Main logo */}
          <Animated.View style={{ opacity: logoFadeAnim }}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.finalLogo}
              resizeMode="contain"
            />
          </Animated.View>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.backgroundGradient} />

      {/* Main logo area */}
      <View style={styles.logoContainer}>
        {renderLogo()}

        {/* App name and tagline */}
        {(phase === "final" || phase === "complete") && (
          <Animated.View
            style={[styles.textContainer, { opacity: textFadeAnim }]}
          >
            <Text style={styles.appName}>AndVPN</Text>
            <Text style={styles.tagline}>Secure. Private. Global.</Text>
          </Animated.View>
        )}
      </View>

      {/* Loading indicator */}
      {(phase === "final" || phase === "complete") && (
        <Animated.View
          style={[styles.loadingContainer, { opacity: textFadeAnim }]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[styles.loadingProgress, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.loadingText}>
            Initializing secure connection...
          </Text>
        </Animated.View>
      )}

      {/* Subtle particles effect for premium feel */}
      {phase !== "outline" && (
        <View style={styles.particlesContainer}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  left: Math.random() * width,
                  top: Math.random() * height,
                  opacity: fadeAnim,
                },
              ]}
            />
          ))}
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
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1e293b",
    opacity: 0.7,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  finalLogoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  finalLogo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  appName: {
    fontSize: 42,
    fontWeight: "900",
    color: "white",
    letterSpacing: 3,
    textShadowColor: "rgba(59, 130, 246, 0.6)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    color: "#cbd5e1",
    marginTop: 12,
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
    paddingHorizontal: 40,
  },
  loadingBar: {
    width: 280,
    height: 6,
    backgroundColor: "rgba(51, 65, 85, 0.6)",
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 3,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  loadingText: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 24,
    fontWeight: "500",
    letterSpacing: 1,
    textAlign: "center",
    opacity: 0.8,
  },
  particlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
});
