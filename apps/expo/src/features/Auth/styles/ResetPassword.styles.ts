import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.custom(80),
    paddingBottom: theme.spacing["2xl"],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: theme.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.custom(20),
  },
  errorIconContainer: {
    backgroundColor: `${theme.status.error}20`,
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: theme.text.primary,
  },
  errorDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: theme.text.secondary,
  },
  formContainer: {
    gap: theme.spacing.lg,
  },
  greeting: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    color: theme.text.primary,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    color: theme.text.secondary,
  },
  requirementsContainer: {
    borderRadius: 12,
    padding: theme.spacing.md,
    gap: theme.spacing.custom(12),
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
    color: theme.primary.main,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.custom(10),
  },
  requirementText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  gradientStyle: { borderRadius: 12 },
}));
