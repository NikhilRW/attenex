import AuthFooter from "@auth/components/common/AuthFooter";
import AuthHeader from "@auth/components/common/AuthHeader";
import AuthOptions from "@auth/components/common/AuthOptions";
import FuturisticButton from "@auth/components/common/FuturisticButton";
import FuturisticDivider from "@auth/components/common/FuturisticDivider";
import FuturisticInput from "@auth/components/common/FuturisticInput";
import SocialLoginButtons from "@auth/components/common/SocialLoginButtons";
import { LOGO_TRANSPARENT_IMAGE } from "@auth/constants/images";
import { useSignIn } from "@auth/hooks/useSignIn";
import { styles } from "@auth/styles/SignIn.styles";
import { handleLinkedInSignIn } from "@auth/utils/common";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isAuthenticated,
    isGoogleLoading,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleForgotPassword,
    handleSignUp,
    handleGooglePress,
  } = useSignIn();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader
            title="Welcome Back !"
            logoSource={LOGO_TRANSPARENT_IMAGE}
          />

          <SocialLoginButtons
            onGooglePress={handleGooglePress}
            onLinkedInPress={handleLinkedInSignIn}
            isGoogleLoading={isGoogleLoading}
          />

          <FuturisticDivider text="OR ACCESS WITH EMAIL" />

          <View style={styles.formContainer}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="EMAIL ADDRESS"
                  placeholder="name@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  testID="SIGN_IN_SCREEN.EMAIL_FIELD"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FuturisticInput
                  label="PASSWORD"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  isPassword
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  secureTextEntry={!showPassword}
                  error={errors.password?.message}
                  testID="SIGN_IN_SCREEN.PASSWORD_FIELD"
                />
              )}
            />

            <AuthOptions
              rememberMe={rememberMe}
              onToggleRememberMe={() => setRememberMe(!rememberMe)}
              onForgotPassword={handleForgotPassword}
            />

            <FuturisticButton
              title="Sign In"
              onPress={handleSubmit}
              disabled={isSubmitting || isAuthenticated}
              loading={isSubmitting}
              testID="SIGN_IN_SCREEN.SIGN_IN_BUTTON"
            />
          </View>

          <AuthFooter
            text="New to the platform? "
            linkText="Create Account"
            onLinkPress={handleSignUp}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
