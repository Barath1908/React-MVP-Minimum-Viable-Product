// Authentication
export const ACCESS_TOKEN_KEY  = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// User Roles
export const ROLES = {
  SUPER_ADMIN:  "super_admin",
  ADMIN:        "admin",
  PROVIDER:     "provider",
  DOCTOR:       "provider",     // alias
  NURSE:        "nurse",
  RECEPTIONIST: "receptionist",
  PHARMACIST:   "pharmacist",
  PATIENT:      "patient",
};

// API
export const API_TIMEOUT = 30000;

// Session
export const SESSION_TIMEOUT = 15 * 60 * 1000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Routes
export const ROUTES = {
  HOME:             "/",
  LOGIN:            "/login",
  LOGOUT:           "/logout",
  REGISTER:         "/register",
  DASHBOARD:        "/dashboard",
  UNAUTHORIZED:     "/unauthorized",
  PATIENTS:         "/patients",
  PATIENT_CREATE:   "/patients/new",
  PATIENT_PROFILE:  "/patients/:id",
  PATIENT_EDIT:     "/patients/edit/:id",
  APPOINTMENTS:     "/appointments",
  APPOINTMENT_CREATE: "/appointments/new",
  APPOINTMENT_DETAIL: "/appointments/:id",
  APPOINTMENT_EDIT:   "/appointments/edit/:id",
  STAFF:            "/staff",
  STAFF_ADD:        "/staff/add",
  USERS:            "/users",
  BILLING:          "/billing",
  BILLING_DETAIL:   "/billing/:id",
  CHAT:             "/chat",
  PRESCRIPTIONS:    "/prescriptions",
  NOTIFICATIONS:    "/notifications",
  SETTINGS:         "/settings",
  PROFILE:          "/profile",
};

// Validation
export const PASSWORD_MIN_LENGTH = 8;

export const APPOINTMENT_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};