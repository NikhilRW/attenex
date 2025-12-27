import { verifyEmailStyles as styles } from "@auth/styles";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text, View } from "react-native";

const VerifyEmailHelp = () => {
    const { colors } = useTheme();

    return (
        <View style={styles.helpContainer}>
            <Text style={[styles.helpText, { color: colors.text.secondary }]}>
                Need help?
            </Text>
            <Text style={[styles.contactText, { color: colors.text.muted }]}>
                Contact support if you don&apos;t receive the email
            </Text>
        </View>
    );
};

export default VerifyEmailHelp;