/**
 * Types for subscription and usage management
 */

export interface UserSubscription {
  id: string;
  userId: string;
  planName: string;
  planType: "FREE" | "BASIC" | "PREMIUM" | "ENTERPRISE";
  deviceLimit: number;
  dataLimit: number; // in GB, -1 for unlimited
  durationLimit: number; // in hours per month, -1 for unlimited
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  price: number;
  currency: string;
  features: string[];
}

export interface DeviceUsage {
  deviceId: string;
  deviceName: string;
  totalDataUsed: number; // in bytes
  totalTimeConnected: number; // in minutes
  lastConnected: Date | null;
  connectionsThisMonth: number;
  dataUsedThisMonth: number;
  timeConnectedThisMonth: number;
  isCurrentlyConnected: boolean;
}

export interface UserUsageStats {
  subscription: UserSubscription;
  deviceUsages: DeviceUsage[];
  totalDevicesUsed: number;
  totalDataUsedThisMonth: number;
  totalTimeConnectedThisMonth: number;
  remainingDevices: number;
  remainingData: number; // -1 for unlimited
  remainingTime: number; // -1 for unlimited
  daysUntilExpiry: number;
  usagePercentage: {
    devices: number;
    data: number;
    time: number;
  };
}

export interface ConnectionSession {
  id: string;
  deviceId: string;
  serverId: string;
  startTime: Date;
  endTime: Date | null;
  dataReceived: number;
  dataSent: number;
  isActive: boolean;
}
