import { type ClassValue, clsx } from "clsx";

/**
 * Utility functions for AndVPN mobile app
 * DRY principle - reused across components
 */

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format bytes to human readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Format connection duration
export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date();
  const diff = end.getTime() - startTime.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Validate device name
export function validateDeviceName(name: string): boolean {
  // Only allow alphanumeric characters, hyphens, and underscores
  // Length between 3-20 characters
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(name);
}

// Generate device name suggestions
export function generateDeviceNameSuggestions(deviceType: string): string[] {
  const timestamp = Date.now().toString().slice(-4);
  const deviceTypeLower = deviceType.toLowerCase();

  return [
    `${deviceTypeLower}-${timestamp}`,
    `my-${deviceTypeLower}`,
    `${deviceTypeLower}-device`,
    `andvpn-${deviceTypeLower}`,
    `secure-${deviceTypeLower}`,
  ];
}

// Parse QR code data
export function parseQRCodeData(qrData: string): {
  isValid: boolean;
  data?: any;
} {
  try {
    const parsed = JSON.parse(qrData);

    // Validate required fields
    if (parsed.deviceId && parsed.config && parsed.protocol) {
      return { isValid: true, data: parsed };
    }

    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}

// Get device type icon name
export function getDeviceTypeIcon(deviceType: string): string {
  const icons: Record<string, string> = {
    IPHONE: "smartphone",
    ANDROID: "smartphone",
    MACBOOK: "laptop",
    WINDOWS: "monitor",
    LINUX: "terminal",
    TABLET: "tablet",
    TV: "tv",
    ROUTER: "wifi",
    OTHER: "device-unknown",
  };

  return icons[deviceType] || "device-unknown";
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Get connection status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "#10b981", // green
    BLOCKED: "#ef4444", // red
    REMOVED: "#6b7280", // gray
    CONNECTING: "#f59e0b", // amber
    DISCONNECTED: "#6b7280", // gray
  };

  return colors[status] || "#6b7280";
}

// Debounce function for search inputs
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate secure random string for device names
export function generateSecureId(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

// Validate IP address
export function isValidIP(ip: string): boolean {
  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

// Get platform-specific config file extension
export function getConfigFileExtension(protocol: string): string {
  return protocol === "WIREGUARD" ? "conf" : "ovpn";
}
