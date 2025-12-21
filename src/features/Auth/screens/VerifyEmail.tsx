import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { FuturisticButton } from "../components/FuturisticButton";
import { VerifyEmailHelp } from "../components/VerifyEmailHelp";
import { VerifyEmailIcon } from "../components/VerifyEmailIcon";
import { VerifyEmailMessage } from "../components/VerifyEmailMessage";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { styles } from "../styles/VerifyEmail.style";

/**
 * Verify Email Screen
 *
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const { colors, mode } = useTheme();
  const { handleBackToSignIn } = useVerifyEmail();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
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
