import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { darkTheme, lightTheme} from "../constants/colors";
import { mmkvStorage } from "../utils/mmkvStorage";
import { useColorScheme } from "react-native";
import { useShallow } from "zustand/shallow";
import { useMemo } from "react";

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
  const { mode, setTheme } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      setTheme: state.setTheme,
    }))
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
