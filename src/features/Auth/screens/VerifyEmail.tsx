import {
  FuturisticButton,
  VerifyEmailHelp,
  VerifyEmailIcon,
  VerifyEmailMessage,
} from "@auth/components";
import { useVerifyEmail } from "@auth/hooks";
import { verifyEmailStyles as styles } from "@auth/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

/**
 * Verify Email Screen
 *
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const { colors, isDark } = useTheme();
  const { handleBackToSignIn } = useVerifyEmail();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <FuturisticBackground />

      <View style={styles.content}>
        <View style={styles.successContainer}>
          <VerifyEmailIcon />
          <VerifyEmailMessage />

          <FuturisticButton
            title="Back to Sign In"
            onPress={handleBackToSignIn}
          />

          <VerifyEmailHelp />
        </View>
      </View>
    </View>
  );
};

export default VerifyEmail;
