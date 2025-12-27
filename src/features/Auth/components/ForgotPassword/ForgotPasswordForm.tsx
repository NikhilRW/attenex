import { FuturisticButton, FuturisticInput } from "@auth/components/common";
import { forgotPasswordStyles as styles } from "@auth/styles";
import { ForgotPasswordFormProps } from "@auth/types/props";
import { useTheme } from "@shared/hooks/useTheme";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  isLoading,
  handleRequestReset,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={styles.formContainer}>
      <Text style={[styles.description, { color: colors.text.secondary }]}>
        Enter your email address and we&apos;ll send you a link to reset your
        password.
      </Text>

      <FuturisticInput
        label="EMAIL ADDRESS"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <FuturisticButton
        title="Send Reset Link"
        onPress={handleRequestReset}
        disabled={isLoading}
        loading={isLoading}
      />
      <TouchableOpacity
        style={styles.backToSignIn}
        onPress={() => router.back()}
      >
        <Text
          style={[styles.backToSignInText, { color: colors.text.secondary }]}
        >
          Remember your password?{" "}
          <Text style={[styles.signInLink, { color: colors.primary.main }]}>
            Sign In
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordForm;
