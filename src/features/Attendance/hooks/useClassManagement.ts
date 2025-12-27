import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { UseClassManagementReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { validateClassName } from "@attendance/utils/validationUtils";
import { authService } from "@shared/services/authService";
import { useAuthStore } from "@shared/stores/authStore";
import { storage } from "@shared/utils/mmkvStorage";
import { useState } from "react";

/**
 * Custom hook to manage class updates
 */
export const useClassManagement = (
  onClassUpdated: () => void
): UseClassManagementReturn => {
  const { user } = useAuthStore();
  const [className, setClassName] = useState(
    (user as any)?.className || storage.getString("userClassName") || ""
  );
  const [showClassModal, setShowClassModal] = useState(false);
  const [classUpdateLoading, setClassUpdateLoading] = useState(false);

  const handleUpdateClass = async () => {
    if (!validateClassName(className)) {
      showErrorAlert(
        ALERT_MESSAGES.CLASS_REQUIRED.title,
        ALERT_MESSAGES.CLASS_REQUIRED.message
      );
      return;
    }

    setClassUpdateLoading(true);
    try {
      const response = await authService.updateStudentClass(className.trim());
      if (response.success) {
        // Save to storage for persistence
        storage.set("userClassName", className.trim());
        showSuccessAlert(
          ALERT_MESSAGES.CLASS_UPDATE_SUCCESS.title,
          ALERT_MESSAGES.CLASS_UPDATE_SUCCESS.message
        );
        setShowClassModal(false);
        onClassUpdated();
      }
    } catch (error: any) {
      showErrorAlert(
        ALERT_MESSAGES.CLASS_UPDATE_FAILED.title,
        error.message || ALERT_MESSAGES.CLASS_UPDATE_FAILED.message
      );
    } finally {
      setClassUpdateLoading(false);
    }
  };

  return {
    className,
    showClassModal,
    classUpdateLoading,
    setClassName,
    setShowClassModal,
    handleUpdateClass,
  };
};
