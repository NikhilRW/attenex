import { mutationKeys } from "@/shared/constants/mutationKeys";
import { userService } from "@/shared/services/userService";
import { Role } from "@role-selection/types";
import { useAuthStore } from "@shared/stores/authStore";
import { logger } from "@shared/utils";
import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useSharedValue, withSpring } from "react-native-reanimated";

export const useRoleSelection = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [, setHoveredRole] = useState<Role>(null);
  const { user, updateUser } = useAuthStore();

  const teacherScale = useSharedValue(1);
  const studentScale = useSharedValue(1);

  useEffect(() => {
    if (user && user.role) {
      setSelectedRole(user.role as Role);
    }
  }, [user]);

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

  const handleConfirmMutateFn = useCallback(async () => {
    if (!selectedRole) return;
    // Call backend API to update user role
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const res = await userService.updateUserRole(selectedRole);
    return res;
  }, [selectedRole]);

  const { mutateAsync: handleConfirm, isPending: isUpdating } = useMutation({
    mutationFn: handleConfirmMutateFn,
    mutationKey: mutationKeys.user.updateRole,
    onMutate() {
      const prevUser = { ...user };
      updateUser({ role: selectedRole });
      if (selectedRole === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
      }
      return { user: prevUser };
    },
    onSuccess() {
      showMessage({
        message: "Role Updated",
        description: `You are now a ${selectedRole}!`,
        type: "success",
        duration: 2000,
        position: "bottom",
      });
      // Navigate based on selected role
      if (selectedRole === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
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

  return {
    selectedRole,
    isUpdating,
    user,
    teacherScale,
    studentScale,
    handleTeacherPress,
    handleStudentPress,
    handleConfirm,
  };
};
