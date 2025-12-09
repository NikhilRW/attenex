import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { authService } from "@/src/shared/services/authService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { handleResetPassword } from "../utils/common";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ThemeOption = ({
  mode,
  isActive,
  onPress,
  colors,
  icon,
  label,
}: {
  mode: string;
  isActive: boolean;
  onPress: () => void;
  colors: any;
  icon: any;
  label: string;
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // 3D Flip Animation
      rotation.value = withSequence(
        // withSpring(180, { duration: 200, dampingRatio: 4 }),
        withSpring(360, { duration: 200, dampingRatio: 4 })
      );
    } else {
      rotation.value = withTiming(0, { duration: 0 });
    }
  }, [isActive, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.roleCard,
        animatedContainerStyle,
        {
          backgroundColor: isActive
            ? "rgba(0, 212, 255, 0.15)"
            : colors.surface.cardBg,
          borderColor: isActive
            ? colors.primary.main
            : colors.surface.glassBorder,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.roleIcon,
          animatedIconStyle,
          {
            backgroundColor: isActive
              ? colors.primary.main
              : colors.surface.glass,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? "#FFF" : colors.text.muted}
        />
      </Animated.View>
      <Text
        style={[
          styles.roleText,
          {
            color: isActive ? colors.text.primary : colors.text.secondary,
          },
        ]}
      >
        {label}
      </Text>
      {isActive && (
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.checkIcon}
        >
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={colors.primary.main}
          />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const SettingsScreen = () => {
  const { colors, isDark, mode, setTheme } = useTheme();
  const { user, updateUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<"teacher" | "student">(
    (user?.role as any) || "teacher"
  );
  const [savingRole, setSavingRole] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const handleRoleUpdate = async () => {
    setSavingRole(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await authService.updateUserRole(role);
      Alert.alert("Role updated", `Your role is now set to ${role}.`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update role");
    } finally {
      setSavingRole(false);
    }
  };

  const handleNameUpdate = async () => {
    setSavingName(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      updateUser({ name: displayName } as any);
      Alert.alert("Saved", "Name updated locally.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => authService.logout(),
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert("Delete Account", "This will remove your account forever.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await authService.deleteUserAccount();
        },
      },
    ]);
  };

  const getInitials = (name: string) => {
    return (name || "User").slice(0, 2).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {isDark && <FuturisticBackground />}

      <LinearGradient
        colors={
          isDark
            ? [colors.background.secondary, "transparent"]
            : ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.0)"]
        }
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Preferences & Account
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
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
                {user?.photoUrl ? (
                  <Image
                    source={{ uri: user.photoUrl }}
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
                  Display Name
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
                    onChangeText={setDisplayName}
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="Enter name"
                    placeholderTextColor={colors.text.muted}
                  />
                  {displayName !== user?.name && (
                    <TouchableOpacity
                      onPress={handleNameUpdate}
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

            {/* User Email */}
            <View
              style={[
                styles.statsRow,
                {
                  borderTopColor: colors.surface.glassBorder,
                  justifyContent: 'center',
                  gap: 8
                },
              ]}
            >
              <Ionicons name="mail-outline" size={16} color={colors.text.muted} />
              <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '500' }}>
                {user?.email || "No email connected"}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Role Section */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
            ROLE
          </Text>
          <View style={styles.roleContainer}>
            {(["teacher", "student"] as const).map((r) => {
              const isActive = role === r;
              return (
                <ThemeOption
                  key={r}
                  mode={r}
                  isActive={isActive}
                  onPress={() => setRole(r)}
                  colors={colors}
                  icon={r === "teacher" ? "school" : "people"}
                  label={r.charAt(0).toUpperCase() + r.slice(1)}
                />
              );
            })}
          </View>
          {role !== user?.role && (
            <Animated.View entering={FadeInDown.springify()}>
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  { backgroundColor: colors.primary.main },
                ]}
                onPress={handleRoleUpdate}
                disabled={savingRole}
              >
                <Text style={styles.updateButtonText}>
                  {savingRole ? "Updating..." : "Confirm Role Change"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* Appearance */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text.muted }]}>
            APPEARANCE
          </Text>
          <View style={styles.roleContainer}>
            {(["light", "dark", "system"] as const).map((m) => {
              const isActive = mode === m;
              return (
                <ThemeOption
                  key={m}
                  mode={m}
                  isActive={isActive}
                  onPress={() => setTheme(m)}
                  colors={colors}
                  icon={
                    m === "light"
                      ? "sunny"
                      : m === "dark"
                        ? "moon"
                        : "settings-outline"
                  }
                  label={m.charAt(0).toUpperCase() + m.slice(1)}
                />
              );
            })}
          </View>
        </Animated.View>

        {/* Danger Zone */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.accent.red }]}>
            DANGER ZONE
          </Text>
          <View
            style={[
              styles.card,
              {
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                borderColor: "rgba(239, 68, 68, 0.2)",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.dangerRow}
              onPress={async () => await handleResetPassword()}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color={colors.accent.red}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.dangerLabel, { color: colors.text.primary }]}
                  >
                    Change Password
                  </Text>
                  <Text
                    style={[styles.dangerSub, { color: colors.text.muted }]}
                  >
                    Change your account password
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.muted}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.surface.glassBorder },
              ]}
            />

            <TouchableOpacity style={styles.dangerRow} onPress={handleLogout}>
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="log-out"
                    size={20}
                    color={colors.accent.red}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.dangerLabel, { color: colors.text.primary }]}
                  >
                    Logout
                  </Text>
                  <Text
                    style={[styles.dangerSub, { color: colors.text.muted }]}
                  >
                    Sign out of account
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.muted}
              />
            </TouchableOpacity>

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.surface.glassBorder },
              ]}
            />

            <TouchableOpacity
              style={styles.dangerRow}
              onPress={handleDeleteAccount}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                  ]}
                >
                  <Ionicons
                    name="warning"
                    size={20}
                    color={colors.accent.red}
                  />
                </View>
                <View>
                  <Text
                    style={[styles.dangerLabel, { color: colors.text.primary }]}
                  >
                    Delete Account
                  </Text>
                  <Text
                    style={[styles.dangerSub, { color: colors.text.muted }]}
                  >
                    Permanently delete data
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.muted}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    gap: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  profileHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
  },
  onlineBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2,
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    height: "100%",
  },
  statsRow: {
    flexDirection: "row",
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 12,
    position: "relative",
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "700",
  },
  checkIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  updateButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  updateButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  dangerLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  dangerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
});

export default SettingsScreen;
