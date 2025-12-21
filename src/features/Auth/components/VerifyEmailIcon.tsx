import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { styles } from "../styles/VerifyEmail.style";

export const VerifyEmailIcon = () => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.iconContainer,
                { backgroundColor: colors.primary.glow },
            ]}
        >
            <Ionicons
                name="mail-outline"
                size={64}
                color={colors.primary.main}
            />
        </View>
    );
};
