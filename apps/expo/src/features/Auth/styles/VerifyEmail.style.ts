import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.custom(30),
    paddingBottom: theme.spacing["2xl"],
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.custom(20),
    backgroundColor: theme.primary.glow,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: theme.text.primary,
  },
  successDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: theme.spacing.custom(20),
    color: theme.text.secondary,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: theme.spacing.custom(20),
    marginTop: -theme.spacing.sm,
    color: theme.text.muted,
  },
  helpContainer: {
    alignItems: "center",
    gap: theme.spacing.custom(6),
    marginTop: theme.spacing.md,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text.secondary,
  },
  contactText: {
    fontSize: 13,
    textAlign: "center",
    color: theme.text.muted,
  },
}));
