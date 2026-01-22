import { userService } from "@/shared/services/userService";
import { Role } from "@role-selection/types";
import { useAuthStore } from "@shared/stores/authStore";
import { logger } from "@shared/utils";
import { useMutation } from "@tanstack/react-query";
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
    const res = await userService.updateUserRole(selectedRole);
    return res;
  }, [selectedRole]);

  const { mutateAsync: handleConfirm, isPending: isUpdating } = useMutation({
    mutationFn: handleConfirmMutateFn,
    onMutate() {
      updateUser({ role: selectedRole });
      if (selectedRole === "teacher") {
        router.replace("/(main)/classes");
      } else {
        router.replace("/(main)/attendance");
      }
      return { user };
    },
    onSuccess(data, _, onMutateResult) {
      console.log(JSON.stringify(data));
      if (data?.user) {
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
      } else {
        updateUser(onMutateResult?.user!);
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
