export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3000/api"
    : "https://your-production-api.com/api",
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "user",
};

export const GEOFENCE = {
  DEFAULT_RADIUS: 50, // meters
  MAX_RADIUS: 500,
};

export const OTP = {
  LENGTH: 6,
  EXPIRE_MINUTES: 5,
};

export const COLORS = {
  primary: "#4F46E5",
  secondary: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",

  // Attendance colors
  present: "#10b981",
  absent: "#ef4444",
  late: "#f59e0b",

  // UI colors
  background: "#ffffff",
  text: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
};
