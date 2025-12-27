import { verifyEmailStyles as styles } from "@auth/styles";
import { useTheme } from "@shared/hooks/useTheme";
import React from "react";
import { Text } from "react-native";

const VerifyEmailMessage = () => {
    const { colors } = useTheme();

    return (
        <>
            <Text style={[styles.successTitle, { color: colors.text.primary }]}>
                Check Your Inbox!
            </Text>

            <Text
                style={[
                    styles.successDescription,
                    { color: colors.text.secondary },
                ]}
            >
                We&apos;ve sent a verification email to your inbox. Please click the
                link in the email to verify your account.
            </Text>

            <Text style={[styles.instructionText, { color: colors.text.muted }]}>
                The verification link will expire in 24 hours. If you don&apos;t see
                the email, check your spam folder.
            </Text>
        </>
    );
};

export default VerifyEmailMessage;