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
import { handleGoogleSignIn, handleLinkedInSignIn } from "@auth/utils/common";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { Controller } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

const SignIn = () => {
  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    isAuthenticated,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleForgotPassword,
    handleSignUp,
  } = useSignIn();

  return (
    <View style={styles.container}>
      <FuturisticBackground />

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
            onGooglePress={handleGoogleSignIn}
            onLinkedInPress={handleLinkedInSignIn}
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
            />
          </View>

          <AuthFooter
            text="New to the platform? "
            linkText="Create Account"
            onLinkPress={handleSignUp}
          />
          {/* Not Implementing PCKE For Now. */}
          {/* <LinkedInAuthComponent
            authType={authType}
            isLinkedInModalVisible={isLinkedInModalVisible}
            setIsLinkedInModalVisible={setIsLinkedInModalVisible}
          /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignIn;
