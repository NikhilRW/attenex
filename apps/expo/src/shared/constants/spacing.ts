type BP = "xs" | "sm" | "md" | "lg";

const bpMultipliers: Record<BP, number> = {
  xs: 0.75,
  sm: 1,
  md: 1.25,
  lg: 1.5,
};

const bpScale = (n: number): Record<BP, number> => ({
  xs: Math.round(n * bpMultipliers.xs),
  sm: Math.round(n * bpMultipliers.sm),
  md: Math.round(n * bpMultipliers.md),
  lg: Math.round(n * bpMultipliers.lg),
});

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  "6xl": 72,
  custom: (n: number) => n,
} as const;

export const size = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  "6xl": 72,
  "7xl": 80,
  "8xl": 88,
  custom: (n: number) => n,
} as const;

export const responsiveSpacing = {
  xxs: bpScale(2),
  xs: bpScale(4),
  sm: bpScale(8),
  md: bpScale(16),
  lg: bpScale(24),
  xl: bpScale(32),
  "2xl": bpScale(40),
  "3xl": bpScale(48),
  "4xl": bpScale(56),
  "5xl": bpScale(64),
  custom: (n: number) => bpScale(n),
} as const;

export const typography = {
  xs: bpScale(10),
  sm: bpScale(12),
  md: bpScale(14),
  lg: bpScale(16),
  xl: bpScale(20),
  xxl: bpScale(24),
  h3: bpScale(28),
  h2: bpScale(32),
  h1: bpScale(40),
} as const;

export type TypographyToken = keyof typeof typography;
