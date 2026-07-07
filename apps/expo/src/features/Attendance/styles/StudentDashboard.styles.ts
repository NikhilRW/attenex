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
      padding: theme.spacing.custom(20),
      paddingTop: theme.spacing.custom(30),
      paddingBottom: theme.spacing.custom(70),
    },
    headerSection: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      marginBottom: theme.spacing.md,
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    classInfoCard: {
      padding: theme.spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: theme.spacing.sm,
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
      marginRight: theme.spacing.custom(12),
    },
    classInfoLabel: {
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: theme.spacing.xs,
      color: theme.text.secondary,
    },
    classInfoValue: {
      fontSize: 18,
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
      fontSize: 18,
      fontWeight: "600",
      marginBottom: theme.spacing.lg,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.custom(60),
      opacity: 0.7,
    },
    emptyText: {
      fontSize: 16,
      marginTop: theme.spacing.md,
      textAlign: "center",
      color: theme.text.muted,
    },
    loadingText: {
      fontSize: 16,
      textAlign: "center",
      color: theme.text.secondary,
      marginTop: theme.spacing.md,
    },
    refreshButton: {
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    refreshButtonFilled: {
      backgroundColor: theme.primary.main,
      borderRadius: 12,
      marginTop: theme.spacing.custom(20),
    },
    refreshText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.primary.main,
    },
    refreshTextOnPrimary: {
      color: theme.text.primary,
    },
    lectureCard: {
      padding: theme.spacing.custom(20),
      borderRadius: 24,
      borderWidth: 1,
      marginBottom: theme.spacing.custom(20),
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
      marginBottom: theme.spacing.md,
    },
    headerLeftContent: {
      flexDirection: "row",
      flex: 1,
      marginRight: theme.spacing.custom(12),
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.custom(12),
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
      marginRight: theme.spacing.xs,
    },
    lectureCardTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: theme.spacing.xs,
      letterSpacing: -0.3,
      lineHeight: 24,
      color: theme.text.primary,
    },
    lectureClassName: {
      fontSize: 14,
      fontWeight: "500",
      opacity: 0.7,
      color: theme.text.secondary,
    },
    liveBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.custom(10),
      paddingVertical: theme.spacing.custom(6),
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
      marginRight: theme.spacing.custom(6),
      backgroundColor: theme.accent.green,
    },
    liveBadgeText: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.5,
      color: theme.accent.green,
    },
    divider: {
      height: 1,
      width: "100%",
      marginBottom: theme.spacing.md,
      opacity: 0.5,
      backgroundColor: theme.surface.glassBorder,
    },
    joinButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    joinButtonText: {
      color: theme.text.primary,
      fontSize: 16,
      fontWeight: "700",
      marginRight: theme.spacing.sm,
    },
    joinIconContainer: {
      backgroundColor: theme.surface.glass,
      borderRadius: 12,
      padding: theme.spacing.xs,
      marginLeft: theme.spacing.sm,
    },
    joinButtonIcon: {
      marginLeft: theme.spacing.xs,
    },
    joinButtonLoader: {
      marginLeft: theme.spacing.sm,
    },
    // Joined State Styles
    joinedContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing.lg,
      margin: theme.spacing.custom(20),
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
      marginBottom: theme.spacing.xl,
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
      fontSize: 28,
      fontWeight: "800",
      marginBottom: theme.spacing.custom(12),
      textAlign: "center",
      letterSpacing: -0.5,
      color: theme.text.primary,
    },
    guardianSubtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: theme.spacing['3xl'],
      lineHeight: 24,
      opacity: 0.8,
      color: theme.text.secondary,
    },
    passcodeCard: {
      width: "100%",
      padding: theme.spacing.lg,
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
      fontSize: 14,
      fontWeight: "600",
      marginBottom: theme.spacing.custom(12),
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
      paddingHorizontal: theme.spacing.md,
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: theme.spacing.custom(20),
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
      fontSize: 16,
      fontWeight: "700",
    },
    ongoingInfo: {
      width: "100%",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
      gap: theme.spacing.md,
    },
    trackingBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.custom(20),
      paddingVertical: theme.spacing.custom(12),
      borderRadius: 20,
      backgroundColor: "rgba(76, 175, 80, 0.15)",
      gap: theme.spacing.sm,
    },
    pulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.accent.green,
    },
    trackingBadgeText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text.primary,
    },
    waitText: {
      fontSize: 14,
      textAlign: "center",
      opacity: 0.7,
      color: theme.text.secondary,
    },
    leaveButtonWrapper: {
      width: "100%",
      marginTop: theme.spacing.md,
    },
    leaveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: theme.spacing.md,
      borderRadius: 16,
      gap: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    leaveButtonText: {
      color: theme.text.primary,
      fontSize: 16,
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
      padding: theme.spacing.custom(20),
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
      padding: theme.spacing.custom(20),
      borderBottomWidth: 1,
      borderBottomColor: theme.surface.glassBorder,
    },
    modalHeaderContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(10),
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
      fontSize: 20,
      fontWeight: "bold",
    },
    modalTitlePrimary: {
      color: theme.text.primary,
    },
    modalTitleLarge: {
      fontSize: 22,
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
      padding: theme.spacing.custom(20),
    },
    modalBodyCompact: {
      paddingTop: theme.spacing.custom(10),
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: theme.spacing.sm,
    },
    modalLabelSecondary: {
      color: theme.text.secondary,
    },
    modalLabelSpaced: {
      marginBottom: theme.spacing.custom(12),
    },
    modalInput: {
      borderWidth: 1,
      borderRadius: 12,
      padding: theme.spacing.custom(14),
      fontSize: 16,
    },
    modalInputText: {
      color: theme.text.primary,
      fontSize: 16,
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
      paddingHorizontal: theme.spacing.md,
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
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 18,
      marginTop: theme.spacing.sm,
    },
    modalFooter: {
      flexDirection: "row",
      gap: theme.spacing.custom(12),
      padding: theme.spacing.custom(20),
      borderTopWidth: 1,
      borderTopColor: theme.surface.glassBorder,
    },
    modalFooterCompact: {
      borderTopWidth: 0,
      paddingTop: theme.spacing.custom(10),
    },
    modalButton: {
      flex: 1,
      padding: theme.spacing.custom(14),
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
      fontSize: 16,
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
      marginTop: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.custom(12),
    },
    trackingText: {
      fontSize: 14,
      fontStyle: "italic",
    },
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: theme.spacing.custom(12),
      marginBottom: rt.insets.bottom,
    },
  };
});
export default styles;
