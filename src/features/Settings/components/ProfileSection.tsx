import Ionicons from "@react-native-vector-icons/ionicons";
import { settingsStyles as styles } from "@settings/styles";
import { ProfileSectionProps } from "@settings/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NitroImage } from "react-native-nitro-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const ProfileHeaderGradient = withUnistyles(LinearGradient, (_, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? (["rgba(255,255,255,0.05)", "transparent"] as const)
      : (["rgba(0,0,0,0.02)", "transparent"] as const),
}));

const AvatarGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, theme.accent.purple] as const,
}));

const NameInput = withUnistyles(TextInput, (theme) => ({
  placeholderTextColor: theme.text.muted,
}));

const SavingIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.primary.main,
}));

const SaveIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

const MailIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.muted,
}));

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  displayName,
  onDisplayNameChange,
  onNameUpdate,
  savingName,
  userPhotoUrl,
  userEmail,
  userName,
}) => {
  const getInitials = (name: string) => {
    return (name || "User").slice(0, 2).toUpperCase();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>PROFILE</Text>
      <View style={[styles.card, styles.cardSurface]}>
        <ProfileHeaderGradient style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userPhotoUrl ? (
              <NitroImage
                image={{ url: userPhotoUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <AvatarGradient style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(displayName)}
                </Text>
              </AvatarGradient>
            )}
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.label, styles.labelSecondary]}>Full Name</Text>
            <View style={styles.inputContainer}>
              <NameInput
                value={displayName}
                onChangeText={onDisplayNameChange}
                style={styles.input}
                placeholder="Enter name"
              />
              {displayName !== userName && (
                <TouchableOpacity
                  onPress={() => onNameUpdate(displayName)}
                  disabled={savingName}
                >
                  {savingName ? (
                    <SavingIndicator size="small" />
                  ) : (
                    <SaveIcon name="checkmark-circle" size={24} />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ProfileHeaderGradient>

        <View style={[styles.statsRow, styles.statsRowCentered]}>
          <MailIcon name="mail-outline" size={16} />
          <Text style={styles.emailText}>
            {userEmail || "No email connected"}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
