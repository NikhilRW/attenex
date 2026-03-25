import { mutationKeys } from "@/shared/constants/mutationKeys";
import { GarbageTime } from "@/shared/constants/tanstackConfig";
import { useAuthStore } from "@/shared/stores/authStore";
import { logger } from "@shared/utils/logger";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseRollNoManagementReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert } from "@attendance/utils/alertUtils";
import { validateRollNo } from "@attendance/utils/validationUtils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

/**
 * Custom hook to manage roll number handling
 */
export const useRollNoManagement = (): UseRollNoManagementReturn => {
  const [rollNo, setRollNo] = useState("");
  const [showRollNoModal, setShowRollNoModal] = useState(false);
  const [pendingLecture, setPendingLecture] = useState<Lecture | null>(null);
  const { alert } = useAlerts();
  const { updateUser, user } = useAuthStore();

  const handleRollNoSubmitMutateFn = async (
    onSubmit: (rollNo: string) => Promise<void>,
  ) => {
    if (!validateRollNo(rollNo)) {
      return false;
    }
    setShowRollNoModal(false);
    await onSubmit(rollNo.trim());
    return true;
  };

  const { mutate: handleRollNoSubmit } = useMutation({
    mutationFn: handleRollNoSubmitMutateFn,
    gcTime: GarbageTime.SECONDS_30,
    mutationKey: mutationKeys.user.submitRollNo,
    onMutate() {
      const contextRollNo = user?.rollNo;
      updateUser({ rollNo: rollNo });
      return contextRollNo;
    },
    onSuccess: () => {
      setPendingLecture(null);
      setRollNo("");
    },
    onSettled: (data, error, _, contextRollNo) => {
      if (data === false || error) {
        showErrorAlert(
          ALERT_MESSAGES.ROLL_NO_NOT_UPDATED.title,
          ALERT_MESSAGES.ROLL_NO_NOT_UPDATED.message,
          alert,
        );
        updateUser({ rollNo: contextRollNo });
      }
    },
    onError: (error) => {
      logger.error(error.message);
      showErrorAlert(
        "Roll no not updated successfully",
        "Kindly try again",
        alert,
      );
    },
  });

  const requestRollNo = (lecture: Lecture) => {
    setPendingLecture(lecture);
    setShowRollNoModal(true);
  };

  return {
    rollNo,
    showRollNoModal,
    pendingLecture,
    setRollNo,
    setShowRollNoModal,
    setPendingLecture,
    handleRollNoSubmit,
    requestRollNo,
  };
};
