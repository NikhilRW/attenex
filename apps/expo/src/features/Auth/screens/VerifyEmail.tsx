import FuturisticButton from "@auth/components/common/FuturisticButton";
import VerifyEmailHelp from "@auth/components/VerifyEmail/VerifyEmailHelp";
import VerifyEmailIcon from "@auth/components/VerifyEmail/VerifyEmailIcon";
import VerifyEmailMessage from "@auth/components/VerifyEmail/VerifyEmailMessage";
import { useVerifyEmail } from "@auth/hooks/useVerifyEmail";
import { styles } from "@auth/styles/VerifyEmail.style";
import React from "react";
import { View } from "react-native";

/**
 * Verify Email Screen
 *
 * Displays a success message after user signs up, informing them
 * that a verification email has been sent to their inbox.
 */
const VerifyEmail = () => {
  const { handleBackToSignIn } = useVerifyEmail();

  return (
    <View style={styles.container}>
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
