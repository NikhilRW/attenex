import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { darkTheme, lightTheme, type ThemeColors } from "../constants/colors";
import { mmkvStorage } from "../utils/mmkvStorage";
import { useColorScheme } from "react-native";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeStore {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        
        if (state?.mode) {
          state.setTheme(state.mode);
        }
      },
    }
  )
);

// Hook for easy access
export const useTheme = () => {
  const { mode, setTheme } = useThemeStore();
  const systemScheme = useColorScheme();

  const effectiveMode =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const colors = effectiveMode === "dark" ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setTheme(effectiveMode === "dark" ? "light" : "dark");
  };

  return {
    colors,
    mode,
    toggleTheme,
    setTheme,
    isDark: effectiveMode === "dark",
  };
};
