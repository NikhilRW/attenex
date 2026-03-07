import { darkTheme, lightTheme } from "@shared/constants/colors";
import { mmkvStorage } from "@shared/utils/mmkvStorage";
import { useMemo } from "react";
import { Appearance, useColorScheme } from "react-native";
import { UnistylesRuntime } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeStore {
  mode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "system",
      setTheme: (mode) => {
        set({ mode });
        if (mode === "system") {
          UnistylesRuntime.setTheme(
            Appearance.getColorScheme() as "dark" | "light",
          );
        } else {
          UnistylesRuntime.setTheme(mode);
        }
      },
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
    },
  ),
);

// Hook for easy access
export const useTheme = () => {
  const { mode, setTheme } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      setTheme: state.setTheme,
    })),
  );
  const systemScheme = useColorScheme();

  const effectiveMode =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const colors = effectiveMode === "dark" ? darkTheme : lightTheme;

  const toggleTheme = useMemo(() => {
    return () => {
      setTheme(effectiveMode === "dark" ? "light" : "dark");
    };
  }, [effectiveMode, setTheme]);

  return {
    colors,
    mode,
    toggleTheme,
    setTheme,
    isDark: effectiveMode === "dark",
  };
};
