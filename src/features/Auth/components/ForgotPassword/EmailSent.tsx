import { FuturisticButton } from "@auth/components/common";
import { forgotPasswordStyles as styles } from "@auth/styles";
import { EmailSentProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const EmailSent: React.FC<EmailSentProps> = ({
  email,
  setEmailSent,
  emailParam,
  handleRequestReset,
}) => {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.successContainer}>
      <View
        style={[styles.iconContainer, { backgroundColor: colors.primary.glow }]}
      >
        <Ionicons name="mail-outline" size={64} color={colors.primary.main} />
      </View>
      <Text style={[styles.successTitle, { color: colors.text.primary }]}>
        Check Your Email
      </Text>
      <Text
        style={[styles.successDescription, { color: colors.text.secondary }]}
      >
        We&apos;ve sent a password reset link to{" "}
        <Text style={[styles.emailText, { color: colors.primary.main }]}>
          {email}
        </Text>
      </Text>
      <Text style={[styles.instructionText, { color: colors.text.muted }]}>
        Click the link in the email to reset your password. The link will expire
        in 1 hour.
      </Text>

      <View style={styles.helpContainer}>
        <Text style={[styles.helpText, { color: colors.text.secondary }]}>
          Didn&apos;t receive the email?
        </Text>
        <TouchableOpacity
          onPress={() => {
            setEmailSent(false);
            handleRequestReset();
          }}
          style={styles.resendButton}
        >
          <Text style={[styles.resendText, { color: colors.primary.main }]}>
            Resend Email
          </Text>
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
