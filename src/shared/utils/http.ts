import { BASE_URI } from "@/src/shared/constants/uri";
import { useAuthStore } from "@/src/shared/stores/authStore";
import axios from "axios";
import { secureStore } from "./secureStore";

/**
 * Centralized axios instance for API calls. Automatically attaches Authorization
 * Bearer token from the auth store or secure store to each request.
 */
const http = axios.create({
  baseURL: BASE_URI,
  timeout: 10000,
});

// Request interceptor to add Authorization header
http.interceptors.request.use(async (config) => {
  try {
    // Pull token from runtime store first (fast), fallback to secure storage
    const state = useAuthStore.getState();
    let token = state.token;

    if (!token) {
      token = await secureStore.getItem("jwt");
    }
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  } catch (_) {
    return config;
  }
});

// Response interceptor to handle errors and 401 unauthorized
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only logout on 401 Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      const errorMsg = error.response?.data?.error;
      // Only logout if it's a token issue, not missing credentials
      if (errorMsg?.includes("token") || errorMsg?.includes("authorization")) {
        useAuthStore.getState().logout();
      }
    }

    // Enhance error with user-friendly message
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.message === "Network Error") {
      error.message =
        "Unable to connect. Please check your internet connection.";
    } else if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default http;
