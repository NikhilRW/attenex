import { darkTheme, lightTheme } from "@shared/constants/colors";
import { StyleSheet } from "react-native-unistyles";
import { useThemeStore } from "./shared/hooks/useTheme";

const appThemes = {
  dark: darkTheme,
  light: lightTheme,
};

const breakpoints = {
  xs: 0,
  sm: 360,
  md: 768,
  lg: 1024,
} as const;

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends AppBreakpoints {}
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
  breakpoints,
  settings: settings,
});
