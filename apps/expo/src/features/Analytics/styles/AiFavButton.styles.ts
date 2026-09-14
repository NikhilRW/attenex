import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  favButtonIcon: {
    height: theme.size.lg,
    width: theme.size.lg,
    tintColor: "#ffffff",
  },
  favButtonContainer: {
    height: 55,
    width: 55,
    backgroundColor: theme.primary.glow,
    borderRadius: theme.size.custom(1000),
    position: "absolute",
    bottom: theme.size["6xl"],
    right: theme.size.lg,
    justifyContent: "center",
    alignItems: "center",
  },
}));
