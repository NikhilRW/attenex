import {
  AppearanceSection,
  DangerZoneSection,
  ProfileSection,
  RoleSection,
} from "@settings/components";
import { useSettings } from "@settings/hooks";
import { settingsStyles as styles } from "@settings/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";


const SettingsScreen = () => {
  const { colors, isDark, mode, setTheme } = useTheme();
  const {
    displayName,
    setDisplayName,
    role,
    setRole,
    savingRole,
    savingName,
    user,
    handleRoleUpdate,
    handleNameUpdate,
    handleLogout,
    handleDeleteAccount,
    handleResetPassword,
  } = useSettings();

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
        <ProfileSection
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
          onNameUpdate={handleNameUpdate}
          savingName={savingName}
          userPhotoUrl={user?.photoUrl}
          userEmail={user?.email}
          userName={user?.name}
        />

        <RoleSection
          role={role}
          userRole={user?.role}
          onRoleChange={setRole}
          onRoleUpdate={handleRoleUpdate}
          savingRole={savingRole}
        />

        <AppearanceSection mode={mode} onThemeChange={setTheme} />

        <DangerZoneSection
          userProvider={user?.oauthProvider}
          onResetPassword={handleResetPassword}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
