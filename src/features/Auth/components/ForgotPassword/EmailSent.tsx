import FuturisticButton  from "@auth/components/common/FuturisticButton";
import { styles } from "@auth/styles/ForgotPassword.styles";
import { EmailSentProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";

const MailIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const EmailSent: React.FC<EmailSentProps> = ({
  email,
  setEmailSent,
  emailParam,
  handleRequestReset,
}) => {
  const router = useRouter();

  return (
    <View style={styles.successContainer}>
      <View style={styles.iconContainer}>
        <MailIcon name="mail-outline" size={64} />
      </View>
      <Text style={styles.successTitle}>Check Your Email</Text>
      <Text style={styles.successDescription}>
        We&apos;ve sent a password reset link to{" "}
        <Text style={styles.emailText}>{email}</Text>
      </Text>
      <Text style={styles.instructionText}>
        Click the link in the email to reset your password. The link will expire
        in 1 hour.
      </Text>

      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Didn&apos;t receive the email?</Text>
        <TouchableOpacity
          onPress={() => {
            setEmailSent(false);
            handleRequestReset();
          }}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>Resend Email</Text>
        </TouchableOpacity>
      </View>

      <FuturisticButton
        title={emailParam ? "Back to Home" : "Back to Sign In"}
        onPress={() => router.replace(emailParam ? "/" : "/(auth)/sign-in")}
      />
    </View>
  );
};

export default EmailSent;
