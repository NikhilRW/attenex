import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: theme.text.muted,
  },
  checkboxSelected: {
    backgroundColor: theme.primary.main,
    borderColor: theme.primary.main,
  },
  rememberText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.primary.main,
  },
}));
