import AuthHeader from "@auth/components/common/AuthHeader";
import BackButton from "@auth/components/common/BackButton";
import EmailSent from "@auth/components/ForgotPassword/EmailSent";
import ForgotPasswordForm from "@auth/components/ForgotPassword/ForgotPasswordForm";
import { useForgotPassword } from "@auth/hooks/useForgotPassword";
import { styles } from "@auth/styles/ForgotPassword.styles";
import { View } from "react-native";
import Animated from "react-native-reanimated";

/**
 * Forgot Password Screen
 *
 * Allows users to request a password reset link via email.`
 * The link will open the app with the reset password screen.
 */
const ForgotPassword = () => {
  const {
    handleRequestReset,
    email,
    setEmail,
    isPending,
    emailSent,
    animatedStyle,
    emailParam,
    setEmailSent,
  } = useForgotPassword();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={animatedStyle}>
          {/* Back Button */}
          <BackButton />

          {emailSent === false && (
            <AuthHeader
              title="Forgot Password"
              logoSource={require("@assets/images/logo-transparent.png")}
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
              isLoading={isPending}
              handleRequestReset={handleRequestReset}
            />
          )}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default ForgotPassword;
