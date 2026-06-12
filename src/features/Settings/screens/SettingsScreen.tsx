import { FuturisticBackground } from "@/shared/components/FuturisticBackground";
import { AppearanceSection } from "@settings/components/AppearanceSection";
import { DangerZoneSection } from "@settings/components/DangerZoneSection";
import { ProfileSection } from "@settings/components/ProfileSection";
import { RoleSection } from "@settings/components/RoleSection";
import { useSettings } from "@settings/hooks/useSettings";
import { styles } from "@settings/styles/Settings.styles";
import { useThemeStore } from "@shared/hooks/useTheme";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { useShallow } from "zustand/shallow";
import SettingsHeader from "../components/SettingsHeader";
import { useSlideAnimation } from "../hooks/useSlideAnimation";

const SettingsScreen = () => {
  const { mode, setTheme } = useThemeStore(
    useShallow((state) => ({
      mode: state.mode,
      setTheme: state.setTheme,
    })),
  );

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

  const { contentAnimatedStyle, headerAnimatedStyle } = useSlideAnimation();

  return (
    <View style={styles.container}>
      <FuturisticBackground show={user?.role === "student"} />
      <SettingsHeader headerAnimatedStyle={headerAnimatedStyle} />

      <Animated.ScrollView
        style={contentAnimatedStyle}
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
      </Animated.ScrollView>
    </View>
  );
};

export default SettingsScreen;
