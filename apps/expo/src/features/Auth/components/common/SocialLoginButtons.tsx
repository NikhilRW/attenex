import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { useShallow } from "zustand/shallow";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { SocialLoginButtonsProps } from "@auth/types/props";
import { useAuthStore } from "@shared/stores/authStore";

const SocialIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));
const SocialLoadingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.primary,
}));

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onLinkedInPress,
  isGoogleLoading = false,
}) => {
  const { user } = useAuthStore(useShallow((state) => ({ user: state.user })));
  return (
    <View style={styles.socialSection}>
      <TouchableOpacity
        style={[styles.socialButton, styles.googleButtonBorder]}
        activeOpacity={0.8}
        onPress={onGooglePress}
        haptic="impact"
        disabled={isGoogleLoading || !!user}
      >
        <LinearGradient
          colors={["#4286F414", "#34A85314", "#FBBC0514", "#EA433514"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.socialButton,
            styles.googleGradient,
            styles.googleBorderNone,
            isGoogleLoading && styles.googleLoading,
          ]}
        >
          {isGoogleLoading ? (
            <SocialLoadingIndicator size="small" />
          ) : (
            <>
              <View style={styles.socialIconWrapper}>
                <SocialIcon name="logo-google" size={24} />
              </View>
              <Text style={styles.socialButtonText}>Google</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.socialButton, styles.linkedinButton, styles.linkedinButtonBorder]}
        activeOpacity={0.8}
        onPress={onLinkedInPress}
        haptic="impact"
      >
        <View style={styles.socialIconWrapper}>
          <SocialIcon name="logo-linkedin" size={24} />
        </View>
        <Text style={styles.socialButtonText}>LinkedIn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  socialSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  googleGradient: {
    width: "100%",
    height: "100%",
  },
  linkedinButton: {
    backgroundColor: "rgba(0, 119, 181, 0.2)",
  },
  googleButtonBorder: {
    borderColor: "rgba(0, 119, 181, 0.4)",
  },
  linkedinButtonBorder: {
    borderColor: "rgba(0, 119, 181, 0.4)",
  },
  googleBorderNone: {
    borderWidth: 0,
  },
  googleLoading: {
    opacity: 0.6,
  },
  socialIconWrapper: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: theme.text.primary,
  },
}));

export default SocialLoginButtons;
