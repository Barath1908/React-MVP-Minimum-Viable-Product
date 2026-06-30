import axios from "axios";
import environment from "../config/environment";
import tokenService from "./tokenService";

const axiosClient = axios.create({
  baseURL: environment.API_BASE_URL,
  timeout: environment.REQUEST_TIMEOUT,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept:         "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessToken();
    const csrfToken   = tokenService.getCsrfToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // No X-Tenant-ID header — backend resolves tenant from HTTP_HOST subdomain

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    // Automatically capture CSRF token from any response if present
    const csrfToken = response.data?.csrf_token;
    if (csrfToken) {
      tokenService.setCsrfToken(csrfToken);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenService.clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;