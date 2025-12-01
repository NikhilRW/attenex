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
import { FuturisticButton } from "../components/FuturisticButton";
import { FuturisticDivider } from "../components/FuturisticDivider";
import { FuturisticInput } from "../components/FuturisticInput";
import { SocialLoginButtons } from "../components/SocialLoginButtons";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    // TODO: Implement sign-up validation
    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }
    // TODO: Implement sign-up logic
    console.log("Sign up:", { fullName, email, password });
  };

  const handleGoogleSignUp = () => {
    // TODO: Implement Google sign-up
    console.log("Google sign-up");
  };

  const handleLinkedInSignUp = () => {
    // TODO: Implement LinkedIn sign-up
    console.log("LinkedIn sign-up");
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
            title="Create Account"
            logoSource={require("../../../../assets/images/logo-transparent.png")}
          />

          <SocialLoginButtons
            onGooglePress={handleGoogleSignUp}
            onLinkedInPress={handleLinkedInSignUp}
          />

          <FuturisticDivider text="OR REGISTER WITH EMAIL" />

          <View style={styles.formContainer}>
            <FuturisticInput
              label="FULL NAME"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />

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
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              secureTextEntry={!showPassword}
            />

            <FuturisticInput
              label="CONFIRM PASSWORD"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              secureTextEntry={!showConfirmPassword}
            />

            <FuturisticButton title="Create Account" onPress={handleSignUp} />
          </View>

          <AuthFooter
            text="Already have an account? "
            linkText="Sign In"
            onLinkPress={() => router.push("/(auth)/sign-in")}
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
    paddingBottom: 20,
  },
  keyboardView: {
    flex: 1,
    minHeight: Dimensions.get("window").height,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  formContainer: {
    gap: 24,
  },
});

export default SignUp;