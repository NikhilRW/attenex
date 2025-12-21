import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FuturisticButton } from "./FuturisticButton";
import { FuturisticInput } from "./FuturisticInput";
import { styles } from "../styles/ForgotPassword.styles";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { useRouter } from "expo-router";

const ForgotPasswordForm = ({
  email,
  setEmail,
  isLoading,
  handleRequestReset,
}: {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  handleRequestReset: () => void;
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
