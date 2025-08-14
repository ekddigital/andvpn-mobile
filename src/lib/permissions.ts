// Permissions utility functions for AndVPN Mobile
// This file should be placed at: src/lib/auth/permissions.ts

import { UserRole, Permission, ROLE_PERMISSIONS } from "@/types";

/**
 * DRY approach to role-based access control
 * Mobile-optimized permission checking
 */

export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

export function canAccessAdminFeatures(userRole: UserRole): boolean {
  return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
}

export function canAccessSuperAdminFeatures(userRole: UserRole): boolean {
  return userRole === "SUPER_ADMIN";
}

export function canManageDevice(
  userRole: UserRole,
  isOwnDevice: boolean
): boolean {
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") return true;
  return userRole === "USER" && isOwnDevice;
}

export function canBlockDevice(userRole: UserRole): boolean {
  return hasPermission(userRole, "device:block");
}

export function canViewAnalytics(userRole: UserRole): boolean {
  return hasPermission(userRole, "analytics:read");
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, "user:manage");
}

export function canManageServer(userRole: UserRole): boolean {
  return hasPermission(userRole, "server:manage");
}

// Device limits based on user role
export function getDeviceLimit(userRole: UserRole): number {
  switch (userRole) {
    case "USER":
      return 5;
    case "ADMIN":
      return 50;
    case "SUPER_ADMIN":
      return 16777213; // Unlimited scaling
    default:
      return 1;
  }
}

// Mobile-specific navigation items
interface MobileNavigationItem {
  name: string;
  screen: string;
  icon: string;
  permission: Permission;
  adminOnly?: boolean;
}

// Get accessible navigation items for mobile app
export function getMobileNavigationItems(
  userRole: UserRole
): MobileNavigationItem[] {
  const baseItems: MobileNavigationItem[] = [
    {
      name: "Dashboard",
      screen: "Dashboard",
      icon: "home",
      permission: "device:read" as Permission,
    },
    {
      name: "Devices",
      screen: "Devices",
      icon: "smartphone",
      permission: "device:read" as Permission,
    },
    {
      name: "Add Device",
      screen: "AddDevice",
      icon: "plus",
      permission: "device:create" as Permission,
    },
  ];

  const adminItems: MobileNavigationItem[] = [
    {
      name: "Analytics",
      screen: "Analytics",
      icon: "bar-chart",
      permission: "analytics:read" as Permission,
      adminOnly: true,
    },
    {
      name: "All Users",
      screen: "Users",
      icon: "users",
      permission: "user:read" as Permission,
      adminOnly: true,
    },
  ];

  const superAdminItems: MobileNavigationItem[] = [
    {
      name: "Server",
      screen: "Server",
      icon: "server",
      permission: "server:manage" as Permission,
      adminOnly: true,
    },
  ];

  let items = baseItems.filter((item) =>
    hasPermission(userRole, item.permission)
  );

  if (canAccessAdminFeatures(userRole)) {
    items = [
      ...items,
      ...adminItems.filter((item) => hasPermission(userRole, item.permission)),
    ];
  }

  if (canAccessSuperAdminFeatures(userRole)) {
    items = [
      ...items,
      ...superAdminItems.filter((item) =>
        hasPermission(userRole, item.permission)
      ),
    ];
  }

  return items;
}
