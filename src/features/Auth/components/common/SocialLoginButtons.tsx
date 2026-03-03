import { SocialLoginButtonsProps } from "@auth/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks/useTheme";
import { useAuthStore } from "@shared/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useShallow } from "zustand/shallow";

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onLinkedInPress,
  isGoogleLoading = false,
}) => {
  const { colors } = useTheme();
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
            <ActivityIndicator size="small" color={colors.text.primary} />
          ) : (
            <>
              <View style={styles.socialIconWrapper}>
                <Ionicons
                  name="logo-google"
                  size={24}
                  color={colors.text.primary}
                />
              </View>
              <Text
                style={[
                  styles.socialButtonText,
                  { color: colors.text.primary },
                ]}
              >
                Google
              </Text>
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
          <Ionicons
            name="logo-linkedin"
            size={24}
            color={colors.text.primary}
          />
        </View>
        <Text style={[styles.socialButtonText, { color: colors.text.primary }]}>
          LinkedIn
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create(() => ({
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
  },
}));

export default SocialLoginButtons;
