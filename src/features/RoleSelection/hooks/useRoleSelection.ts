import { mutationKeys } from "@/shared/constants/mutationKeys";
import { userService } from "@/shared/services/userService";
import { showInternetNotConnected } from "@/shared/utils/toasts";
import { Role } from "@role-selection/types/common";
import { useAuthStore } from "@shared/stores/authStore";
import { logger } from "@shared/utils/logger";
import { showMessage } from "@shared/utils/toasts";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useNetworkState } from "expo-network";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useSharedValue, withSpring } from "react-native-reanimated";

export const useRoleSelection = () => {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Role>(
    (user?.role as Role) ?? null,
  );
  const [, setHoveredRole] = useState<Role>(null);
  const { isConnected } = useNetworkState();

  const teacherScale = useSharedValue(1);
  const studentScale = useSharedValue(1);

  const handleTeacherPress = useCallback(() => {
    setHoveredRole("teacher");
    setSelectedRole("teacher");
    teacherScale.value = withSpring(1.05, { duration: 1000 });
    studentScale.value = withSpring(1, { duration: 1000 });
  }, [teacherScale, studentScale]);

  const handleStudentPress = useCallback(() => {
    setHoveredRole("student");
    setSelectedRole("student");
    teacherScale.value = withSpring(1, { duration: 1000 });
    studentScale.value = withSpring(1.05, { duration: 1000 });
  }, [teacherScale, studentScale]);

  const updateRoleMutateFn = useCallback(async () => {
    const res = await userService.updateUserRole(selectedRole!);
    return res;
  }, [selectedRole]);

  const { mutateAsync: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: updateRoleMutateFn,
    mutationKey: mutationKeys.user.updateRole,
    onMutate() {
      const prevUser = { ...user };
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return { user: prevUser };
    },
    onSuccess({ success }) {
      if (success) {
        updateUser({ role: selectedRole });
        if (selectedRole === "teacher") {
          router.replace("/(main)/classes");
        } else {
          router.replace("/(main)/attendance");
        }
        showMessage({
          message: "Role Updated",
          description: `You are now a ${selectedRole}!`,
          type: "success",
          duration: 2000,
          position: "bottom",
        });
      } else {
        showMessage({
          message: "Role does not updated successfully",
          description: `Kindly try again`,
          type: "danger",
          duration: 2000,
          position: "bottom",
        });
      }
    },
    onError(error, _, onMutateResult) {
      logger.error(
        "User update failed : handleConfirm() RoleSelection.tsx",
        error,
      );
      showMessage({
        message: "Update Failed",
        description:
          error.message || "Failed to update role. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      updateUser(onMutateResult?.user!);
      router.replace("/role-selection");
    },
  });

  const handleRoleUpdate = async () => {
    if (!selectedRole) return;
    if (!isConnected) {
      showInternetNotConnected();
      return;
    }
    return await updateRole();
  };

  return {
    selectedRole,
    isUpdating,
    user,
    teacherScale,
    studentScale,
    handleTeacherPress,
    handleStudentPress,
    handleRoleUpdate,
  };
};
