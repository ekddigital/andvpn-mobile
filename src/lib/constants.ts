/**
 * AndVPN Mobile App Constants
 * Centralized configuration for the entire app
 */

import Constants from "expo-constants";

// App Information
export const APP_CONFIG = {
  name: "AndVPN",
  version: "1.0.0",
  supportEmail: "ekd@ekddigital.com",
  website: "https://vpn.andgroupco.com",
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl:
    Constants.expoConfig?.extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    "http://localhost:3000/api",
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
} as const;

// Clerk Configuration
export const AUTH_CONFIG = {
  clerkPublishableKey:
    Constants.expoConfig?.extra?.clerkPublishableKey ||
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "",
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/(tabs)",
  afterSignUpUrl: "/(tabs)",
} as const;

// VPN Server Configuration
export const VPN_CONFIG = {
  wireguard: {
    serverIp: Constants.expoConfig?.extra?.wireguardServerIp || "31.97.41.230",
    serverPort: Constants.expoConfig?.extra?.wireguardServerPort || "51820",
    publicKey: Constants.expoConfig?.extra?.wireguardServerPublicKey || "",
    endpoint:
      Constants.expoConfig?.extra?.wireguardServerEndpoint ||
      "vpn.andgroupco.com:51820",
    tcpPort: Constants.expoConfig?.extra?.wireguardTcpServerPort || "51821",
    tcpPublicKey:
      Constants.expoConfig?.extra?.wireguardTcpServerPublicKey || "",
    tcpEndpoint:
      Constants.expoConfig?.extra?.wireguardTcpServerEndpoint ||
      "vpn.andgroupco.com:51821",
  },
  openvpn: {
    tcpPort: Constants.expoConfig?.extra?.openvpnTcpServerPort || "443",
    endpoint:
      Constants.expoConfig?.extra?.openvpnTcpServerEndpoint ||
      "vpn.andgroupco.com:443",
  },
} as const;

// VPN Protocols
export const VPN_PROTOCOLS = {
  WIREGUARD: "WIREGUARD",
  OPENVPN: "OPENVPN",
} as const;

