import environment from "../config/environment";
import getTenantFromDomain from "../utils/getTenantFromDomain";

const {
  ACCESS_TOKEN_KEY,
  CSRF_TOKEN_KEY,
} = environment;

const USER_KEY = "auth_user";

// Helper to prefix keys for subdomain session isolation
const getPrefixedKey = (key) => {
  const subdomain = getTenantFromDomain();
  return subdomain ? `${subdomain}_${key}` : key;
};

const tokenService = {
  // Access Token
  getAccessToken() {
    return localStorage.getItem(getPrefixedKey(ACCESS_TOKEN_KEY));
  },

  setAccessToken(token) {
    localStorage.setItem(getPrefixedKey(ACCESS_TOKEN_KEY), token);
  },

  removeAccessToken() {
    localStorage.removeItem(getPrefixedKey(ACCESS_TOKEN_KEY));
  },

  // CSRF Token
  getCsrfToken() {
    return localStorage.getItem(getPrefixedKey(CSRF_TOKEN_KEY));
  },

  setCsrfToken(token) {
    localStorage.setItem(getPrefixedKey(CSRF_TOKEN_KEY), token);
  },

  removeCsrfToken() {
    localStorage.removeItem(getPrefixedKey(CSRF_TOKEN_KEY));
  },

  // User
  getUser() {
    try {
      const user = localStorage.getItem(getPrefixedKey(USER_KEY));
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(getPrefixedKey(USER_KEY), JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(getPrefixedKey(USER_KEY));
  },

  // Clear all auth data
  clearAuth() {
    this.removeAccessToken();
    this.removeCsrfToken();
    this.removeUser();
  },
};

export default tokenService;