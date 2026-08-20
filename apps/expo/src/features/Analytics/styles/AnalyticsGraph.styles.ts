import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  graphContainer: {
    height: 210,
  },
  graph: {
    height: 200,
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
}));
