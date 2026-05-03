import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    header: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingHorizontal: 20,
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
      marginBottom: 20,
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
      marginTop: 2,
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
      paddingHorizontal: 16,
      borderWidth: 1,
      backgroundColor: isDark ? theme.surface.glass : "rgba(0, 0, 0, 0.05)",
      borderColor: theme.surface.glassBorder,
    },
    searchInput: {
      flex: 1,
      marginLeft: 10,
      fontSize: 15,
      height: "100%",
      color: theme.text.primary,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
      gap: 10,
    },
    spacerBottom: {
      height: 40,
    },
    statsContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      gap: 12,
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
      marginBottom: 2,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "800",
    },
    filterContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 12,
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
      padding: 40,
      alignItems: "center",
    },
    listContainer: {
      gap: 12,
    },
    emptyState: {
      padding: 40,
      borderRadius: 24,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
      backgroundColor: isDark ? theme.surface.glass : "rgba(0,0,0,0.02)",
      borderColor: theme.surface.glassBorder,
    },
    emptyStateIcon: {
      marginBottom: 16,
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
      padding: 16,
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
      marginRight: 16,
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
      gap: 6,
      marginBottom: 4,
    },
    studentName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.text.primary,
    },
    rollNo: {
      fontSize: 13,
      marginBottom: 6,
      color: theme.text.secondary,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
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
      marginHorizontal: 8,
    },
    statusContainer: {
      alignItems: "flex-end",
      justifyContent: "center",
      marginLeft: 8,
    },
    rollBadge: {
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
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
      paddingHorizontal: 10,
      paddingVertical: 6,
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
      backgroundColor: theme.background.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
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
      paddingHorizontal: 14,
      paddingVertical: 24,
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
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    modalHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
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
      paddingHorizontal: 24,
    },
    modalBodyTop: {
      paddingTop: 10,
    },
    rollNumberBox: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 20,
      marginBottom: 20,
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
      marginBottom: 20,
      paddingVertical: 16,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 28,
      fontWeight: "800",
      marginBottom: 4,
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
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
      borderWidth: 0,
    },
    copyButtonText: {
      color: theme.text.primary,
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
      marginBottom: 20,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text.secondary,
    },
    modalLabelDescription: {
      marginBottom: 12,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 56,
      borderRadius: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      marginBottom: 24,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      borderColor: theme.border.modal,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      height: "100%",
      color: theme.text.primary,
      fontWeight: "500",
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
    },
    modalFooter: {
      flexDirection: "row",
      gap: 12,
      padding: 20,
    },
    modalFooterCompact: {
      borderTopWidth: 0,
      paddingTop: 10,
    },
    actionButton: {
      flex: 1,
      height: 48,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    cancelButton: {
      borderWidth: 1,
      borderColor: "rgba(150, 150, 150, 0.2)",
    },
    cancelButtonNarrow: {
      width: "30%",
      backgroundColor: "transparent",
      borderColor: theme.border.secondary,
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
      marginLeft: 8,
    },
  };
});
