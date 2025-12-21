import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
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
  errorTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  errorDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  formContainer: {
    gap: 24,
  },
  greeting: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 8,
  },
  requirementsContainer: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  requirementText: {
    fontSize: 14,
  },
});
