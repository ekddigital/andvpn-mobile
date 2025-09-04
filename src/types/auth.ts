// Authentication and authorization types for AndVPN Mobile

export type UserRole = "user" | "admin" | "super_admin";

export type Permission =
  | "vpn.connect"
  | "vpn.disconnect"
  | "vpn.view_servers"
  | "vpn.manage_devices"
  | "admin.view_users"
  | "admin.manage_users"
  | "admin.view_analytics"
  | "super_admin.manage_servers"
  | "super_admin.manage_system";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    "vpn.connect",
    "vpn.disconnect",
    "vpn.view_servers",
    "vpn.manage_devices",
  ],
  admin: [
    "vpn.connect",
    "vpn.disconnect",
    "vpn.view_servers",
    "vpn.manage_devices",
    "admin.view_users",
    "admin.manage_users",
    "admin.view_analytics",
  ],
  super_admin: [
    "vpn.connect",
    "vpn.disconnect",
    "vpn.view_servers",
    "vpn.manage_devices",
    "admin.view_users",
    "admin.manage_users",
    "admin.view_analytics",
    "super_admin.manage_servers",
    "super_admin.manage_system",
  ],
};
