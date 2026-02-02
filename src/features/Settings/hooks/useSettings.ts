import { mutationKeys } from "@/shared/constants/mutationKeys";
import { userService } from "@/shared/services/userService";
import { UserRole } from "@settings/types";
import { handleResetPassword } from "@settings/utils/common";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";
import { useNetInfo } from "@react-native-community/netinfo";
import { defineTask, getRegisteredTasksAsync } from "expo-task-manager";
import { mmkvStorage } from "@/shared/utils";
import {
  registerTaskAsync,
  triggerTaskWorkerForTestingAsync,
} from "expo-background-task";

const BACKGROUND_TASK_IDENTIFIER = "background-display-name-change";

let resolver: ((value: unknown) => void) | null;

const promise = new Promise((res) => {
  resolver = res;
});

defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  console.log("Background Task Started");
  await promise;
  const newDisplayName = mmkvStorage.getItem("new-display-name");
  if (newDisplayName) {
    const response = await userService.updateUserFullName(newDisplayName);
    console.log("Background Task Response  : " + response.success);
    if (response.success) {
      mmkvStorage.setItem("new-display-name", "");
      mmkvStorage.setItem("name-updated-flag", "true");
    }
  }
});

export const useSettings = () => {
  const { user, updateUser } = useAuthStore();
  const isNotSynced = useAuthStore((state) => state.isNotSynced);
  const setIsNotSynced = useAuthStore((state) => state.setIsNotSynced);
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [role, setRole] = useState<UserRole>(user?.role || "teacher");
  const { alert } = useAlerts();
  const { isConnected } = useNetInfo();
  const nameUpdatedFlag = mmkvStorage.getItem("name-updated-flag");
  const newDisplayName = mmkvStorage.getItem("new-display-name");

  console.log("nameUpdatedFlag", " : ", nameUpdatedFlag);
  console.log("newDisplayName", " : ", newDisplayName);

  useEffect(() => {
    if (resolver) {
      resolver("Resolve It");
      console.log("Resolver Resolved.");
    }
  }, []);

  const handleRoleUpdateMutateFn = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const res = await userService.updateUserRole(role);
    return res;
  }, [role]);

  const { isPending: savingRole, mutateAsync: handleRoleUpdate } = useMutation({
    mutationKey: mutationKeys.user.updateRole,
    mutationFn: handleRoleUpdateMutateFn,
    onMutate() {
      const prevUser = { ...user };
      updateUser({ role });
      if (role === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
      }
      return { user: prevUser };
    },
    onSuccess() {
      alert("Role updated", `Your role is now set to ${role}.`);
    },
    onError: (error, _, onMutateResult) => {
      alert("Error", error.message || "Failed to update role");
      updateUser({ role: onMutateResult?.user.role });
      setRole(
        onMutateResult?.user.role || role === "teacher" ? "student" : "teacher",
      );
    },
  });

  const handleNameUpdateMutateFn = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsNotSynced(true);
    mmkvStorage.setItem("new-display-name", displayName);
    if (!isConnected) {
      // await registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
      //   minimumInterval: 15,
      // });
      console.log("Task Registered :  " + JSON.stringify(await getRegisteredTasksAsync()));
      await triggerTaskWorkerForTestingAsync();
    }
    if (nameUpdatedFlag === "true") {
      return {
        success: true,
      };
    }
    const res = await userService.updateUserFullName(displayName);
    return res;
  }, [displayName, isConnected, nameUpdatedFlag, setIsNotSynced]);

  const { isPending: savingName, mutateAsync: handleNameUpdate } = useMutation({
    mutationFn: handleNameUpdateMutateFn,
    gcTime: Infinity, // Keep mutation in cache for offline retry
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    networkMode: "offlineFirst", // Queue mutations when offline
    onMutate() {
      const prevName = user?.name || "";
      updateUser({ name: displayName });
      return { prevName };
    },
    onSuccess(data, _, onMutateResult) {
      console.log("data : " + JSON.stringify(data));
      if (data.success) {
        setIsNotSynced(false);
        alert("Your Fullname updated");
      } else {
        updateUser({ name: onMutateResult.prevName });
        setIsNotSynced(false);
        alert("Error", data.message || "Failed to update name");
      }
    },
    onError: (error, _, onMutateResult) => {
      alert("Error", error.message || "Failed to update name");
      updateUser({ name: onMutateResult?.prevName });
    },
  });

  useEffect(() => {
    if (isNotSynced && isConnected) {
      handleNameUpdate();
    }
  }, [isNotSynced, handleNameUpdate, isConnected]);

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
