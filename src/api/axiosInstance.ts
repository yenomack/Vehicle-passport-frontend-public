// src/api/axiosInstance.ts
import axios from "axios";
import { disconnectWallet } from "../context/WalletContextHelper";

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

// ==========================================
// 🌐 CENTRALIZED API CLIENT CONFIGURATION
// ==========================================
/**
 * @TODO_REAL_PROJECT: In the production environment, the baseURL is dynamically injected 
 * via environment variables to point to the secure backend infrastructure.
 * * PUBLIC DEMO VERSION: This file is preserved in the repository to showcase Enterprise-level 
 * JWT silent rotation and request queuing architecture, even if network endpoints are mocked.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  withCredentials: true
});

/**
 * Request Interceptor: Automatically injects the active bearer JWT 
 * from synchronized client storage layers before network transmission.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor: Implements an advanced automated token rotation mechanism.
 * Intercepts HTTP 401 errors, schedules silent token refreshes, handles request queuing 
 * to prevent race conditions, and gracefully handles session expirations.
 */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Standard bubble up for any non-401 authentication anomalies
    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }

    // Circuit breaker to prevent infinite recursive loop scenarios
    if (originalRequest._retry) {
      disconnectWallet();
      return Promise.reject(err);
    }
    originalRequest._retry = true;

    // Concurrency Lock: If a refresh operation is already airborne, enqueue requests
    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      // Execute architectural silent refresh sequence
      const refreshRes = await api.post("/auth/refresh");
      const newToken = refreshRes.data.accessToken;

      localStorage.setItem("auth_token", newToken);

      // Re-align default headers for subsequent transmissions
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      // Resolve and replay queued async transactions with the updated session token
      pendingRequests.forEach((callback) => callback(newToken));
      pendingRequests = [];

      // Replay the original unfulfilled network interaction
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);

    } catch (refreshErr) {
      // Graceful fallback to app logout if cryptographic refresh tokens are invalid or expired
      disconnectWallet();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;