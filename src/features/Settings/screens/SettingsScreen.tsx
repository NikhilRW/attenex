import {
  AppearanceSection,
  DangerZoneSection,
  ProfileSection,
  RoleSection,
} from "@settings/components";
import { useSettings } from "@settings/hooks";
import { settingsStyles as styles } from "@settings/styles";
import { FuturisticBackground } from "@shared/components/FuturisticBackground";
import { useThemeStore } from "@shared/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { withUnistyles } from "react-native-unistyles";
import { useShallow } from "zustand/shallow";

const HeaderGradient = withUnistyles(LinearGradient, (theme, rt) => ({
  colors:
    rt.colorScheme === "dark"
      ? ([theme.background.secondary, "transparent"] as const)
      : (["rgba(255,255,255,0.95)", "rgba(255,255,255,0.0)"] as const),
}));

const SettingsScreen = () => {
  const { mode, setTheme } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      setTheme: state.setTheme,
    })),
  );
  console.log("mode:"+mode);
  
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
      <FuturisticBackground />

      <HeaderGradient style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Preferences & Account</Text>
        </View>
      </HeaderGradient>

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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
