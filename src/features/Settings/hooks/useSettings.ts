import { mutationKeys } from "@/shared/constants/mutationKeys";
import { queryKeys } from "@/shared/constants/queryKeys";
import { showInternetNotConnected } from "@/shared/utils/toasts";
import { lectureService } from "@classes/services/lectureService";
import { UserRole } from "@settings/types";
import { resetPassword } from "@settings/utils/common";
import { authService } from "@shared/services/authService";
import { useAuthStore, User } from "@shared/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useNetworkState } from "expo-network";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";
// TODO: student lectures error occurs when roled changed to teacher
export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<UserRole>(user?.role || "teacher");
  const { alert } = useAlerts();
  const { isConnected } = useNetworkState();

  const { isPending: savingRole, mutateAsync: updateRole } = useMutation<
    { success: boolean; message: string },
    any,
    UserRole,
    { user: Partial<User>; prevRole: UserRole }
  >({
    mutationKey: mutationKeys.user.updateRole,
    onMutate: () => {
      const prevUser = { ...user };
      const prevRole = user?.role || "teacher";
      return { user: prevUser, prevRole };
    },
    async onSuccess({ success }, newRole, context) {
      if (success) {
        updateUser({ role: newRole });
        // Remove old role's stale data
        if (context.prevRole === "student") {
          await queryClient.cancelQueries({
            queryKey: queryKeys.lectures.student,
          });
          queryClient.removeQueries({
            queryKey: queryKeys.lectures.student,
          });
        } else {
          queryClient.removeQueries({
            queryKey: queryKeys.lectures.teacher,
          });
        }

        // Prefetch new role's data before navigating so screen loads instantly
        if (newRole === "teacher") {
          queryClient.prefetchQuery({
            queryKey: queryKeys.classes.teacher,
            queryFn: async () => {
              const res = await lectureService.getTeacherClasses();
              return res.success ? [...res.data] : [];
            },
          });
          router.replace("/(main)/classes");
        } else {
          // TODO: why not student fetching done.
          router.replace("/(main)/attendance");
        }
        alert("Role updated", `Your role is now set to ${newRole}.`);
      } else {
        setRole(context.prevRole);
        updateUser({ role: context.prevRole });
        alert("Role not updated successfully", `Please try again`);
      }
    },
    onError: (error, _, onMutateResult) => {
      alert("Error", error.message || "Failed to update role");
      setRole(
        onMutateResult?.prevRole || onMutateResult?.user.role || "student",
      );
      updateUser({ role: onMutateResult?.user.role });
      setRole(onMutateResult?.prevRole || "teacher");
    },
  });

  const handleRoleUpdate = useCallback(async () => {
    if (!isConnected) {
      showInternetNotConnected();
      return;
    }
    return await updateRole(role);
  }, [isConnected, role, updateRole]);

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
      if (!isConnected) {
        showInternetNotConnected();
        return;
      }
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

  const handleResetPassword = async () => {
    if (!isConnected) {
      showInternetNotConnected();
      return;
    }
    await resetPassword();
  };

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
