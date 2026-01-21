import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create({
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
  },
  formContainer: {
    gap: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  backToSignIn: {
    alignItems: "center",
    marginTop: 8,
  },
  backToSignInText: {
    fontSize: 14,
  },
  signInLink: {
    fontWeight: "700",
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
  },
  emailText: {
    fontWeight: "700",
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: -8,
  },
  helpContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  helpText: {
    fontSize: 14,
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
