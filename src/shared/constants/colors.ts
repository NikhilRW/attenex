// Attenex Color Palette - Digital Trust Blue Theme

export const darkTheme = {
  // Background Layers
  background: {
    primary: "#0A0E27",
    secondary: "#131829",
    tertiary: "#1a1f3a",
    overlay: "rgba(10, 14, 39, 0.3)",
    gradientEnd: "rgba(0,0,0,0.8)",
  },

  // Primary Brand Colors
  primary: {
    main: "#00D4FF",
    light: "#33DDFF",
    dark: "#00A8CC",
    glow: "rgba(0, 212, 255, 0.5)",
  },

  // Accent Colors
  accent: {
    blue: "#3B82F6",
    purple: "#8B5CF6",
    green: "#10B981",
    red: "#EF4444",
    yellow: "#F59E0B",
  },

  // Text Colors
  text: {
    primary: "#FFFFFF",
    secondary: "#94A3B8",
    tertiary: "#64748B",
    muted: "#79889C",
  },

  // Surface Colors
  surface: {
    glass: "rgba(255, 255, 255, 0.05)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    cardBg: "rgba(26, 31, 58, 0.6)",
  },

  // Shadows
  shadow: {
    soft: "rgba(0, 0, 0, 0.2)",
    medium: "rgba(0, 0, 0, 0.4)",
    hard: "rgba(0, 0, 0, 0.6)",
    glow: "rgba(0, 212, 255, 0.3)",
  },

  // Status Colors
  status: {
    success: "#10B981",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
} as const;

export type ThemeColors = typeof darkTheme;

export const lightTheme = {
  // Background Layers
  background: {
    primary: "#F8FAFC",
    secondary: "#FFFFFF",
    tertiary: "#C7C4C4",
    overlay: "rgba(255, 255, 255, 0.3)",
    gradientEnd: "rgba(255,255,255,0.8)",
  },

  // Primary Brand Colors
  primary: {
    main: "#0891B2", // Darker cyan for better contrast on light bg
    light: "#06B6D4",
    dark: "#0E7490",
    glow: "rgba(8, 145, 178, 0.3)",
  },

  // Accent Colors
  accent: {
    blue: "#2563EB", // Slightly darker for light mode contrast
    purple: "#7C3AED",
    green: "#059669",
    red: "#DC2626",
    yellow: "#D97706",
  },

  // Text Colors
  text: {
    primary: "#0F172A", // Dark text for light background
    secondary: "#334155",
    tertiary: "#475569",
    muted: "#64748B",
  },

  // Surface Colors
  surface: {
    glass: "rgba(0, 0, 0, 0.02)",
    glassBorder: "rgba(0, 0, 0, 0.15)",
    cardBg: "rgba(255, 255, 255, 0.95)",
  },

  // Shadows
  shadow: {
    soft: "rgba(0, 0, 0, 0.05)",
    medium: "rgba(0, 0, 0, 0.1)",
    hard: "rgba(0, 0, 0, 0.15)",
    glow: "rgba(0, 212, 255, 0.15)",
  },

  // Status Colors
  status: {
    success: "#059669",
    error: "#DC2626",
    warning: "#D97706",
    info: "#2563EB",
  },
};

// Default export for backward compatibility if needed, though we should migrate to useTheme
export const colors = darkTheme;
