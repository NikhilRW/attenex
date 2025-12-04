import { useTheme } from "@/src/shared/hooks/useTheme";
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
    const { colors } = useTheme();

    return (
        <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.rememberMe} onPress={onToggleRememberMe}>
                <View
                    style={[
                        styles.checkbox,
                        { borderColor: colors.text.muted },
                        rememberMe && {
                            backgroundColor: colors.primary.main,
                            borderColor: colors.primary.main,
                        },
                    ]}
                >
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
                <Text style={[styles.rememberText, { color: colors.text.secondary }]}>
                    Remember me
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onForgotPassword}>
                <Text style={[styles.forgotText, { color: colors.primary.main }]}>
                    Forgot Password
                </Text>
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
