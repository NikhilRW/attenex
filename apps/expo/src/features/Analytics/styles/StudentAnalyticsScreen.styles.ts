import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  listContent: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing["4xl"],
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  listHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.text.primary,
    fontSize: theme.typography.xl,
    fontWeight: "700",
  },
  sectionCount: {
    color: theme.text.muted,
    fontSize: theme.typography.sm,
    fontWeight: "600",
  },
  lectureCard: {
    padding: theme.spacing.md,
    borderRadius: theme.size.lg,
    borderWidth: 1,
    borderColor: theme.surface.glassBorder,
    backgroundColor: theme.surface.glassCardBg,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  titleContent: {
    flex: 1,
  },
  subjectName: {
    color: theme.text.primary,
    fontSize: theme.typography.lg,
    fontWeight: "700",
    marginBottom: theme.spacing.xxs,
  },
  teacherName: {
    color: theme.text.secondary,
    fontSize: theme.typography.sm,
    fontWeight: "500",
  },
  compactDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  detailsContainer: {
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.surface.glassBorder,
  },
  metadataItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  metadataText: {
    color: theme.text.secondary,
    fontSize: theme.typography.sm,
    fontWeight: "500",
  },
  stateContainer: {
    flex: 1,
    minHeight: 260,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  stateTitle: {
    color: theme.text.primary,
    fontSize: theme.typography.xl,
    fontWeight: "700",
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  stateDescription: {
    color: theme.text.secondary,
    fontSize: theme.typography.md,
    lineHeight: 20,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.size.md,
    backgroundColor: theme.primary.main,
  },
  retryText: {
    color: theme.static.white,
    fontSize: theme.typography.md,
    fontWeight: "700",
  },
}));
