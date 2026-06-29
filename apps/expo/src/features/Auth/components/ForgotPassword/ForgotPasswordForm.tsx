import { styles } from "@auth/styles/ForgotPassword.styles";
import { ForgotPasswordFormProps } from "@auth/types/props";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import FuturisticButton from "../common/FuturisticButton";
import FuturisticInput from "../common/FuturisticInput";
import { TouchableOpacity } from "@/shared/components/TouchableOpacity";

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  email,
  setEmail,
  isLoading,
  handleRequestReset,
}) => {
  const router = useRouter();

  const handleBackToSignIn = () => {
    router.back();
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.description}>
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
        onPress={handleBackToSignIn}
        haptic="selection"
      >
        <Text style={styles.backToSignInText}>
          Remember your password? <Text style={styles.signInLink}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordForm;
