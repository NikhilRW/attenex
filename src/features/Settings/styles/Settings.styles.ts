import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => {
  return {
    container: {
      flex: 1,
    },
    header: {
      paddingTop: 30,
      paddingBottom: 20,
      paddingHorizontal: 24,
    },
    headerContent: {
      gap: 4,
    },
    title: {
      fontSize: 32,
      fontWeight: "800",
      letterSpacing: 0.5,
      color: theme.text.primary,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "500",
      opacity: 0.8,
      color: theme.text.secondary,
    },
    content: {
      padding: 20,
      gap: 24,
    },
    bottomSpacer: {
      height: 50,
    },
    section: {
      gap: 12,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 1,
      marginLeft: 4,
      color: theme.text.muted,
    },
    sectionTitleDanger: {
      color: theme.accent.red,
    },
    card: {
      borderRadius: 24,
      borderWidth: 1,
      overflow: "hidden",
    },
    cardSurface: {
      backgroundColor: theme.surface.glassCardBg,
      borderColor: theme.surface.glassBorder,
    },
    dangerCard: {
      backgroundColor: "rgba(239, 68, 68, 0.05)",
      borderColor: "rgba(239, 68, 68, 0.2)",
    },
    profileHeader: {
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    avatarContainer: {
      position: "relative",
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarImage: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFF",
    },
    onlineBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#10B981",
      borderWidth: 2,
      borderColor: theme.surface.cardBg,
    },
    profileInfo: {
      flex: 1,
      gap: 8,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      marginLeft: 4,
    },
    labelSecondary: {
      color: theme.text.secondary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 12,
      height: 44,
      backgroundColor: theme.surface.glass,
      borderColor: theme.surface.glassBorder,
    },
    input: {
      flex: 1,
      fontSize: 15,
      fontWeight: "600",
      height: "100%",
      color: theme.text.primary,
    },
    statsRow: {
      flexDirection: "row",
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.surface.glassBorder,
    },
    statsRowCentered: {
      justifyContent: "center",
      gap: 8,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "700",
    },
    statLabel: {
      fontSize: 11,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    statDivider: {
      width: 1,
      height: "80%",
      alignSelf: "center",
    },
    roleContainer: {
      flexDirection: "row",
      gap: 12,
    },
    optionCard: {
      flex: 1,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: "center",
      gap: 12,
      position: "relative",
    },
    optionCardActive: {
      backgroundColor: "rgba(0, 212, 255, 0.15)",
      borderColor: theme.primary.main,
    },
    optionCardInactive: {
      backgroundColor: theme.surface.glassCardBg,
      borderColor: theme.surface.glassBorder,
    },
    roleCard: {
      flex: 1,
      padding: 16,
      borderRadius: 20,
      borderWidth: 1,
      alignItems: "center",
      gap: 12,
      position: "relative",
    },
    roleIcon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    optionIconActive: {
      backgroundColor: theme.primary.main,
    },
    optionIconInactive: {
      backgroundColor: theme.surface.glass,
    },
    roleText: {
      fontSize: 14,
      fontWeight: "700",
    },
    optionTextActive: {
      color: theme.text.primary,
    },
    optionTextInactive: {
      color: theme.text.secondary,
    },
    checkIcon: {
      position: "absolute",
      top: 12,
      right: 12,
    },
    updateButton: {
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
    },
    updateButtonPrimary: {
      backgroundColor: theme.primary.main,
    },
    updateButtonText: {
      color: "white",
      fontSize: 15,
      fontWeight: "700",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    iconBoxDanger: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: "600",
    },
    rowLabelPrimary: {
      color: theme.text.primary,
    },
    dangerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    dangerLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.text.primary,
    },
    dangerSub: {
      fontSize: 12,
      marginTop: 2,
      color: theme.text.muted,
    },
    divider: {
      height: 1,
      marginLeft: 64,
      backgroundColor: theme.surface.glassBorder,
    },
    emailText: {
      color: theme.text.secondary,
      fontSize: 14,
      fontWeight: "500",
    },
  };
});
