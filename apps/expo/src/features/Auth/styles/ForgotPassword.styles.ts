import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: theme.surface.glass,
  },
  formContainer: {
    gap: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
    color: theme.text.secondary,
  },
  backToSignIn: {
    alignItems: "center",
    marginTop: 8,
  },
  backToSignInText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  signInLink: {
    fontWeight: "700",
    color: theme.primary.main,
  },
  successContainer: {
    gap: 24,
    alignItems: "center",
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
    color: theme.text.secondary,
  },
  emailText: {
    fontWeight: "700",
    color: theme.primary.main,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: -8,
    color: theme.text.muted,
  },
  helpContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
    color: theme.text.secondary,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.primary.main,
  },
}));
