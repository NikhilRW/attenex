import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  graphContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  graphCard: {
    minHeight: 230,
    padding: theme.spacing.md,
    borderRadius: theme.size.xl,
    borderWidth: 1,
    borderColor: theme.surface.glassBorder,
    backgroundColor: theme.surface.glassCardBg,
    overflow: "hidden",
  },
  graphViewport: {
    height: 200,
    padding: -20,
    borderBottomLeftRadius: theme.size["3xl"],
    borderBottomRightRadius: theme.size["3xl"],
    overflow: "hidden",
  },
  graph: {
    height: 200,
    borderBottomLeftRadius: theme.size["3xl"],
    borderBottomRightRadius: theme.size["3xl"],
  },
  hideGraph: {
    width: 0,
    height: 0,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataFoundContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  noDataFoundText: {
    textAlign: "center",
    fontSize: theme.typography.custom(22),
    fontWeight: "500",
    color: theme.text.secondary,
    opacity: 0.8,
    marginTop: theme.spacing.sm,
  },
  noDataFoundIcon: {
    opacity: 0.8,
  },
  createLectureButton: {
    borderWidth: 1,
    backgroundColor: "rgba(8, 145, 178, 0.3)",
    borderColor: theme.primary.glow,
    borderRadius: theme.size.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  createLectureButtonText: {
    color: theme.text.primary,
    fontSize: theme.typography.lg,
    fontWeight: "bold",
  },
  detailCardsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  detailCard: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.size.lg,
    borderWidth: 1,
    borderColor: theme.surface.glassBorder,
    backgroundColor: theme.surface.glassCardBg,
  },
  detailLabel: {
    color: theme.text.secondary,
    fontSize: theme.typography.sm,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    color: theme.text.primary,
    fontSize: theme.typography.lg,
    fontWeight: "700",
  },
}));
