const API_ENDPOINTS = {

  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: "/users",
    CREATE: "/users",
    UPDATE: "/users",
    DELETE: "/users",
    ACTIVATE: "/users/activate",
    DEACTIVATE: "/users/deactivate",
  },

  STAFF: {
    GET_ALL: "/staff",
    CREATE: "/staff",
    UPDATE: "/staff",
    DELETE: "/staff",
  },

  ROLES: {
    GET_ALL: "/roles",
    CREATE: "/roles",
    UPDATE: "/roles",
    DELETE: "/roles",
    ASSIGN: "/roles/assign",
  },

  BILLING: {
    GET_ALL: "/billing",
    CREATE: "/billing",
    UPDATE: "/billing",
    DELETE: "/billing",
  },

  CHAT: {
  GET_ALL: "/messages",
  CREATE: "/messages",
  DELETE: "/messages",
  },

    NOTIFICATIONS: {
    GET_ALL: "/notifications",
    CREATE: "/notifications",
    DELETE: "/notifications",
    },

    PRESCRIPTIONS: {
    GET_ALL: "/prescriptions",
    CREATE: "/prescriptions",
    UPDATE: "/prescriptions",
    DELETE: "/prescriptions",
    },

};

export default API_ENDPOINTS;