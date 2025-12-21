import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { AuthHeader } from "../components/AuthHeader";
import { styles } from "../styles/ForgotPassword.styles";
import useForgotPassword from "../hooks/useForgotPassword";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import EmailSent from "../components/EmailSent";
import BackButton from "../components/BackButton";

/**
 * Forgot Password Screen
 *
 * Allows users to request a password reset link via email.`
 * The link will open the app with the reset password screen.
 */
const ForgotPassword = () => {
  const { colors, mode } = useTheme();
  const {
    handleRequestReset,
    email,
    setEmail,
    isLoading,
    emailSent,
    animatedStyle,
    emailParam,
    setEmailSent,
  } = useForgotPassword();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <FuturisticBackground />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          {/* Back Button */}
          <BackButton />

          {emailSent === false && (
            <AuthHeader
              title="Forgot Password"
              logoSource={require("../../../../assets/images/logo-transparent.png")}
            />
          )}

          {emailSent ? (
            <EmailSent
              email={email}
              setEmailSent={setEmailSent}
              emailParam={emailParam}
              handleRequestReset={handleRequestReset}
            />
          ) : (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              handleRequestReset={handleRequestReset}
            />
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default ForgotPassword;
