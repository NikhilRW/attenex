import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
      paddingTop: theme.spacing.custom(15),
    },
    screenFill: {
      flex: 1,
    },
    backgroundContainer: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing.custom(20),
      paddingTop: theme.spacing.custom(20),
      paddingBottom: theme.spacing.custom(100),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    headerSubtitle: {
      fontSize: 16,
      marginTop: theme.spacing.xs,
      color: theme.text.secondary,
    },
    addButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      backgroundColor: theme.primary.main,
    },
    statsScroll: {
      marginBottom: theme.spacing.lg,
      marginHorizontal: theme.spacing.custom(-20),
      flex: 1,
    },
    statsContent: {
      paddingHorizontal: theme.spacing.custom(20),
      gap: theme.spacing.custom(12),
    },
    statsCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      borderRadius: 20,
      borderWidth: 1,
      minWidth: 160,
      gap: theme.spacing.custom(12),
    },
    statsCardBlue: {
      borderColor: "rgba(59, 130, 246, 0.3)",
    },
    statsCardGreen: {
      borderColor: "rgba(16, 185, 129, 0.3)",
    },
    statsCardAmber: {
      borderColor: "rgba(245, 158, 11, 0.3)",
    },
    statsIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    statsIconBlue: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
    statsIconGreen: {
      backgroundColor: "rgba(16, 185, 129, 0.2)",
    },
    statsIconAmber: {
      backgroundColor: "rgba(245, 158, 11, 0.2)",
    },
    statsValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text.primary,
    },
    statsLabel: {
      fontSize: 12,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.custom(12),
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.custom(10),
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      borderColor: theme.surface.glassBorder,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text.primary,
    },
    listContainer: {
      gap: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
      color: theme.text.primary,
    },
    lectureCard: {
      borderRadius: 24,
      borderWidth: 1,
      padding: theme.spacing.custom(20),
      marginBottom: theme.spacing.md,
    },
    lectureCardBorderDefault: {
      borderColor: theme.surface.glassBorder,
    },
    lectureCardBorderPending: {
      borderColor: "rgba(137 183 255 / 0.4)",
    },
    lectureCardBorderActive: {
      borderColor: "rgba(34, 197, 94, 0.4)",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.md,
    },
    cardTitleContainer: {
      flex: 1,
      marginRight: theme.spacing.custom(12),
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: theme.spacing.xs,
      color: theme.text.primary,
    },
    cardSubtitle: {
      fontSize: 14,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    activeBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(34, 197, 94, 0.15)",
      paddingHorizontal: theme.spacing.custom(10),
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(34, 197, 94, 0.3)",
      gap: theme.spacing.custom(6),
    },
    pulsingDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.accent.green,
    },
    activeText: {
      color: theme.accent.green,
      fontSize: 12,
      fontWeight: "bold",
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.custom(10),
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      borderColor: "rgba(150, 150, 150, 0.2)",
    },
    statusBadgePending: {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
    },
    statusBadgeEnded: {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    statusTextPending: {
      color: "#3B82F6",
    },
    statusTextEnded: {
      color: theme.text.muted,
    },
    metaIconSpacing: {
      marginRight: theme.spacing.xs,
    },
    cardStats: {
      flexDirection: "row",
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(6),
    },
    statText: {
      fontSize: 13,
      color: theme.text.secondary,
    },
    classInfoBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      padding: theme.spacing.custom(10),
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: theme.spacing.md,
    },
    classInfoText: {
      fontSize: 12,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      width: "100%",
      marginBottom: theme.spacing.md,
      backgroundColor: theme.surface.glassBorder,
    },
    cardActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.custom(10),
      borderRadius: 12,
      gap: theme.spacing.sm,
    },
    actionBtnPrimary: {
      backgroundColor: isDark
        ? "rgba(59, 130, 246, 0.15)"
        : "rgba(59, 130, 246, 0.1)",
    },
    actionBtnText: {
      color: theme.accent.blue,
      fontWeight: "600",
      fontSize: 14,
    },
    iconActions: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconBtnNeutral: {
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    iconBtnDanger: {
      backgroundColor: "rgba(239, 68, 68, 0.15)",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing["2xl"],
      marginTop: theme.spacing.custom(20),
    },
    emptyIcon: {
      opacity: 0.5,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: theme.spacing.md,
      color: theme.text.muted,
    },
    emptySubText: {
      fontSize: 14,
      marginTop: theme.spacing.sm,
      opacity: 0.7,
      color: theme.text.muted,
    },
    pullIndicator: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: -10,
    },
    pullIndicatorOuter: {
      width: 60,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    pullIndicatorCanvas: {
      position: "absolute",
      width: 60,
      height: 60,
    },
    pullIndicatorInner: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: isDark ? "white" : "rgba(255,255,255,1)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      zIndex: 100,
    },
    pullIndicatorGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.custom(20),
      paddingVertical: theme.spacing.custom(10),
      borderRadius: 24,
      gap: theme.spacing.sm,
    },
    pullText: {
      color: theme.text.primary,
      fontWeight: "600",
    },
    modalAnimatedWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: theme.spacing.custom(18),
      marginBottom: theme.spacing.custom(10),
    },
    modalHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(10),
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      padding: theme.spacing.custom(20),
    },
    modalContent: {
      borderRadius: 24,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.custom(22),
      borderWidth: 1,
    },
    modalSurface: {
      borderColor: theme.border.modal,
    },
    modalTitle: {
      fontSize: 24,
      marginLeft: theme.spacing.custom(9),
      fontWeight: "bold",
      color: theme.text.primary,
    },
    modalTitleLarge: {
      fontSize: 22,
      marginLeft: 0,
    },
    modalCloseButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalBody: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.custom(10),
    },
    inputGroup: {
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
      color: theme.text.secondary,
    },
    modalInput: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.modal,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      paddingHorizontal: theme.spacing.md,
      color: theme.text.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    modalActions: {
      flexDirection: "row",
      gap: theme.spacing.custom(12),
      marginTop: theme.spacing.custom(12),
      padding: theme.spacing.custom(20),
      paddingTop: theme.spacing.custom(10),
    },
    modalBtn: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    modalBtnSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border.secondary,
    },
    modalBtnText: {
      fontSize: 16,
      fontWeight: "600",
    },
    modalBtnTextSecondary: {
      color: theme.text.secondary,
    },
    modalBtnWrapper: {
      flex: 1,
    },
    modalBtnPrimary: {
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    modalBtnTextPrimary: {
      color: theme.text.primary,
      fontWeight: "700",
    },
  };
});
