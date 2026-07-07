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
    paddingTop: theme.spacing.custom(60),
    paddingBottom: theme.spacing.custom(70),
  },
  formContainer: {
    gap: theme.spacing.lg,
  },
}));
