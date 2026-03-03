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
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  successDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -8,
  },
  helpContainer: {
    alignItems: "center",
    gap: 6,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    fontWeight: "600",
  },
  contactText: {
    fontSize: 13,
    textAlign: "center",
  },
}));
