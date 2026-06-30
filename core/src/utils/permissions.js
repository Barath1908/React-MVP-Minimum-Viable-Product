import { ROLES } from "./constants";

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view_dashboard",
  MANAGE_PATIENTS: "manage_patients",
  MANAGE_APPOINTMENTS: "manage_appointments",
  MANAGE_USERS: "manage_users",
};

export const ROLE_PERMISSIONS = {

  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_APPOINTMENTS,
    PERMISSIONS.MANAGE_USERS,
  ],

  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_PATIENTS,
  ],

  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_APPOINTMENTS,
  ],
};

export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission);
};