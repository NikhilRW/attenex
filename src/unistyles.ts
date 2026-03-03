import { darkTheme, lightTheme } from "@shared/constants/colors";
import { StyleSheet } from "react-native-unistyles";

const appThemes = {
  dark: darkTheme,
  light: lightTheme,
};

type AppThemes = typeof appThemes;

declare module "react-native-unistyles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

StyleSheet.configure({
  themes: appThemes,
  settings: {
    // Follows the device color scheme automatically.
    // In Phase 4 this will be replaced with initialTheme reading
    // the user's saved preference from MMKV once the Zustand theme
    // store is removed.
    adaptiveThemes: true,
  },
});
