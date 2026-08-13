import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.spacing.lg, padding: theme.spacing.lg },
  sheet: {
    paddingTop: theme.spacing.md,
    backgroundColor: theme.background.primary,
  },
  applyButton: {
    backgroundColor: theme.primary.dark,
    padding: theme.spacing.md,
    borderRadius: theme.size.md,
  },
  applyButtonText: {
    color: theme.static.white,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: theme.typography.lg,
  },
}));
