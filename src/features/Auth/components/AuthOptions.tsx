import { colors } from "@/src/shared/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AuthOptionsProps {
    rememberMe: boolean;
    onToggleRememberMe: () => void;
    onForgotPassword?: () => void;
}

export const AuthOptions: React.FC<AuthOptionsProps> = ({
    rememberMe,
    onToggleRememberMe,
    onForgotPassword,
}) => {
    return (
        <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.rememberMe} onPress={onToggleRememberMe}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#000" />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
        borderColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxActive: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.main,
    },
    rememberText: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
    },
    forgotText: {
        color: colors.primary.light,
        fontSize: 14,
        fontWeight: "600",
    },
});
