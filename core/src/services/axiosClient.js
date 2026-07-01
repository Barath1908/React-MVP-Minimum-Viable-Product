import axios from "axios";
import environment from "../config/environment";
import tokenService from "./tokenService";

const axiosClient = axios.create({
    baseURL: environment.API_BASE_URL,
    timeout: environment.REQUEST_TIMEOUT,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = tokenService.getAccessToken();
        const csrfToken = tokenService.getCsrfToken();

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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => {
        // Automatically capture CSRF token from any response if present
        const csrfToken = response.data?.csrf_token;
        if (csrfToken) {
            tokenService.setCsrfToken(csrfToken);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is 401 and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Avoid refreshing again if the request is for the refresh endpoint itself
            if (originalRequest.url?.includes("/auth/refresh")) {
                tokenService.clearAuth();
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint using direct POST
                const res = await axiosClient.post("/auth/refresh");
                const newAccessToken = res.data?.payload?.data?.access_token;

                if (newAccessToken) {
                    tokenService.setAccessToken(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    processQueue(null, newAccessToken);
                    return axiosClient(originalRequest);
                } else {
                    throw new Error("No access token returned from refresh.");
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                tokenService.clearAuth();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;