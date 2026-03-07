import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: theme.primary.glow,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: theme.text.primary,
  },
  successDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 20,
    color: theme.text.secondary,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -8,
    color: theme.text.muted,
  },
  helpContainer: {
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text.secondary,
  },
  contactText: {
    fontSize: 13,
    textAlign: "center",
    color: theme.text.muted,
  },
}));
