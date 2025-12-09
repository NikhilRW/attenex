import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SocialLoginButtonsProps {
  onGooglePress?: () => void;
  onLinkedInPress?: () => void;
  isGoogleLoading?: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGooglePress,
  onLinkedInPress,
  isGoogleLoading = false,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.socialSection}>
      <TouchableOpacity
        style={[styles.socialButton, { borderColor: "rgba(0, 119, 181, 0.4)" }]}
        activeOpacity={0.8}
        onPress={onGooglePress}
        disabled={isGoogleLoading}
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
                style={[styles.socialButtonText, { color: colors.text.primary }]}
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

const styles = StyleSheet.create({
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
});
