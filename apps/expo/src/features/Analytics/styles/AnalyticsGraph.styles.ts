import { StyleSheet } from "react-native-unistyles";

export const styles = StyleSheet.create((theme) => ({
  graphContainer: {
    height: 210,
  },
  graph: {
    height: 200,
  },
  hideGraph: {
    width: 0,
    height: 0,
  },
  loaderContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataFoundContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataFoundText: {
    textAlign: "center",
    fontSize: theme.typography.xxl,
    fontWeight: "bold",
    color: theme.text.secondary,
    opacity: 0.8,
    marginTop: theme.spacing.sm,
  },
  noDataFoundIcon: {
    opacity: 0.8,
  },
}));
