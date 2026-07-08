import { StyleSheet } from "react-native-unistyles";

const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
      backgroundColor: theme.background.secondary,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: theme.background.primary,
    },
    centeredContainer: {
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      padding: theme.rsp.custom(20),
      paddingTop: theme.rsp.custom(30),
      paddingBottom: theme.rsp.custom(70),
    },
    headerSection: {
      marginBottom: theme.rsp.lg,
    },
    title: {
      fontSize: theme.typography.h2,
      fontWeight: "800",
      marginBottom: theme.rsp.md,
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    classInfoCard: {
      padding: theme.rsp.md,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: theme.rsp.sm,
      borderColor: theme.surface.glassBorder,
    },
    classInfoHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    classInfoLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    classInfoIcon: {
      marginRight: theme.rsp.custom(12),
    },
    classInfoLabel: {
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.rsp.xs,
      color: theme.text.secondary,
    },
    classInfoValue: {
      fontSize: theme.typography.xl,
      fontWeight: "700",
      color: theme.text.primary,
    },
    editClassButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
    subtitle: {
      fontSize: theme.typography.xl,
      fontWeight: "600",
      marginBottom: theme.rsp.lg,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.rsp.custom(60),
      opacity: 0.7,
    },
    emptyText: {
      fontSize: theme.typography.lg,
      marginTop: theme.rsp.md,
      textAlign: "center",
      color: theme.text.muted,
    },
    loadingText: {
      fontSize: theme.typography.lg,
      textAlign: "center",
      color: theme.text.secondary,
      marginTop: theme.rsp.md,
    },
    refreshButton: {
      marginTop: theme.rsp.md,
      paddingVertical: theme.rsp.sm,
      paddingHorizontal: theme.rsp.md,
    },
    refreshButtonFilled: {
      backgroundColor: theme.primary.main,
      borderRadius: 12,
      marginTop: theme.rsp.custom(20),
    },
    refreshText: {
      fontSize: theme.typography.lg,
      fontWeight: "600",
      color: theme.primary.main,
    },
    refreshTextOnPrimary: {
      color: theme.text.primary,
    },
    lectureCard: {
      padding: theme.rsp.custom(20),
      borderRadius: 24,
      borderWidth: 1,
      marginBottom: theme.rsp.custom(20),
      borderColor: theme.surface.glassBorder,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    lectureCardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.rsp.md,
    },
    headerLeftContent: {
      flexDirection: "row",
      flex: 1,
      marginRight: theme.rsp.custom(12),
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.rsp.custom(12),
      backgroundColor: isDark ? "rgba(255 255 255 / 0.12)" : "rgba(0,0,0,0.04)",
    },
    lectureInfo: {
      flex: 1,
      justifyContent: "center",
    },
    lectureMetaRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    lectureMetaIcon: {
      marginRight: theme.rsp.xs,
    },
    lectureCardTitle: {
      fontSize: theme.typography.xl,
      fontWeight: "700",
      marginBottom: theme.rsp.xs,
      letterSpacing: -0.3,
      lineHeight: 24,
      color: theme.text.primary,
    },
    lectureClassName: {
      fontSize: theme.typography.md,
      fontWeight: "500",
      opacity: 0.7,
      color: theme.text.secondary,
    },
    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.rsp.custom(10),
      paddingVertical: theme.rsp.custom(6),
      borderRadius: 12,
      backgroundColor: isDark
        ? "rgba(76, 175, 80, 0.2)"
        : "rgba(76, 175, 80, 0.1)",
      borderColor: "rgba(76, 175, 80, 0.3)",
      borderWidth: 1,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: theme.rsp.custom(6),
      backgroundColor: theme.accent.green,
    },
    liveBadgeText: {
      fontSize: theme.typography.sm,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: theme.accent.green,
    },
    divider: {
      height: 1,
      width: "100%",
      marginBottom: theme.rsp.md,
      opacity: 0.5,
      backgroundColor: theme.surface.glassBorder,
    },
    joinButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.rsp.md,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    joinButtonText: {
      color: theme.text.primary,
      fontSize: theme.typography.lg,
      fontWeight: "700",
      marginRight: theme.rsp.sm,
    },
    joinIconContainer: {
      backgroundColor: theme.surface.glass,
      borderRadius: 12,
      padding: theme.rsp.xs,
      marginLeft: theme.rsp.sm,
    },
    joinButtonIcon: {
      marginLeft: theme.rsp.xs,
    },
    joinButtonLoader: {
      marginLeft: theme.rsp.sm,
    },
    // Joined State Styles
    joinedContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.rsp.lg,
      margin: theme.rsp.custom(20),
      borderRadius: 24,
      backgroundColor: theme.surface.cardBg,
      borderColor: theme.surface.glassBorder,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    guardianIconOuter: {
      marginBottom: theme.rsp.xl,
      shadowColor: theme.accent.green,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
    },
    guardianIconInner: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: theme.surface.glassBorder,
    },
    guardianTitle: {
      fontSize: theme.typography.h3,
      fontWeight: "800",
      marginBottom: theme.rsp.custom(12),
      textAlign: "center",
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    guardianSubtitle: {
      fontSize: theme.typography.lg,
      textAlign: "center",
      marginBottom: theme.spacing['3xl'],
      lineHeight: 24,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    passcodeCard: {
      width: "100%",
      padding: theme.rsp.lg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.surface.glassBorder,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(255, 255, 255, 0.6)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    passcodeLabel: {
      fontSize: theme.typography.md,
      fontWeight: "600",
      marginBottom: theme.rsp.custom(12),
      textTransform: "uppercase",
      letterSpacing: 1,
      opacity: 0.7,
      color: theme.text.secondary,
    },
    passcodeInput: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.surface.glassBorder,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.5)",
      paddingHorizontal: theme.rsp.md,
      fontSize: theme.typography.xl,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.rsp.custom(20),
      color: theme.text.primary,
    },
    lectureTitleHighlight: {
      fontWeight: "700",
      color: theme.primary.main,
    },
    submitButton: {
      height: 56,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonText: {
      color: theme.text.primary,
      fontSize: theme.typography.lg,
      fontWeight: "700",
    },
    ongoingInfo: {
      width: "100%",
      alignItems: "center",
      marginBottom: theme.rsp.xl,
      gap: theme.rsp.md,
    },
    trackingBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.rsp.custom(20),
      paddingVertical: theme.rsp.custom(12),
      borderRadius: 20,
      backgroundColor: "rgba(76, 175, 80, 0.15)",
      gap: theme.rsp.sm,
    },
    pulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accent.green,
    },
    trackingBadgeText: {
      fontSize: theme.typography.md,
      fontWeight: "600",
      color: theme.text.primary,
    },
    waitText: {
      fontSize: theme.typography.md,
      textAlign: "center",
      opacity: 0.7,
      color: theme.text.secondary,
    },
    leaveButtonWrapper: {
      width: "100%",
      marginTop: theme.rsp.md,
    },
    leaveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.rsp.md,
      borderRadius: 16,
      gap: theme.rsp.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    leaveButtonText: {
      color: theme.text.primary,
      fontSize: theme.typography.lg,
      fontWeight: "700",
    },
    leaveLectureTitleHighlight: {
      fontWeight: "700",
      color: theme.primary.main,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.rsp.custom(20),
    },
    modalContent: {
      width: "100%",
      maxWidth: 400,
      borderRadius: 24,
      overflow: "hidden",
    },
    modalAnimatedWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    modalSurfaceElevated: {
      borderColor: theme.border.modal,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.rsp.custom(20),
      borderBottomWidth: 1,
      borderBottomColor: theme.surface.glassBorder,
    },
    modalHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.rsp.custom(10),
    },
    modalHeaderIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitle: {
      fontSize: theme.typography.xl,
      fontWeight: "bold",
    },
    modalTitlePrimary: {
      color: theme.text.primary,
    },
    modalTitleLarge: {
      fontSize: theme.typography.xxl,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButtonSubtle: {
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
    },
    modalBody: {
      padding: theme.rsp.custom(20),
    },
    modalBodyCompact: {
      paddingTop: theme.rsp.custom(10),
    },
    modalLabel: {
      fontSize: theme.typography.md,
      fontWeight: "600",
      marginBottom: theme.rsp.sm,
    },
    modalLabelSecondary: {
      color: theme.text.secondary,
    },
    modalLabelSpaced: {
      marginBottom: theme.rsp.custom(12),
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: 12,
      padding: theme.rsp.custom(14),
      fontSize: theme.typography.lg,
    },
    modalInputText: {
      color: theme.text.primary,
      fontSize: theme.typography.lg,
      fontWeight: "500",
    },
    modalInputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border.modal,
      paddingHorizontal: theme.rsp.md,
      height: 56,
    },
    modalInputField: {
      color: theme.text.primary,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.03)",
      borderColor: theme.surface.glassBorder,
    },
    inputContainerError: {
      borderColor: theme.status.error,
    },
    rollnoModalError: {
      color: theme.status.error,
      fontSize: theme.typography.sm,
      fontWeight: "600",
      lineHeight: 18,
      marginTop: theme.rsp.sm,
    },
    modalFooter: {
      flexDirection: "row",
      gap: theme.rsp.custom(12),
      padding: theme.rsp.custom(20),
      borderTopWidth: 1,
      borderTopColor: theme.surface.glassBorder,
    },
    modalFooterCompact: {
      borderTopWidth: 0,
      paddingTop: theme.rsp.custom(10),
    },
    modalButton: {
      flex: 1,
      padding: theme.rsp.custom(14),
      borderRadius: 12,
      alignItems: "center",
    },
    modalButtonWrapper: {
      flex: 1,
    },
    modalButtonSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border.secondary,
    },
    modalButtonPrimary: {
      borderWidth: 0,
    },
    modalButtonSoft: {
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(0, 0, 0, 0.05)",
    },
    modalButtonText: {
      fontSize: theme.typography.lg,
      fontWeight: "600",
    },
    modalButtonTextPrimary: {
      color: theme.text.primary,
    },
    modalButtonTextSecondary: {
      color: theme.text.secondary,
    },
    modalButtonTextBold: {
      fontWeight: "700",
    },
    trackingIndicator: {
      marginTop: theme.rsp.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.rsp.custom(12),
    },
    trackingText: {
      fontSize: theme.typography.md,
      fontStyle: "italic",
    },
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: theme.rsp.custom(12),
      marginBottom: rt.insets.bottom,
    },
  };
});
export default styles;
