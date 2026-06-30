const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  CHANGE_PASSWORD: "/auth/change-password",

  // Dashboard
  DASHBOARD_SUMMARY: "/dashboard/summary",

  // Patients
  PATIENTS: "/patients",

  // Appointments
  APPOINTMENTS: "/appointments",

  // Staff
  STAFF: "/staff",

  // Messages
  MESSAGES: "/messages",

  // Prescriptions
  PRESCRIPTIONS: "/prescriptions",

  // Billing
  BILLING_INVOICE: "/billing/invoice",
  BILLING_PAYMENT: "/billing/payment",
  BILLING_SUMMARY: "/billing/summary",
};

export default API_ENDPOINTS;