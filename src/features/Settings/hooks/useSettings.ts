import { mutationKeys } from "@/shared/constants/mutationKeys";
import { UserRole } from "@settings/types";
import { handleResetPassword } from "@settings/utils/common";
import { authService } from "@shared/services/authService";
import { useAuthStore, User } from "@shared/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<UserRole>(user?.role || "teacher");``
  const { alert } = useAlerts();

  const { isPending: savingRole, mutateAsync: handleRoleUpdate } = useMutation<
    { success: boolean; message: string },
    any,
    UserRole,
    { user: Partial<User> }
  >({
    mutationKey: mutationKeys.user.updateRole,
    onMutate: () => {
      const prevUser = { ...user };
      updateUser({ role });
      if (role === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
      }
      return { user: prevUser };
    },
    onSuccess({ success }) {
      if (success) {
        alert("Role updated", `Your role is now set to ${role}.`);
      }
    },
    onError: (error, _, onMutateResult) => {
      alert("Error", error.message || "Failed to update role");
      updateUser({ role: onMutateResult?.user.role });
      setRole(
        onMutateResult?.user.role || role === "teacher" ? "student" : "teacher",
      );
    },
  });

  const { isPending: savingName, mutateAsync: handleNameUpdate } = useMutation<
    { success: boolean; message: string },
    any,
    string,
    { prevName: string }
  >({
    mutationKey: mutationKeys.user.updateName, // Static key with displayName for deduplication
    onMutate() {
      const prevName = user?.name || "";
      updateUser({ name: displayName });
      return { prevName };
    },
    async onSuccess(data, _, onMutateResult) {
      console.log("✅ Name update succeeded:", data);
      if (data?.success) {
        alert("Success", "Your name has been updated");
      } else {
        updateUser({ name: onMutateResult.prevName });
        alert("Error", data?.message || "Failed to update name");
      }
    },
    onError: (error: any, _, onMutateResult) => {
      console.error("❌ Name update failed after retries:", error);
      updateUser({ name: onMutateResult?.prevName });
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update name";
      alert("Error", errorMessage);
    },
  });

  const { mutateAsync: logoutUser } = useMutation({
    mutationKey: mutationKeys.auth.logout,
    mutationFn: async () => {
      if (user?.oauthProvider === "linkedin") {
        router.replace("/linkedin?logout=true");
        return;
      }
      await authService.logout();
    },
  });

  const handleLogout = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logoutUser,
      },
    ]);
  }, [alert, logoutUser]);

  const { mutateAsync: deleteUserAccount } = useMutation({
    mutationKey: mutationKeys.auth.deleteAccount,
    mutationFn: async () => {
      if (user && user.oauthProvider === "linkedin") {
        router.replace("/linkedin?deleteAccount=true");
        return;
      }
      await authService.deleteUserAccount();
    },
  });

  const handleDeleteAccount = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    alert("Delete Account", "This will remove your account forever.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: deleteUserAccount,
      },
    ]);
  }, [alert, deleteUserAccount]);

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
