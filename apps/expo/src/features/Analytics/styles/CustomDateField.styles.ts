import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
    },
    dateFieldContainer: {
      padding: theme.spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)",
      borderColor: theme.surface.glassBorder,
    },
    dateFieldText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.primary,
    },
    dateFieldTextMuted: {
      color: theme.text.muted,
    },
  };
});
