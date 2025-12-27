import { Role } from "@role-selection/types";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { logger } from "@shared/utils";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { useSharedValue, withSpring } from "react-native-reanimated";

export const useRoleSelection = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [, setHoveredRole] = useState<Role>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();

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

  const handleConfirm = useCallback(async () => {
    if (!selectedRole || isUpdating) return;

    setIsUpdating(true);

    try {
      // Call backend API to update user role
      await authService.updateUserRole(selectedRole);

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
    } catch (error: any) {
      logger.error(
        "User update failed : handleConfirm() RoleSelection.tsx",
        error
      );
      showMessage({
        message: "Update Failed",
        description:
          error.message || "Failed to update role. Please try again.",
        type: "danger",
        duration: 3000,
        position: "bottom",
      });
      setIsUpdating(false);
    }
  }, [selectedRole, isUpdating, router]);

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
