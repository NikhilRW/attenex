import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 26,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    letterSpacing: 0.4,
    fontFamily: "Inter_700Bold",
  },
  buttonPressable: {},
  buttonGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    zIndex: -1,
    boxShadow: [
      {
        blurRadius: 16,
        offsetX: 0,
        offsetY: 0,
        color: `${theme.primary.main}60`,
      },
    ],
    shadowColor: theme.primary.main,
  },
}));
