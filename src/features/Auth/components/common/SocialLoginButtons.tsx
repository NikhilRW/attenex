import { SocialLoginButtonsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAuthStore } from "@shared/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { useShallow } from "zustand/shallow";

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
        style={[styles.socialButton, { borderColor: "rgba(0, 119, 181, 0.4)" }]}
        activeOpacity={0.8}
        onPress={async () => await onGooglePress?.()}
        disabled={isGoogleLoading || !!user}
      >
        <LinearGradient
          colors={["#4286F414", "#34A85314", "#FBBC0514", "#EA433514"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.socialButton,
            styles.googleGradient,
            { borderWidth: 0, opacity: isGoogleLoading ? 0.6 : 1 },
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
        style={[
          styles.socialButton,
          styles.linkedinButton,
          { borderColor: "rgba(0, 119, 181, 0.4)" },
        ]}
        activeOpacity={0.8}
        onPress={onLinkedInPress}
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
