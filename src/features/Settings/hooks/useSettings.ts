import { UserRole } from "@settings/types";
import { handleResetPassword } from "@settings/utils/common";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<UserRole>((user?.role as any) || "teacher");
  const [savingRole, setSavingRole] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const handleRoleUpdate = useCallback(async () => {
    setSavingRole(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await authService.updateUserRole(role);
      Alert.alert("Role updated", `Your role is now set to ${role}.`);
      if (role === "teacher") {
        router.replace("/classes");
      } else {
        router.replace("/attendance");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update role");
    } finally {
      setSavingRole(false);
    }
  }, [role, router]);

  const handleNameUpdate = useCallback(async () => {
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
  }, [displayName, updateUser]);

  const handleLogout = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          if (user?.oauthProvider === "linkedin") {
            router.replace("/linkedin?logout=true");
            return;
          }
          await authService.logout();
        },
      },
    ]);
  }, [user, router]);

  const handleDeleteAccount = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert("Delete Account", "This will remove your account forever.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (user && user.oauthProvider === "linkedin") {
            router.replace("/linkedin?deleteAccount=true");
            return;
          }
          await authService.deleteUserAccount();
        },
      },
    ]);
  }, [user, router]);

  return {
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
  };
};
