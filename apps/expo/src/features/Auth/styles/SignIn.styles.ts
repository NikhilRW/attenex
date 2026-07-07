import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.custom(30),
    paddingBottom: theme.spacing["2xl"],
  },
  formContainer: {
    gap: theme.spacing.lg,
  },
}));
