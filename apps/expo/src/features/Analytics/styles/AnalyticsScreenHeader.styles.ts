import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  headerContainer: {
    marginBottom: theme.spacing.lg,
  },
  headerText: {
    color: theme.text.primary,
    fontSize: theme.typography.h2,
    fontWeight: "bold",
  },
}));