// VPN Server Locations - Based on your global-peers.conf (ALL 28 SERVERS)
export const VPN_SERVERS = {
  // North America (5 servers)
  "us-east-1": {
    id: "us-east-1",
    name: "US East Virginia",
    location: "Ashburn, VA, USA",
    region: "north-america",
    priority: 100,
    endpoints: {
      wireguard: "us-east-1.vpn.andgroupco.com:51820",
      openvpn: "us-east-1.vpn.andgroupco.com:443",
    },
    flag: "🇺🇸",
  },
  "us-west-1": {
    id: "us-west-1",
    name: "US West California",
    location: "San Francisco, CA, USA",
    region: "north-america",
    priority: 90,
    endpoints: {
      wireguard: "us-west-1.vpn.andgroupco.com:51820",
      openvpn: "us-west-1.vpn.andgroupco.com:443",
    },
    flag: "🇺🇸",
  },
  "us-central-1": {
    id: "us-central-1",
    name: "US Central Texas",
    location: "Dallas, TX, USA",
    region: "north-america",
    priority: 85,
    endpoints: {
      wireguard: "us-central-1.vpn.andgroupco.com:51820",
      openvpn: "us-central-1.vpn.andgroupco.com:443",
    },
    flag: "🇺🇸",
  },
  "ca-central-1": {
    id: "ca-central-1",
    name: "Canada Central",
    location: "Toronto, ON, Canada",
    region: "north-america",
    priority: 80,
    endpoints: {
      wireguard: "ca-central-1.vpn.andgroupco.com:51820",
      openvpn: "ca-central-1.vpn.andgroupco.com:443",
    },
    flag: "🇨🇦",
  },
  "mx-central-1": {
    id: "mx-central-1",
    name: "Mexico Central",
    location: "Mexico City, Mexico",
    region: "north-america",
    priority: 70,
    endpoints: {
      wireguard: "mx-central-1.vpn.andgroupco.com:51820",
      openvpn: "mx-central-1.vpn.andgroupco.com:443",
    },
    flag: "🇲🇽",
  },

  // Europe (9 servers)
  "eu-west-1": {
    id: "eu-west-1",
    name: "EU West Ireland",
    location: "Dublin, Ireland",
    region: "europe",
    priority: 100,
    endpoints: {
      wireguard: "eu-west-1.vpn.andgroupco.com:51820",
      openvpn: "eu-west-1.vpn.andgroupco.com:443",
    },
    flag: "🇮🇪",
  },
  "eu-central-1": {
    id: "eu-central-1",
    name: "EU Central Germany",
    location: "Frankfurt, Germany",
    region: "europe",
    priority: 95,
    endpoints: {
      wireguard: "eu-central-1.vpn.andgroupco.com:51820",
      openvpn: "eu-central-1.vpn.andgroupco.com:443",
    },
    flag: "🇩🇪",
  },
  "eu-north-1": {
    id: "eu-north-1",
    name: "EU North Sweden",
    location: "Stockholm, Sweden",
    region: "europe",
    priority: 85,
    endpoints: {
      wireguard: "eu-north-1.vpn.andgroupco.com:51820",
      openvpn: "eu-north-1.vpn.andgroupco.com:443",
    },
    flag: "🇸🇪",
  },
  "eu-south-1": {
    id: "eu-south-1",
    name: "EU South Italy",
    location: "Milan, Italy",
    region: "europe",
    priority: 80,
    endpoints: {
      wireguard: "eu-south-1.vpn.andgroupco.com:51820",
      openvpn: "eu-south-1.vpn.andgroupco.com:443",
    },
    flag: "🇮🇹",
  },
  "uk-south-1": {
    id: "uk-south-1",
    name: "UK London",
    location: "London, England",
    region: "europe",
    priority: 90,
    endpoints: {
      wireguard: "uk-south-1.vpn.andgroupco.com:51820",
      openvpn: "uk-south-1.vpn.andgroupco.com:443",
    },
    flag: "🇬🇧",
  },
  fr: {
    id: "fr",
    name: "France Paris",
    location: "Paris, France",
    region: "europe",
    priority: 88,
    endpoints: {
      wireguard: "fr.vpn.andgroupco.com:51820",
      openvpn: "fr.vpn.andgroupco.com:443",
    },
    flag: "🇫🇷",
  },
  nl: {
    id: "nl",
    name: "Netherlands Amsterdam",
    location: "Amsterdam, Netherlands",
    region: "europe",
    priority: 92,
    endpoints: {
      wireguard: "nl.vpn.andgroupco.com:51820",
      openvpn: "nl.vpn.andgroupco.com:443",
    },
    flag: "🇳🇱",
  },
  ch: {
    id: "ch",
    name: "Switzerland Zurich",
    location: "Zurich, Switzerland",
    region: "europe",
    priority: 87,
    endpoints: {
      wireguard: "ch.vpn.andgroupco.com:51820",
      openvpn: "ch.vpn.andgroupco.com:443",
    },
    flag: "🇨🇭",
  },
  fi: {
    id: "fi",
    name: "Finland Helsinki",
    location: "Helsinki, Finland",
    region: "europe",
    priority: 83,
    endpoints: {
      wireguard: "fi.vpn.andgroupco.com:51820",
      openvpn: "fi.vpn.andgroupco.com:443",
    },
    flag: "🇫🇮",
  },

  // Asia Pacific (8 servers)
  "ap-southeast-1": {
    id: "ap-southeast-1",
    name: "AP Southeast Singapore",
    location: "Singapore",
    region: "asia-pacific",
    priority: 100,
    endpoints: {
      wireguard: "ap-southeast-1.vpn.andgroupco.com:51820",
      openvpn: "ap-southeast-1.vpn.andgroupco.com:443",
    },
    flag: "🇸🇬",
  },
  "ap-northeast-1": {
    id: "ap-northeast-1",
    name: "AP Northeast Japan",
    location: "Tokyo, Japan",
    region: "asia-pacific",
    priority: 95,
    endpoints: {
      wireguard: "ap-northeast-1.vpn.andgroupco.com:51820",
      openvpn: "ap-northeast-1.vpn.andgroupco.com:443",
    },
    flag: "🇯🇵",
  },
  "ap-south-1": {
    id: "ap-south-1",
    name: "AP South India",
    location: "Mumbai, India",
    region: "asia-pacific",
    priority: 85,
    endpoints: {
      wireguard: "ap-south-1.vpn.andgroupco.com:51820",
      openvpn: "ap-south-1.vpn.andgroupco.com:443",
    },
    flag: "🇮🇳",
  },
  "ap-southeast-2": {
    id: "ap-southeast-2",
    name: "AP Southeast Australia",
    location: "Sydney, Australia",
    region: "asia-pacific",
    priority: 80,
    endpoints: {
      wireguard: "ap-southeast-2.vpn.andgroupco.com:51820",
      openvpn: "ap-southeast-2.vpn.andgroupco.com:443",
    },
    flag: "🇦🇺",
  },
  "ap-east-1": {
    id: "ap-east-1",
    name: "AP East Hong Kong",
    location: "Hong Kong",
    region: "asia-pacific",
    priority: 90,
    endpoints: {
      wireguard: "ap-east-1.vpn.andgroupco.com:51820",
      openvpn: "ap-east-1.vpn.andgroupco.com:443",
    },
    flag: "🇭🇰",
  },
  kr: {
    id: "kr",
    name: "South Korea Seoul",
    location: "Seoul, South Korea",
    region: "asia-pacific",
    priority: 88,
    endpoints: {
      wireguard: "kr.vpn.andgroupco.com:51820",
      openvpn: "kr.vpn.andgroupco.com:443",
    },
    flag: "🇰🇷",
  },
  my: {
    id: "my",
    name: "Malaysia Kuala Lumpur",
    location: "Kuala Lumpur, Malaysia",
    region: "asia-pacific",
    priority: 82,
    endpoints: {
      wireguard: "my.vpn.andgroupco.com:51820",
      openvpn: "my.vpn.andgroupco.com:443",
    },
    flag: "🇲🇾",
  },
  cn: {
    id: "cn",
    name: "China Beijing",
    location: "Beijing, China",
    region: "asia-pacific",
    priority: 93,
    endpoints: {
      wireguard: "cn.vpn.andgroupco.com:51820",
      openvpn: "cn.vpn.andgroupco.com:443",
    },
    flag: "🇨🇳",
  },

  // South America (1 server)
  "sa-east-1": {
    id: "sa-east-1",
    name: "SA East Brazil",
    location: "São Paulo, Brazil",
    region: "south-america",
    priority: 90,
    endpoints: {
      wireguard: "sa-east-1.vpn.andgroupco.com:51820",
      openvpn: "sa-east-1.vpn.andgroupco.com:443",
    },
    flag: "🇧🇷",
  },

  // Africa (3 servers)
  "af-south-1": {
    id: "af-south-1",
    name: "AF South Africa",
    location: "Cape Town, South Africa",
    region: "africa",
    priority: 75,
    endpoints: {
      wireguard: "af-south-1.vpn.andgroupco.com:51820",
      openvpn: "af-south-1.vpn.andgroupco.com:443",
    },
    flag: "🇿🇦",
  },
  "af-west-1": {
    id: "af-west-1",
    name: "AF West Liberia",
    location: "Monrovia, Liberia",
    region: "africa",
    priority: 85,
    endpoints: {
      wireguard: "af-west-1.vpn.andgroupco.com:51820",
      openvpn: "af-west-1.vpn.andgroupco.com:443",
    },
    flag: "🇱🇷",
  },
  ke: {
    id: "ke",
    name: "Kenya Nairobi",
    location: "Nairobi, Kenya",
    region: "africa",
    priority: 80,
    endpoints: {
      wireguard: "ke.vpn.andgroupco.com:51820",
      openvpn: "ke.vpn.andgroupco.com:443",
    },
    flag: "🇰🇪",
  },

  // Middle East (1 server)
  "me-south-1": {
    id: "me-south-1",
    name: "ME South UAE",
    location: "Dubai, UAE",
    region: "middle-east",
    priority: 80,
    endpoints: {
      wireguard: "me-south-1.vpn.andgroupco.com:51820",
      openvpn: "me-south-1.vpn.andgroupco.com:443",
    },
    flag: "🇦🇪",
  },

  // Oceania (1 server)
  "oc-east-1": {
    id: "oc-east-1",
    name: "OC East New Zealand",
    location: "Auckland, New Zealand",
    region: "oceania",
    priority: 70,
    endpoints: {
      wireguard: "oc-east-1.vpn.andgroupco.com:51820",
      openvpn: "oc-east-1.vpn.andgroupco.com:443",
    },
    flag: "🇳🇿",
  },

  // Eastern Europe (1 server)
  "ru-west-1": {
    id: "ru-west-1",
    name: "RU West Russia",
    location: "Moscow, Russia",
    region: "eastern-europe",
    priority: 75,
    endpoints: {
      wireguard: "ru-west-1.vpn.andgroupco.com:51820",
      openvpn: "ru-west-1.vpn.andgroupco.com:443",
    },
    flag: "��",
  },
} as const;

