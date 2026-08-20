import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  labelText: {
    color: theme.text.primary,
    fontSize: theme.typography.xl,
    fontWeight: "bold",
    marginBottom: theme.size.sm,
  },
  card: {
    borderRadius: theme.size.lg,
    borderColor: theme.surface.glassBorder,
    borderWidth: 1,
    backgroundColor: theme.surface.glassCardBg,
    padding: theme.size.md,
  },
  cardText: {
    color: theme.text.primary,
    fontSize: theme.typography.md,
  },
}));
