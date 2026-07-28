import { StyleSheet } from "react-native-unistyles";

export const subjectSelectorStyles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    inputGroup: {
      marginBottom: theme.spacing.custom(20),
      position: "relative",
    },
    inputGroupTopic: {
      zIndex: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: theme.spacing.custom(10),
      marginLeft: theme.spacing.xs,
      opacity: 0.9,
      color: theme.text.secondary,
    },
    dropdown: {
      padding: theme.spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)",
      borderColor: theme.surface.glassBorder,
    },
    dropdownText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.primary,
    },
    dropdownTextMuted: {
      color: theme.text.muted,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: rt.insets.bottom,
      paddingHorizontal: theme.spacing.custom(12),
    },
    modalAnimatedWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    modalContent: {
      width: "100%",
      borderRadius: 24,
      padding: theme.spacing.xl,
    },
    modalSurface: {
      borderColor: theme.border.modal,
      borderWidth: 1,
    },
    modalSurfaceFlat: {
      padding: 0,
      overflow: "hidden",
    },
    modalHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.spacing.custom(20),
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(125,125,125,0.3)",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: theme.spacing.lg,
      textAlign: "center",
      color: theme.text.primary,
    },
    modalTitleInline: {
      marginBottom: 0,
      textAlign: "left",
      fontSize: 20,
      fontWeight: "700",
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      alignItems: "center",
      justifyContent: "center",
    },
    dropdownScroll: {
      maxHeight: 240,
      paddingHorizontal: theme.spacing.custom(9),
      marginTop: theme.spacing.custom(9),
    },
    optionItem: {
      padding: theme.spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 12,
      marginBottom: theme.spacing.sm,
    },
    optionItemSelected: {
      backgroundColor: isDark ? "rgba(8, 145, 178, 0.15)" : "rgba(8, 145, 178, 0.1)",
    },
    optionItemText: {
      fontSize: 16,
      color: theme.text.primary,
      fontWeight: "500",
    },
    optionItemTextSelected: {
      color: theme.primary.main,
      fontWeight: "600",
    },
    selectionEmptyState: {
      padding: theme.spacing["2xl"],
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    selectionEmptyIcon: {
      opacity: 0.3,
      marginBottom: theme.spacing.custom(12),
    },
    selectionEmptyText: {
      color: theme.text.muted,
      fontSize: 16,
      textAlign: "center",
    },
    selectionFooter: {
      padding: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.surface.glassBorder,
    },
    addClassCta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.md,
      backgroundColor: isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.primary.glow,
      gap: theme.spacing.sm,
    },
    addClassCtaText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.primary.main,
    },
  };
});
