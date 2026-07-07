import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      paddingTop: theme.spacing.custom(20),
      paddingBottom: theme.spacing.custom(20),
      paddingHorizontal: theme.spacing.custom(20),
      borderBottomWidth: 1,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      zIndex: 10,
      borderBottomColor: theme.surface.glassBorder,
    },
    headerTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.custom(20),
    },
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? theme.surface.glass : "rgba(0, 0, 0, 0.05)",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    summaryButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitleContainer: {
      alignItems: "center",
      flex: 1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: theme.text.primary,
    },
    headerSubtitle: {
      fontSize: 14,
      marginTop: theme.spacing.xxs,
      opacity: 0.7,
      color: theme.text.secondary,
    },
    searchContainer: {
      width: "100%",
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      height: 46,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      backgroundColor: isDark ? theme.surface.glass : "rgba(0, 0, 0, 0.05)",
      borderColor: theme.surface.glassBorder,
    },
    searchInput: {
      flex: 1,
      marginLeft: theme.spacing.custom(10),
      fontSize: 15,
      height: "100%",
      color: theme.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.custom(20),
      gap: theme.spacing.custom(10),
    },
    spacerBottom: {
      height: 40,
    },
    statsContainer: {
      flexDirection: "row",
      gap: theme.spacing.custom(12),
      marginBottom: theme.spacing.lg,
    },
    statCard: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      borderRadius: 20,
      borderWidth: 1,
      gap: theme.spacing.custom(12),
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "rgba(74, 222, 128, 0.2)",
      alignItems: "center",
      justifyContent: "center",
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.spacing.xxs,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "800",
    },
    filterContainer: {
      flexDirection: "row",
      gap: theme.spacing.custom(10),
      marginBottom: theme.spacing.custom(20),
    },
    filterButton: {
      flex: 1,
      paddingVertical: theme.spacing.custom(12),
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    filterButtonInactive: {
      backgroundColor: isDark ? theme.surface.glass : "rgba(0, 0, 0, 0.05)",
      borderWidth: 1,
      borderColor: theme.surface.glassBorder,
    },
    filterButtonAll: {
      backgroundColor: theme.primary.main,
    },
    filterButtonPresent: {
      backgroundColor: "#4ADE80",
    },
    filterButtonIncomplete: {
      backgroundColor: "#FBBF24",
    },
    filterButtonAbsent: {
      backgroundColor: "#F87171",
    },
    filterButtonText: {
      fontSize: 14,
    },
    filterButtonTextActive: {
      color: "white",
      fontWeight: "700",
    },
    filterButtonTextInactive: {
      color: theme.text.secondary,
      fontWeight: "500",
    },
    loadingContainer: {
      padding: theme.spacing["2xl"],
      alignItems: "center",
    },
    listContainer: {
      gap: theme.spacing.custom(12),
    },
    emptyState: {
      padding: theme.spacing["2xl"],
      borderRadius: 24,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
      backgroundColor: isDark ? theme.surface.glass : "rgba(0,0,0,0.02)",
      borderColor: theme.surface.glassBorder,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.md,
      opacity: 0.5,
    },
    emptyStateText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.muted,
    },
    studentCard: {
      borderRadius: 20,
      borderWidth: 1,
      borderLeftWidth: 4,
      padding: theme.spacing.md,
      overflow: "hidden",
      backgroundColor: isDark
        ? theme.surface.cardBg
        : "rgba(255, 255, 255, 0.7)",
      borderColor: theme.surface.glassBorder,
    },
    studentCardPresent: {
      borderLeftColor: "#4ADE80",
    },
    studentCardIncomplete: {
      borderLeftColor: "#FBBF24",
    },
    studentCardAbsent: {
      borderLeftColor: "#F87171",
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    avatarText: {
      fontSize: 18,
      fontWeight: "700",
    },
    avatarTextPresent: {
      color: "#4ADE80",
    },
    avatarTextIncomplete: {
      color: "#FBBF24",
    },
    avatarTextAbsent: {
      color: "#F87171",
    },
    infoContainer: {
      flex: 1,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(6),
      marginBottom: theme.spacing.xs,
    },
    studentName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text.primary,
    },
    rollNo: {
      fontSize: 13,
      marginBottom: theme.spacing.custom(6),
      color: theme.text.secondary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    metaText: {
      fontSize: 11,
      fontWeight: "500",
      color: theme.text.muted,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: theme.text.muted,
      marginHorizontal: theme.spacing.sm,
    },
    statusContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: theme.spacing.sm,
    },
    rollBadge: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.custom(12),
      paddingVertical: theme.spacing.sm,
      borderRadius: 10,
      backgroundColor: "rgba(74, 222, 128, 0.1)",
    },
    rollText: {
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.5,
      color: "#4ADE80",
    },
    absentBadge: {
      paddingHorizontal: theme.spacing.custom(10),
      paddingVertical: theme.spacing.custom(6),
      borderRadius: 8,
    },
    absentBadgeIncomplete: {
      backgroundColor: "rgba(251, 191, 36, 0.1)",
    },
    absentBadgeAbsent: {
      backgroundColor: "rgba(248, 113, 113, 0.1)",
    },
    absentText: {
      fontSize: 12,
      fontWeight: "800",
    },
    absentTextIncomplete: {
      color: "#FBBF24",
    },
    absentTextAbsent: {
      color: "#F87171",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.custom(20),
    },
    modalAnimatedWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    modalAnimatedWrapperWide: {
      width: "100%",
      maxWidth: 500,
    },
    modalContent: {
      width: "100%",
      maxWidth: 500,
      borderRadius: 24,
      paddingHorizontal: theme.spacing.custom(14),
      paddingVertical: theme.spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      borderWidth: 1,
    },
    modalSurface: {
      borderColor: theme.border.modal,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.custom(20),
      paddingHorizontal: theme.spacing.custom(10),
    },
    modalHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(10),
    },
    modalHeaderIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text.primary,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    },
    modalBody: {
      paddingHorizontal: theme.spacing.lg,
    },
    modalBodyTop: {
      paddingTop: theme.spacing.custom(10),
    },
    rollNumberBox: {
      borderRadius: 16,
      borderWidth: 1,
      padding: theme.spacing.custom(20),
      marginBottom: theme.spacing.custom(20),
      minHeight: 80,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      borderColor: theme.border.modal,
    },
    rollNumberText: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "500",
      color: theme.text.primary,
    },
    modalStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: theme.spacing.custom(20),
      paddingVertical: theme.spacing.md,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: theme.spacing.xs,
    },
    statLabelSmall: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      color: theme.text.secondary,
    },
    copyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.custom(14),
      borderRadius: 12,
      gap: theme.spacing.sm,
      borderWidth: 0,
    },
    copyButtonText: {
      color: theme.static.white,
      fontSize: 16,
      fontWeight: "700",
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      backgroundColor: theme.primary.main,
    },
    modalDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: theme.spacing.custom(20),
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text.secondary,
    },
    modalLabelDescription: {
      marginBottom: theme.spacing.custom(12),
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      borderRadius: 16,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      marginBottom: theme.spacing.lg,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      borderColor: theme.border.modal,
    },
    inputContainerError: {
      borderColor: theme.status.error,
      marginBottom: theme.spacing.sm,
    },
    inputIcon: {
      marginRight: theme.spacing.custom(12),
    },
    input: {
      flex: 1,
      fontSize: 16,
      height: "100%",
      color: theme.text.primary,
      fontWeight: "500",
    },
    manualAttendanceError: {
      color: theme.status.error,
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 18,
      marginBottom: theme.spacing.lg,
    },
    modalActions: {
      flexDirection: "row",
      gap: theme.spacing.custom(12),
    },
    modalFooter: {
      flexDirection: "row",
      gap: theme.spacing.custom(12),
      padding: theme.spacing.custom(20),
    },
    modalFooterCompact: {
      borderTopWidth: 0,
      paddingTop: theme.spacing.custom(10),
    },
    actionButton: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: "rgba(150, 150, 150, 0.2)",
    },
    cancelButtonNarrow: {
      width: "30%",
      backgroundColor: "transparent",
      borderColor: theme.border.secondary,
      borderWidth: 2,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text.secondary,
    },
    submitButton: {},
    submitButtonWide: {
      width: "60%",
      height: 48,
      borderRadius: 12,
      flexDirection: "row",
      paddingHorizontal: 5,
    },
    submitButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
    submitButtonIcon: {
      marginLeft: theme.spacing.sm,
    },
  };
});
