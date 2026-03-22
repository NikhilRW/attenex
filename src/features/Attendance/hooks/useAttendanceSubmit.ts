import { mutationKeys } from "@/shared/constants/mutationKeys";
import { useAuthStore } from "@/shared/stores/authStore";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { submitAttendance } from "@attendance/services/attendanceService";
import { stopBackgroundTracking } from "@attendance/services/backgroundTask";
import { Lecture } from "@attendance/types/common";
import { UseAttendanceSubmitReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert, showSuccessAlert } from "@attendance/utils/alertUtils";
import { getCurrentLocationHigh } from "@attendance/utils/locationUtils";
import { validatePasscode } from "@attendance/utils/validationUtils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

/**
 * Custom hook to manage attendance submission
 */
export const useAttendanceSubmit = (
  proceedWithJoin: (data: {
    lecture: Lecture;
    studentRollNo: string;
  }) => Promise<
    | false
    | {
        res: any;
        lecture: Lecture;
      }
    | undefined
  >,
): UseAttendanceSubmitReturn => {
  const [passcode, setPasscode] = useState("");
  const rollNo = useAuthStore((state) => state.user?.rollNo);
  const { alert } = useAlerts();

  const handleSubmitMutateFn = async ({
    joinedLecture,
    onSuccess,
  }: {
    joinedLecture: Lecture;
    onSuccess: () => void;
  }) => {
    if (!validatePasscode(passcode)) {
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
      if (res.success) {
        showSuccessAlert(
          ALERT_MESSAGES.ATTENDANCE_SUCCESS.title,
          ALERT_MESSAGES.ATTENDANCE_SUCCESS.message,
          alert,
        );

        setPasscode("");
        await stopBackgroundTracking();
        onSuccess();
      }
    },
    onSettled(data, error, { joinedLecture }) {
      if (!data || error) {
        if (rollNo) {
          proceedWithJoin({
            lecture: joinedLecture,
            studentRollNo: rollNo!,
          });
        }
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
