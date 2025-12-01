import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AuthFooter } from "../components/AuthFooter";
import { AuthHeader } from "../components/AuthHeader";
import { AuthOptions } from "../components/AuthOptions";
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticDivider } from "../components/FuturisticDivider";
import { FuturisticInput } from "../components/FuturisticInput";
import { SocialLoginButtons } from "../components/SocialLoginButtons";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = async () => {
    // TODO: Implement sign-in logic
    console.log("Sign in:", { email, password });
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign-in
    console.log("Google sign-in");
  };

  const handleLinkedInSignIn = () => {
    // TODO: Implement LinkedIn sign-in
    console.log("LinkedIn sign-in");
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    console.log("Forgot password");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
            logoSource={require("../../../../assets/images/logo-transparent.png")}
          />

          <SocialLoginButtons
            onGooglePress={handleGoogleSignIn}
            onLinkedInPress={handleLinkedInSignIn}
          />

          <FuturisticDivider text="OR ACCESS WITH EMAIL" />

          <View style={styles.formContainer}>
            <FuturisticInput
              label="EMAIL ADDRESS"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FuturisticInput
              label="PASSWORD"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
            />

            <AuthOptions
              rememberMe={rememberMe}
              onToggleRememberMe={() => setRememberMe(!rememberMe)}
              onForgotPassword={handleForgotPassword}
            />

            <FuturisticButton title="Sign In" onPress={handleSignIn} />
          </View>

          <AuthFooter
            text="New to the platform? "
            linkText="Create Account"
            onLinkPress={() => router.push("/(auth)/sign-up")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050511",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 24,
  },
});

export default SignIn;
