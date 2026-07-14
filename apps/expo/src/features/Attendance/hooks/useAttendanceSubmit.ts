import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { parsePasscode } from "@/features/Attendance/utils/parsers";
import { mutationKeys } from "@/shared/constants/mutationKeys";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { submitAttendance } from "@attendance/services/attendanceService";
import { stopBackgroundTracking } from "@attendance/services/backgroundTask";
import { UseAttendanceSubmitReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { getCurrentLocationHigh } from "@attendance/utils/locationUtils";

import { Lecture } from "../types/common";

/**
 * Custom hook to manage attendance submission
 */
export const useAttendanceSubmit = (): UseAttendanceSubmitReturn => {
  const [passcode, setPasscode] = useState("");
  const { alert } = useHapticAlerts();

  const handleSubmitMutateFn = async ({
    joinedLecture,
    onSuccess,
  }: {
    joinedLecture: Lecture;
    onSuccess: () => void;
  }) => {
    if (!parsePasscode(passcode)) {
      showErrorAlert(
        ALERT_MESSAGES.INVALID_PASSCODE.title,
        ALERT_MESSAGES.INVALID_PASSCODE.message,
        alert,
      );
      return null;
    }
    const location = await getCurrentLocationHigh();
    if (!location) {
      throw new Error("Could not get current location");
    }

    const res = await submitAttendance(
      joinedLecture.id,
      passcode,
      location.latitude,
      location.longitude,
    );

    return { res, onSuccess };
  };

  const { mutateAsync: handleSubmit, isPending: loading } = useMutation({
    mutationFn: handleSubmitMutateFn,
    mutationKey: mutationKeys.attendance.submit,
    onSuccess: async (data) => {
      if (data === null) {
        return;
      }
      const { res, onSuccess } = data;
      // TODO: make this message less techinal.
      if (res.success) {
        const status = res.data?.status;
        if (status === "present") {
          showSuccessAlert(
            ALERT_MESSAGES.ATTENDANCE_SUCCESS.title,
            ALERT_MESSAGES.ATTENDANCE_SUCCESS.message,
            alert,
          );
        } else if (status === "incomplete") {
          showErrorAlert(
            ALERT_MESSAGES.ATTENDANCE_INCOMPLETE.title,
            res.message || ALERT_MESSAGES.ATTENDANCE_INCOMPLETE.message,
            alert,
          );
        } else if (status === "absent") {
          showErrorAlert(
            ALERT_MESSAGES.ATTENDANCE_ABSENT.title,
            res.message || ALERT_MESSAGES.ATTENDANCE_ABSENT.message,
            alert,
          );
        } else {
          showSuccessAlert(
            ALERT_MESSAGES.ATTENDANCE_SUCCESS.title,
            ALERT_MESSAGES.ATTENDANCE_SUCCESS.message,
            alert,
          );
        }

        setPasscode("");
        await stopBackgroundTracking();
        onSuccess();
      }
    },
    onError(error) {
      showErrorAlert(
        ALERT_MESSAGES.SUBMISSION_FAILED.title,
        error.message || ALERT_MESSAGES.SUBMISSION_FAILED.message,
        alert,
      );
    },
  });

  return {
    passcode,
    loading,
    setPasscode,
    handleSubmit,
  };
};
