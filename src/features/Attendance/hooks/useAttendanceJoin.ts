import { mutationKeys } from "@/shared/constants/mutationKeys";
import { ALERT_MESSAGES } from "@attendance/constants/studentDashboard.constants";
import { joinLecture } from "@attendance/services/attendanceService";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "@attendance/services/backgroundTask";
import { Lecture } from "@attendance/types/common";
import {
  JoinStatus,
  UseAttendanceJoinReturn,
} from "@attendance/types/studentDashboard.types";
import {
  showDestructiveAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@attendance/utils/alertUtils";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "@attendance/utils/locationUtils";
import { useAuthStore } from "@shared/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

/**
 * Custom hook to manage joining and leaving lectures
 */
export const useAttendanceJoin = (
  onRollNoRequired: (lecture: Lecture) => void,
): UseAttendanceJoinReturn => {
  const { user } = useAuthStore();
  const [joinedLecture, setJoinedLecture] = useState<Lecture | null>(null);
  const [status, setStatus] = useState<JoinStatus>("idle");

  const { alert } = useAlerts();

  const proceedWithJoinMutation = useCallback(
    async ({
      lecture,
      studentRollNo,
    }: {
      lecture: Lecture;
      studentRollNo: string;
    }) => {
      const hasPermission = await requestLocationPermission(alert);
      if (!hasPermission) {
        return false;
      }

      const location = await getCurrentLocation();
      if (!location) {
        throw new Error("Could not get current location");
      }

      const res = await joinLecture(
        lecture.id,
        location.latitude,
        location.longitude,
        studentRollNo,
      );
      return {
        res,
        lecture,
      };
    },
    [alert],
  );

  const { mutateAsync: proceedWithJoin, isPending: loading } = useMutation({
    mutationFn: proceedWithJoinMutation,
    mutationKey: mutationKeys.lectureJoin,
    onMutate: ({ lecture }) => {
      setJoinedLecture(lecture);
      setStatus("joined");
    },
    onSuccess: async (data) => {
      if (data === false) {
        return false;
      }
      const { res, lecture } = data;
      if (res.success) {
        showSuccessAlert(
          ALERT_MESSAGES.JOINED.title,
          ALERT_MESSAGES.JOINED.message,
          alert
        );
        // Start Background Task
        await startBackgroundTracking(lecture.id);
      } else {
        setJoinedLecture(null);
      }
      return true;
    },
    onSettled(data) {
      if (data === false) {
        setJoinedLecture(null);
        setStatus("idle");
        showErrorAlert(
          ALERT_MESSAGES.JOIN_FAILED.title,
          ALERT_MESSAGES.JOIN_FAILED.message,
          alert,
        );
      }
    },
    onError: (error) => {
      console.log(error);
      setJoinedLecture(null);
      setStatus("idle");
      showErrorAlert(
        ALERT_MESSAGES.JOIN_FAILED.title,
        error.message || ALERT_MESSAGES.JOIN_FAILED.message,
        alert,
      );
      return false;
    },
  });

  const handleJoinMutateFn = useCallback(
    async (lecture: Lecture) => {
      // Check if user has a roll number set
      if (!user?.rollNo) {
        onRollNoRequired(lecture);
        return;
      }

      await proceedWithJoin({ lecture, studentRollNo: user.rollNo });
    },
    [proceedWithJoin, user, onRollNoRequired],
  );
  const { mutateAsync: handleJoin } = useMutation({
    mutationFn: handleJoinMutateFn,
    mutationKey: mutationKeys.handleClassJoin,
  });

  const handleLeaveLecture = useCallback(async (onLectureLeft: () => void) => {
    showDestructiveAlert(
      ALERT_MESSAGES.LEAVE_LECTURE.title,
      ALERT_MESSAGES.LEAVE_LECTURE.message,
      alert,
      "Leave",
      async () => {
        await stopBackgroundTracking();
        setJoinedLecture(null);
        setStatus("idle");
        onLectureLeft();
      },
    );
  }, [alert]);

  return {
    joinedLecture,
    status,
    loading,
    handleJoin,
    handleLeaveLecture,
    setJoinedLecture,
    setStatus,
    proceedWithJoin,
  };
};
