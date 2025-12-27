import { roleSelectionStyles as styles } from "@role-selection/styles";
import { ConfirmButtonProps } from "@role-selection/types";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
    selectedRole,
    isUpdating,
    userRole,
    bottomInset,
    onConfirm,
}) => {
    const { colors } = useTheme();

    const getButtonText = () => {
        if (userRole) {
            return `You are ${userRole}`;
        }
        if (selectedRole) {
            return `Continue as ${selectedRole}`;
        }
        return "Select a role";
    };

    return (
        <TouchableOpacity
            style={[
                styles.confirmButton,
                {
                    marginBottom: 70 + bottomInset * 2,
                },
                (!selectedRole || isUpdating) && styles.confirmButtonDisabled,
                { shadowColor: colors.primary.main },
            ]}
            onPress={onConfirm}
            disabled={!selectedRole || isUpdating}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={
                    selectedRole && !isUpdating
                        ? [colors.primary.main, colors.accent.blue]
                        : [colors.surface.glassBorder, colors.surface.glass]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmGradient}
            >
                {isUpdating ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text
                        style={[
                            styles.confirmButtonText,
                            !selectedRole && !isUpdating && { opacity: 0.7 },
                        ]}
                    >
                        {getButtonText()}
                    </Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};
