import { Lecture } from "@attendance/types/common";
import { useState } from "react";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { submitAttendance } from "@attendance/services/attendanceService";
import { stopBackgroundTracking } from "@attendance/services/backgroundTask";
import { UseAttendanceSubmitReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { getCurrentLocationHigh } from "@attendance/utils/locationUtils";
import { validatePasscode } from "@attendance/utils/validationUtils";

/**
 * Custom hook to manage attendance submission
 */
export const useAttendanceSubmit = (): UseAttendanceSubmitReturn => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    joinedLecture: Lecture,
    onSuccess: () => void
  ) => {
    if (!validatePasscode(passcode)) {
      showErrorAlert(
        ALERT_MESSAGES.INVALID_PASSCODE.title,
        ALERT_MESSAGES.INVALID_PASSCODE.message
      );
      return;
    }

    setLoading(true);
    try {
      const location = await getCurrentLocationHigh();
      if (!location) {
        throw new Error("Could not get current location");
      }

      const res = await submitAttendance(
        joinedLecture.id,
        passcode,
        location.latitude,
        location.longitude
      );

      if (res.success) {
        showSuccessAlert(
          ALERT_MESSAGES.ATTENDANCE_SUCCESS.title,
          ALERT_MESSAGES.ATTENDANCE_SUCCESS.message
        );

        setPasscode("");
        await stopBackgroundTracking();
        onSuccess();
      }
    } catch (error: any) {
      showErrorAlert(
        ALERT_MESSAGES.SUBMISSION_FAILED.title,
        error.message || ALERT_MESSAGES.SUBMISSION_FAILED.message
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    passcode,
    loading,
    setPasscode,
    handleSubmit,
  };
};
