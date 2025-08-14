import React, { useEffect, useRef, useState } from "react";
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
        <Stop offset="0%" stopColor="#64748b" />
        <Stop offset="100%" stopColor="#94a3b8" />
      </LinearGradient>
    </Defs>
    <Path
      d="M100 20C120 20 140 25 155 35C170 45 180 60 180 80C180 120 160 140 140 160C120 180 100 210 100 210C100 210 80 180 60 160C40 140 20 120 20 80C20 60 30 45 45 35C60 25 80 20 100 20Z"
      stroke="url(#outlineGradient)"
      strokeWidth="3"
      fill="none"
    />
    {/* Connection dots */}
    <Circle cx="70" cy="100" r="3" fill="#64748b" opacity="0.6" />
    <Circle cx="130" cy="100" r="3" fill="#64748b" opacity="0.6" />
    <Circle cx="100" cy="130" r="3" fill="#64748b" opacity="0.6" />
  </Svg>
);

// Shield Filled Component
const ShieldFilled = ({ size = 120 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 200 240" fill="none">
    <Defs>
      <LinearGradient id="filledGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#3b82f6" />
        <Stop offset="50%" stopColor="#1d4ed8" />
        <Stop offset="100%" stopColor="#1e40af" />
      </LinearGradient>
    </Defs>
    <Path
      d="M100 20C120 20 140 25 155 35C170 45 180 60 180 80C180 120 160 140 140 160C120 180 100 210 100 210C100 210 80 180 60 160C40 140 20 120 20 80C20 60 30 45 45 35C60 25 80 20 100 20Z"
      fill="url(#filledGradient)"
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

export const SplashScreen = () => {
  const [phase, setPhase] = useState<AnimationPhase>("outline");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Phase 1: Outline shield appears with scale and fade
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: Switch to filled shield after 1 second
      setTimeout(() => {
        setPhase("filled");
        Animated.sequence([
          // Brief pulse effect
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Phase 3: Switch to final logo after another second
          setTimeout(() => {
            setPhase("final");

            // Animate final logo appearance
            Animated.parallel([
              Animated.timing(logoFadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              // Gentle rotation for premium feel
              Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Phase 4: Show text and progress
              Animated.parallel([
                Animated.timing(textFadeAnim, {
                  toValue: 1,
                  duration: 500,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: true,
                }),
                Animated.timing(progressAnim, {
                  toValue: 1,
                  duration: 2000,
                  easing: Easing.out(Easing.quad),
                  useNativeDriver: false,
                }),
              ]).start(() => {
                // Complete animation after progress finishes
                setTimeout(() => {
                  setPhase("complete");
                }, 500);
              });
            });
          }, 1000);
        });
      }, 1000);
    });
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const renderLogo = () => {
    const logoStyle = {
      opacity: fadeAnim,
      transform: [
        { scale: Animated.multiply(scaleAnim, pulseAnim) },
        { rotate: phase === "final" ? rotation : "0deg" },
      ],
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
    opacity: 0.8,
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
    width: 80,
    height: 80,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  appName: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    letterSpacing: 2,
    textShadowColor: "rgba(59, 130, 246, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 8,
    fontWeight: "600",
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: 120,
    width: "100%",
  },
  loadingBar: {
    width: 240,
    height: 4,
    backgroundColor: "#334155",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingProgress: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 20,
    fontWeight: "500",
    letterSpacing: 0.5,
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
    width: 3,
    height: 3,
    backgroundColor: "#3b82f6",
    borderRadius: 1.5,
  },
});
