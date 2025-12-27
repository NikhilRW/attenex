import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rememberMe: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    rememberText: {
        fontSize: 14,
    },
    forgotText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
