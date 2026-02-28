import { verifyEmailStyles as styles } from "@auth/styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { View } from "react-native";

const VerifyEmailIcon = () => {
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

export default VerifyEmailIcon;