import { FuturisticBackground } from "@/src/shared/components/FuturisticBackground";
import { useTheme } from "@/src/shared/hooks/useTheme";
import { authService } from "@/src/shared/services/authService";
import { useAuthStore } from "@/src/shared/stores/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { handleResetPassword } from "../utils/common";
import { Image } from "expo-image";

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
    try {
      // Backend endpoint not defined; update locally for now.
      updateUser({ name: displayName } as any);
      Alert.alert("Saved", "Name updated locally.");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
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
    console.log("user?.photoUrl", user!.photoUrl);

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
            <View style={styles.profileHeader}>
              {user?.photoUrl ? (
                <Image
                  source={{ uri: user.photoUrl }}
                  style={{ borderRadius: 25, height: 50, width: 50 }}
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
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  style={[
                    styles.roleCard,
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
                  <LinearGradient
                    colors={
                      isActive
                        ? [colors.primary.main, colors.primary.dark]
                        : [colors.surface.glass, colors.surface.glass]
                    }
                    style={styles.roleIcon}
                  >
                    <Ionicons
                      name={r === "teacher" ? "school" : "people"}
                      size={24}
                      color={isActive ? "#FFF" : colors.text.muted}
                    />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.roleText,
                      {
                        color: isActive
                          ? colors.text.primary
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                  {isActive && (
                    <View style={styles.checkIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary.main}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          {role !== user?.role && (
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
                <TouchableOpacity
                  key={m}
                  onPress={() => setTheme(m)}
                  style={[
                    styles.roleCard,
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
                  <LinearGradient
                    colors={
                      isActive
                        ? [colors.primary.main, colors.primary.dark]
                        : [colors.surface.glass, colors.surface.glass]
                    }
                    style={styles.roleIcon}
                  >
                    <Ionicons
                      name={
                        m === "light"
                          ? "sunny"
                          : m === "dark"
                            ? "moon"
                            : "settings-outline"
                      }
                      size={24}
                      color={isActive ? "#FFF" : colors.text.muted}
                    />
                  </LinearGradient>
                  <Text
                    style={[
                      styles.roleText,
                      {
                        color: isActive
                          ? colors.text.primary
                          : colors.text.secondary,
                      },
                    ]}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                  {isActive && (
                    <View style={styles.checkIcon}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={colors.primary.main}
                      />
                    </View>
                  )}
                </TouchableOpacity>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
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
