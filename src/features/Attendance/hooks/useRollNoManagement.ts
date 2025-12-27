import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseRollNoManagementReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert } from "@attendance/utils/alertUtils";
import { validateRollNo } from "@attendance/utils/validationUtils";
import { useState } from "react";

/**
 * Custom hook to manage roll number handling
 */
export const useRollNoManagement = (): UseRollNoManagementReturn => {
  const [rollNo, setRollNo] = useState("");
  const [showRollNoModal, setShowRollNoModal] = useState(false);
  const [pendingLecture, setPendingLecture] = useState<Lecture | null>(null);

  const handleRollNoSubmit = async (
    onSubmit: (rollNo: string) => Promise<void>
  ) => {
    if (!validateRollNo(rollNo)) {
      showErrorAlert(
        ALERT_MESSAGES.ROLLNO_REQUIRED.title,
        ALERT_MESSAGES.ROLLNO_REQUIRED.message
      );
      return;
    }

    setShowRollNoModal(false);
    await onSubmit(rollNo.trim());
    setPendingLecture(null);
    setRollNo("");
  };

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
