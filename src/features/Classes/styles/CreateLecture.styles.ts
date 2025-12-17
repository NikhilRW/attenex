import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 32,
    overflow: "visible",
  },
  inputGroup: {
    marginBottom: 20,
    position: "relative",
  },
  inputGroupLarge: {
    marginBottom: 32,
    position: "relative",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
    opacity: 0.9,
  },
  dropdown: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownMenu: {
    position: "absolute",
    top: "110%",
    left: 0,
    right: 0,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 1000,
  },
  dropdownScroll: {
    maxHeight: 240,
  },
  dropdownItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  addClassButton: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addClassButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  modalInput: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalButtonTextSecondary: {
    fontWeight: "600",
    fontSize: 16,
  },
  modalButtonTextPrimary: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});