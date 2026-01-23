import { userService } from "@/shared/services/userService";
import { UserRole } from "@settings/types";
import { handleResetPassword } from "@settings/utils/common";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<UserRole>((user?.role as any) || "teacher");
  const [savingRole, setSavingRole] = useState(false);
  const { alert } = useAlerts();

  const handleRoleUpdate = useCallback(async () => {
    setSavingRole(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await userService.updateUserRole(role);
      alert("Role updated", `Your role is now set to ${role}.`);
      if (role === "teacher") {
        router.replace("/classes");
      } else {
        router.replace("/attendance");
      }
    } catch (error: any) {
      alert("Error", error.message || "Failed to update role");
    } finally {
      setSavingRole(false);
    }
  }, [role, router, alert]);

  const handleNameUpdateMutateFn = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await userService.updateUserFullName(displayName);
    return res;
  }, [displayName]);

  const { isPending: savingName, mutateAsync: handleNameUpdate } = useMutation({
    mutationFn: handleNameUpdateMutateFn,
    onMutate() {
      const prevName = user?.name || "";
      updateUser({ name: displayName });
      return { prevName };
    },
    onSuccess(data, _, onMutateResult) {
      if (data.success) {
        alert("Your Fullname updated");
      } else {
        updateUser({ name: onMutateResult.prevName });
        alert("Error", data.message || "Failed to update name");
      }
    },
    onError: (error, _, onMutateResult) => {
      alert("Error", error.message || "Failed to update name");
      updateUser({ name: onMutateResult?.prevName });
    },
  });

  const handleLogout = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    alert("Logout", "Are you sure you want to logout?", [
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
  }, [alert, user?.oauthProvider, router]);

  const handleDeleteAccount = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    alert("Delete Account", "This will remove your account forever.", [
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
  }, [alert, user, router]);

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
