// AndVPN Mobile App Types
// Core types based on WireGuard and OpenVPN management systems and Prisma schema

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type VPNProtocol = "WIREGUARD" | "OPENVPN";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  devices?: Device[];
}

// Based on wg-manager.sh device detection and unlimited scaling
export interface Device {
  id: string;
  name: string;
  deviceType:
    | "IPHONE"
    | "ANDROID"
    | "MACBOOK"
    | "WINDOWS"
    | "LINUX"
    | "TABLET"
    | "TV"
    | "ROUTER"
    | "OTHER";
  protocol: VPNProtocol; // WireGuard or OpenVPN
  ipAddress: string; // Supports unlimited IPs (10.0.0.2 to 10.0.255.254 for WireGuard, instance subnets for OpenVPN)
  ipNumber: number; // For scaling support (2 to 65534)
  publicKey?: string; // WireGuard only
  privateKey?: string; // WireGuard only
  config?: string; // Configuration file content (WireGuard or OpenVPN)
  qrCode?: string; // QR code for configuration
  status: "ACTIVE" | "BLOCKED" | "REMOVED"; // Device status from database
  lastConnected?: Date; // Last connection timestamp
  totalDataUsed?: bigint; // Total data transferred
  location?: string; // Connection location
  os?: string; // Operating system
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  connections?: Connection[];

  // Legacy properties for backward compatibility
  vpnIp?: string; // Alias for ipAddress
  isActive?: boolean; // Computed from status
  isBlocked?: boolean; // Computed from status
}

// Based on wg-manager.sh connection monitoring
export interface Connection {
  id: string;
  deviceId: string;
  startTime: Date;
  endTime?: Date;
  bytesReceived: bigint;
  bytesSent: bigint;
  isActive: boolean;
  location?: string;
}

// Based on wg-manager.sh analytics
export interface Analytics {
  id: string;
  date: Date;
  totalConnections: number;
  totalDataTransfer: bigint;
  activeDevices: number;
  newDevices: number;
}

// WireGuard server configuration
export interface ServerConfig {
  id: string;
  serverIp: string; // 31.97.41.230
  serverPort: number; // 51820
  publicKey: string;
  isActive: boolean;
  maxClients: number; // 16,777,213 for /8 network unlimited scaling
  currentClients: number;
}

// Role-based access control (DRY approach)
export type Permission =
  | "device:read"
  | "device:create"
  | "device:update"
  | "device:delete"
  | "device:block"
  | "analytics:read"
  | "user:read"
  | "user:manage"
  | "server:read"
  | "server:manage"
  | "server:configure";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  USER: ["device:read", "device:create", "device:update"],
  ADMIN: [
    "device:read",
    "device:create",
    "device:update",
    "device:delete",
    "device:block",
    "analytics:read",
    "user:read",
    "server:read",
  ],
  SUPER_ADMIN: [
    "device:read",
    "device:create",
    "device:update",
    "device:delete",
    "device:block",
    "analytics:read",
    "user:read",
    "user:manage",
    "server:read",
    "server:manage",
    "server:configure",
  ],
};

// Mobile-specific types
export interface VPNStatus {
  isConnected: boolean;
  connectionTime?: Date;
  serverLocation?: string;
  bytesReceived?: number;
  bytesSent?: number;
}

export interface QRCodeData {
  deviceId: string;
  config: string;
  protocol: VPNProtocol;
}

export interface DeviceCreationData {
  name: string;
  deviceType: Device["deviceType"];
  protocol: VPNProtocol;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
