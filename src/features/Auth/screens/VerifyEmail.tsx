import {
  FuturisticButton,
  VerifyEmailHelp,
  VerifyEmailIcon,
  VerifyEmailMessage,
} from "@auth/components";
import { useVerifyEmail } from "@auth/hooks";
import { verifyEmailStyles as styles } from "@auth/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useUnistyles } from "react-native-unistyles";

/**
 * Verify Email Screen
 *
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const { rt } = useUnistyles();
  const isDark = useMemo(() => rt.colorScheme === "dark", [rt.colorScheme]);
  const { handleBackToSignIn } = useVerifyEmail();

  return (
    <View style={[styles.container]}>
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
