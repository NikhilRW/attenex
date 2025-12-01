// Attenex Color Palette - Digital Trust Blue Theme
export const colors = {
  // Background Layers
  background: {
    primary: "#0A0E27",
    secondary: "#131829",
    tertiary: "#1A1F3A",
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
    muted: "#475569",
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
} as const;

export type Colors = typeof colors;
export type ThemeColors = Colors;

export const darkTheme = colors;
export const lightTheme = colors; // Placeholder for now to prevent crash