// VPN Server Regions (ALL REGIONS WITH ALL SERVERS)
export const VPN_REGIONS = {
  "north-america": {
    name: "North America",
    servers: [
      "us-east-1",
      "us-west-1",
      "us-central-1",
      "ca-central-1",
      "mx-central-1",
    ],
  },
  europe: {
    name: "Europe",
    servers: [
      "eu-west-1",
      "eu-central-1",
      "eu-north-1",
      "eu-south-1",
      "uk-south-1",
      "fr",
      "nl",
      "ch",
      "fi",
    ],
  },
  "asia-pacific": {
    name: "Asia Pacific",
    servers: [
      "ap-southeast-1",
      "ap-northeast-1",
      "ap-south-1",
      "ap-southeast-2",
      "ap-east-1",
      "kr",
      "my",
      "cn",
    ],
  },
  "south-america": {
    name: "South America",
    servers: ["sa-east-1"],
  },
  africa: {
    name: "Africa",
    servers: ["af-south-1", "af-west-1", "ke"],
  },
  "middle-east": {
    name: "Middle East",
    servers: ["me-south-1"],
  },
  oceania: {
    name: "Oceania",
    servers: ["oc-east-1"],
  },
  "eastern-europe": {
    name: "Eastern Europe",
    servers: ["ru-west-1"],
  },
} as const;

