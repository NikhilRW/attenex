import { mutationKeys } from "@/shared/constants/mutationKeys";
import { userService } from "@/shared/services/userService";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { UseClassManagementReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { validateClassName } from "@attendance/utils/validationUtils";
import { useAuthStore } from "@shared/stores/authStore";
import { storage } from "@shared/utils/mmkvStorage";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Custom hook to manage class updates
 */
export const useClassManagement = (
  onClassUpdated: () => void,
): UseClassManagementReturn => {
  const { user, updateUser } = useAuthStore();
  const defaultClassName =
    (user as any)?.className || storage.getString("userClassName") || "";
  const [className, setClassName] = useState(defaultClassName);
  const [showClassModal, setShowClassModal] = useState(false);

  const handleUpdateClassMutateFn = async () => {
    if (!validateClassName(className)) {
      showErrorAlert(
        ALERT_MESSAGES.CLASS_REQUIRED.title,
        ALERT_MESSAGES.CLASS_REQUIRED.message,
        alert,
      );
      return;
    }
    const response = await userService.updateStudentClass(className.trim());
    return response;
  };

  const { mutateAsync: handleUpdateClass, isPending: classUpdateLoading } =
    useMutation({
      mutationFn: handleUpdateClassMutateFn,
      mutationKey: mutationKeys.updateStudentClass,
      onMutate: () => {
        setShowClassModal(false);
        onClassUpdated();
        let contextClassName = user?.className;
        updateUser({ className: className.trim() });
        return contextClassName;
      },
      onSuccess(response) {
        if (response && response.success) {
          storage.set("userClassName", className.trim());
          showSuccessAlert(
            ALERT_MESSAGES.CLASS_UPDATE_SUCCESS.title,
            ALERT_MESSAGES.CLASS_UPDATE_SUCCESS.message,
            alert,
          );
          setShowClassModal(false);
          onClassUpdated();
        }
      },
      onSettled(data, error, _, contextClassName) {
        if (!data?.success || error) {
          updateUser({ className: contextClassName });
          setClassName(contextClassName);
          showErrorAlert(
            ALERT_MESSAGES.CLASS_UPDATE_FAILED.title,
            (error && error.message) ||
              ALERT_MESSAGES.CLASS_UPDATE_FAILED.message,
            alert,
          );
        }
      },
    });

  return {
    className,
    showClassModal,
    classUpdateLoading,
    setClassName,
    setShowClassModal,
    handleUpdateClass,
  };
};
