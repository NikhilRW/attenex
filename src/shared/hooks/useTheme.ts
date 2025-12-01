import { create } from "zustand";
import { darkTheme, lightTheme, type ThemeColors } from "../constants/colors";

type ThemeMode = "dark" | "light";

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "dark",
  colors: darkTheme,
  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === "dark" ? "light" : "dark",
      colors: state.mode === "dark" ? lightTheme : darkTheme,
    })),
  setTheme: (mode: ThemeMode) =>
    set({
      mode,
      colors: mode === "dark" ? darkTheme : lightTheme,
    }),
}));

// Hook for easy access
export const useTheme = () => {
  const { colors, mode, toggleTheme, setTheme } = useThemeStore();
  return { colors, mode, toggleTheme, setTheme, isDark: mode === "dark" };
};
