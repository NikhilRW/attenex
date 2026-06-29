import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  webView: {
    flex: 1, // Takes full screen space
  },
  loadingOverlay: {
    position: "absolute", // Overlay on top of WebView
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // Ensure it appears above WebView
    backgroundColor: theme.background.overlay,
  },
}));
