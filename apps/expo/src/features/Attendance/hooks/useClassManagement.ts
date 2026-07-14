import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { mutationKeys } from "@/shared/constants/mutationKeys";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { userService } from "@/shared/services/userService";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { UseClassManagementReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { useAuthStore } from "@shared/stores/authStore";
import { storage } from "@shared/utils/mmkvStorage";
import { parseClassName } from "@shared/utils/parsers";

export const useClassManagement = (onClassUpdated: () => void): UseClassManagementReturn => {
  const { user, updateUser } = useAuthStore();
  const defaultClassName = user?.className || storage.getString("userClassName") || "";
  const [className, setClassName] = useState(defaultClassName);
  const [showClassModal, setShowClassModal] = useState(false);
  const { alert } = useHapticAlerts();

  const handleUpdateClassMutateFn = async () => {
    if (!parseClassName(className)) {
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

  const { mutateAsync: handleUpdateClass, isPending: classUpdateLoading } = useMutation({
    mutationFn: handleUpdateClassMutateFn,
    networkMode: "online",
    mutationKey: mutationKeys.user.updateClass,
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
      if ((!data?.success || error) && contextClassName) {
        updateUser({ className: contextClassName });
        setClassName(contextClassName);
        showErrorAlert(
          ALERT_MESSAGES.CLASS_UPDATE_FAILED.title,
          (error && error.message) || ALERT_MESSAGES.CLASS_UPDATE_FAILED.message,
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
