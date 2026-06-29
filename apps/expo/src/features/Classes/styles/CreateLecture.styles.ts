import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme, rt) => {
  const isDark = rt.themeName === "dark";

  return {
    container: {
      flex: 1,
    },
    screenFill: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
      borderRadius: 12,
      backgroundColor: theme.surface.glass,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text.primary,
    },
    scrollView: {
      flex: 1,
      flexGrow: 1,
    },
    scrollContent: {
      padding: 20,
      flex: 1,
    },
    card: {
      borderRadius: 24,
      padding: 24,
      marginBottom: 32,
      overflow: "hidden",
      borderColor: theme.surface.glassBorder,
    },
    cardEyebrow: {
      color: theme.text.secondary,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 16,
    },
    sectionDivider: {
      height: 1,
      backgroundColor: theme.surface.glassBorder,
      marginVertical: 14,
    },
    inputGroup: {
      marginBottom: 20,
      position: "relative",
    },
    inputGroupLarge: {
      marginBottom: 12,
      position: "relative",
    },
    inputGroupTopic: {
      zIndex: 10,
    },
    inputGroupDuration: {
      zIndex: 15,
    },
    inputGroupClassSelector: {
      zIndex: 20,
    },
    customDurationGroup: {
      marginTop: 10,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 10,
      marginLeft: 4,
      opacity: 0.9,
      color: theme.text.secondary,
    },
    dropdown: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.5)",
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
    dropdownMenu: {
      position: "absolute",
      top: "110%",
      left: 0,
      right: 0,
      borderRadius: 16,
      borderWidth: 1,
      overflow: "hidden",
      zIndex: 1000,
    },
    dropdownScroll: {
      maxHeight: 240,
      paddingHorizontal: 9,
      marginTop: 9,
    },
    dropdownItem: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownItemText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text.primary,
    },
    addClassButton: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    addClassButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.primary.main,
    },
    textInput: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: "500",
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(255, 255, 255, 0.5)",
      borderColor: theme.surface.glassBorder,
      color: theme.text.primary,
    },
    primaryButton: {
      padding: 18,
      borderRadius: 16,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
      marginTop: 16,
      backgroundColor: theme.primary.main,
    },
    primaryButtonDisabled: {
      opacity: 0.7,
    },
    primaryButtonText: {
      color: theme.text.primary,
      fontWeight: "bold",
      fontSize: 18,
      letterSpacing: 0.5,
    },
    infoCard: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 16,
      padding: 16,
      gap: 12,
      backgroundColor: theme.surface.cardBg,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: theme.text.secondary,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalContent: {
      width: "100%",
      borderRadius: 24,
      padding: 32,
    },
    modalAnimatedWrapper: {
      width: "100%",
      maxWidth: 400,
    },
    modalBackdrop: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    modalSurface: {
      borderColor: theme.border.modal,
      borderWidth: 1,
    },
    modalSurfaceFlat: {
      padding: 0,
      overflow: "hidden",
    },
    modalSurfaceElevated: {
      borderColor: theme.border.modal,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
    },
    modalHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDark
        ? "rgba(255,255,255,0.05)"
        : "rgba(125,125,125,0.3)",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
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
    modalBody: {
      padding: 24,
    },
    modalLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.text.secondary,
      marginBottom: 12,
      marginLeft: 4,
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
      paddingHorizontal: 16,
      height: 56,
      marginBottom: 8,
    },
    modalInputRowError: {
      borderColor: theme.status.error,
      marginBottom: 4,
    },
    modalInput: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      fontSize: 16,
      marginBottom: 24,
      color: theme.text.primary,
      backgroundColor: isDark
        ? "rgba(0, 0, 0, 0.3)"
        : "rgba(255, 255, 255, 0.8)",
      borderColor: theme.border.modal,
      fontWeight: "500",
    },
    modalInputText: {
      flex: 1,
      color: theme.text.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    modalErrorText: {
      color: theme.status.error,
      fontSize: 13,
      fontWeight: "600",
      lineHeight: 18,
      marginBottom: 8,
      marginLeft: 4,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 16,
    },
    modalFooter: {
      flexDirection: "row",
      gap: 12,
      padding: 20,
      paddingTop: 0,
    },
    modalButton: {
      flex: 1,
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButtonSecondary: {
      borderWidth: 1,
      borderColor: theme.border.secondary,
    },
    modalButtonWrapper: {
      flex: 1,
    },
    modalButtonTextSecondary: {
      fontWeight: "600",
      fontSize: 16,
      color: theme.text.secondary,
    },
    modalButtonTextPrimary: {
      color: theme.text.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    optionsWrapper: {
      padding: 16,
    },
    optionItem: {
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 12,
      marginBottom: 8,
    },
    optionItemSelected: {
      backgroundColor: isDark
        ? "rgba(8, 145, 178, 0.15)"
        : "rgba(8, 145, 178, 0.1)",
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
      padding: 40,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    selectionEmptyIcon: {
      opacity: 0.3,
      marginBottom: 12,
    },
    selectionEmptyText: {
      color: theme.text.muted,
      fontSize: 16,
      textAlign: "center",
    },
    selectionFooter: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.surface.glassBorder,
    },
    addClassCta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: isDark
        ? "rgba(59, 130, 246, 0.1)"
        : "rgba(59, 130, 246, 0.05)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.primary.glow,
      gap: 8,
    },
    addClassCtaText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.primary.main,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: rt.insets.bottom,
      paddingHorizontal: 12,
    },
  };
});
