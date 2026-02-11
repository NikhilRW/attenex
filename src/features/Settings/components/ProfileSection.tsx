import { Ionicons } from "@expo/vector-icons";
import { settingsStyles as styles } from "@settings/styles";
import { ProfileSectionProps } from "@settings/types";
import { useTheme } from "@shared/hooks";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  displayName,
  onDisplayNameChange,
  onNameUpdate,
  savingName,
  userPhotoUrl,
  userEmail,
  userName,
}) => {
  const { colors, isDark } = useTheme();

  const getInitials = (name: string) => {
    return (name || "User").slice(0, 2).toUpperCase();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.section}
    >
      <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
        PROFILE
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface.cardBg,
            borderColor: colors.surface.glassBorder,
          },
        ]}
      >
        <LinearGradient
          colors={[
            isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
            "transparent",
          ]}
          style={styles.profileHeader}
        >
          <View style={styles.avatarContainer}>
            {userPhotoUrl ? (
              <Image
                source={{ uri: userPhotoUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={[colors.primary.main, colors.accent.purple]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {getInitials(displayName)}
                </Text>
              </LinearGradient>
            )}
            <View
              style={[
                styles.onlineBadge,
                { borderColor: colors.surface.cardBg },
              ]}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Full Name
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface.glass,
                  borderColor: colors.surface.glassBorder,
                },
              ]}
            >
              <TextInput
                value={displayName}
                onChangeText={onDisplayNameChange}
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Enter name"
                placeholderTextColor={colors.text.muted}
              />
              {displayName !== userName && (
                <TouchableOpacity
                  onPress={() => onNameUpdate()}
                  disabled={savingName}
                >
                  {savingName ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.primary.main}
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary.main}
                    />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>

        <View
          style={[
            styles.statsRow,
            {
              borderTopColor: colors.surface.glassBorder,
              justifyContent: "center",
              gap: 8,
            },
          ]}
        >
          <Ionicons name="mail-outline" size={16} color={colors.text.muted} />
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            {userEmail || "No email connected"}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
