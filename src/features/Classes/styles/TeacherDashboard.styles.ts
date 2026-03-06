import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.colorScheme === "dark";

  return {
    container: {
      flex: 1,
      paddingTop: 15,
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
      padding: 20,
      paddingTop: 20,
      paddingBottom: 100,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    headerSubtitle: {
      fontSize: 16,
      marginTop: 4,
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
      marginBottom: 24,
      marginHorizontal: -20,
      flex: 1,
    },
    statsContent: {
      paddingHorizontal: 20,
      gap: 12,
    },
    statsCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      minWidth: 160,
      gap: 12,
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
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
      gap: 10,
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
      borderColor: theme.surface.glassBorder,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text.primary,
    },
    listContainer: {
      gap: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.text.primary,
    },
    lectureCard: {
      borderRadius: 24,
      borderWidth: 1,
      padding: 20,
      marginBottom: 16,
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
      marginBottom: 16,
    },
    cardTitleContainer: {
      flex: 1,
      marginRight: 12,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 4,
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
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(34, 197, 94, 0.3)",
      gap: 6,
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
      paddingHorizontal: 10,
      paddingVertical: 4,
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
      marginRight: 4,
    },
    cardStats: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 16,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    statText: {
      fontSize: 13,
      color: theme.text.secondary,
    },
    classInfoBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 16,
    },
    classInfoText: {
      fontSize: 12,
      fontWeight: "500",
    },
    divider: {
      height: 1,
      width: "100%",
      marginBottom: 16,
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
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 8,
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
      gap: 8,
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
      padding: 40,
      marginTop: 20,
    },
    emptyIcon: {
      opacity: 0.5,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 16,
      color: theme.text.muted,
    },
    emptySubText: {
      fontSize: 14,
      marginTop: 8,
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
      backgroundColor: isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.8)",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    pullIndicatorGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 24,
      gap: 8,
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
      paddingHorizontal: 18,
      marginBottom: 10,
    },
    modalHeaderLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.background.overlay,
      justifyContent: "center",
      padding: 20,
    },
    modalContent: {
      borderRadius: 24,
      paddingHorizontal: 8,
      paddingVertical: 22,
      borderWidth: 1,
    },
    modalSurface: {
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)",
    },
    modalTitle: {
      fontSize: 24,
      marginLeft: 9,
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
      paddingHorizontal: 24,
      paddingTop: 10,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.text.secondary,
    },
    modalInput: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      paddingHorizontal: 16,
      color: theme.text.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
      padding: 20,
      paddingTop: 10,
    },
    modalBtn: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    modalBtnSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
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
