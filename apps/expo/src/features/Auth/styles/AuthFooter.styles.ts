import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  footerText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.primary.main,
  },
}));
