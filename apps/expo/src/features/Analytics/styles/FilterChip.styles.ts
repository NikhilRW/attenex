import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  chipContainer: {
    borderRadius: theme.size.lg,
    borderWidth: 1.7,
    backgroundColor: theme.surface.glassCardBg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterText: {
    color: theme.text.primary,
    fontSize: theme.typography.md,
  },
}));
