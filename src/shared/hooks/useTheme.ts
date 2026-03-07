import { mmkvStorage } from "@shared/utils/mmkvStorage";
import { UnistylesRuntime } from "react-native-unistyles";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
          UnistylesRuntime.setAdaptiveThemes(true);
        } else {
          UnistylesRuntime.setAdaptiveThemes(false);
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
