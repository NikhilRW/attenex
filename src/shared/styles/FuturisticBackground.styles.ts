import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((_, rt) => ({
  canvasView: {
    display: rt.colorScheme === "dark" ? "flex" : "none",
  },
}));
