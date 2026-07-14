import React from "react";
import { Text } from "react-native";

import { styles } from "@auth/styles/VerifyEmail.style";

const VerifyEmailMessage = () => {
  return (
    <>
      <Text style={styles.successTitle}>Check Your Inbox!</Text>

      <Text style={styles.successDescription}>
        We&apos;ve sent a verification email to your inbox. Please click the link in the email to
        verify your account.
      </Text>

      <Text style={styles.instructionText}>
        The verification link will expire in 24 hours. If you don&apos;t see the email, check your
        spam folder.
      </Text>
    </>
  );
};

export default VerifyEmailMessage;
