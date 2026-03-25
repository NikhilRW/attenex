import { darkTheme, lightTheme } from "@shared/constants/colors";
import { StyleSheet } from "react-native-unistyles";
import{ useThemeStore  } from "./shared/hooks/useTheme";
const appThemes = {
  dark: darkTheme,
  light: lightTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

const selectedThemeMode = useThemeStore.getState().mode;

const settings =
  selectedThemeMode === "system"
    ? {
        adaptiveThemes: true,
      }
    : {
        initialTheme: selectedThemeMode,
      };

StyleSheet.configure({
  themes: appThemes,
  settings: settings,
});