// Device Types
export const DEVICE_TYPES = {
  IPHONE: "iPhone",
  ANDROID: "Android",
  MACBOOK: "MacBook",
  WINDOWS: "Windows",
  LINUX: "Linux",
  TABLET: "Tablet",
  TV: "TV",
  ROUTER: "Router",
  OTHER: "Other",
} as const;

// Device Type Icons
export const DEVICE_ICONS = {
  IPHONE: "smartphone",
  ANDROID: "smartphone",
  MACBOOK: "laptop",
  WINDOWS: "monitor",
  LINUX: "terminal",
  TABLET: "tablet",
  TV: "tv",
  ROUTER: "wifi",
  OTHER: "device-unknown",
} as const;

// Connection Status
export const CONNECTION_STATUS = {
  ACTIVE: "Connected",
  BLOCKED: "Blocked",
  REMOVED: "Removed",
  CONNECTING: "Connecting...",
  DISCONNECTED: "Disconnected",
} as const;

// Status Colors
export const STATUS_COLORS = {
  ACTIVE: "#10b981",
  BLOCKED: "#ef4444",
  REMOVED: "#6b7280",
  CONNECTING: "#f59e0b",
  DISCONNECTED: "#6b7280",
} as const;

// User Roles
export const USER_ROLES = {
  USER: "User",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
} as const;

// Device Limits by Role
export const DEVICE_LIMITS = {
  USER: 5,
  ADMIN: 50,
  SUPER_ADMIN: 16777213,
} as const;

// Screen Names
export const SCREEN_NAMES = {
  // Auth
  SIGN_IN: "/(auth)/sign-in",
  SIGN_UP: "/(auth)/sign-up",

  // Main Tabs
  DASHBOARD: "/(tabs)",
  DEVICES: "/(tabs)/devices",
  ANALYTICS: "/(tabs)/analytics",
  SETTINGS: "/(tabs)/settings",

  // Device Screens
  ADD_DEVICE: "/devices/add",
  DEVICE_DETAILS: "/devices/[id]",
  DEVICE_CONFIG: "/devices/[id]/config",
  QR_SCANNER: "/qr-scanner",

  // Settings
  PROFILE: "/settings/profile",
  SECURITY: "/settings/security",
  ABOUT: "/settings/about",
} as const;

// Theme Colors
export const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  success: {
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  error: {
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
  warning: {
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: "@andvpn/user_preferences",
  DEVICE_CACHE: "@andvpn/device_cache",
  AUTH_TOKEN: "@andvpn/auth_token",
  THEME_MODE: "@andvpn/theme_mode",
} as const;

// Validation Rules
export const VALIDATION = {
  deviceName: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
} as const;

// Network Configuration
export const NETWORK_CONFIG = {
  requestTimeout: 10000,
  maxRetries: 3,
  retryDelay: 1000,
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  DEVICE_CREATED: "device_created",
  DEVICE_DELETED: "device_deleted",
  VPN_CONNECTED: "vpn_connected",
  VPN_DISCONNECTED: "vpn_disconnected",
  QR_SCANNED: "qr_scanned",
  CONFIG_DOWNLOADED: "config_downloaded",
} as const;
