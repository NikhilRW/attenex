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

const isLocationTooFarError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const errorWithResponse = error as {
    message?: unknown;
    response?: {
      status?: number;
      data?: {
        message?: unknown;
      };
    };
  };

  if (errorWithResponse.response?.status === 403) {
    return true;
  }

  const message =
    typeof errorWithResponse.message === "string"
      ? errorWithResponse.message
      : errorWithResponse.response?.data?.message;

  return (
    typeof message === "string" &&
    message.toLowerCase().includes("you are too far from the class")
  );
};

const retryJoinUnlessLocationTooFar = (
  failureCount: number,
  error: unknown,
): boolean => {
  if (isLocationTooFarError(error)) {
    return false;
  }

  return failureCount < 3;
};

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

      if (!user?.rollNo) {
        onRollNoRequired(lecture);
        return;
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
    [alert, onRollNoRequired, user?.rollNo],
  );

  const {
    mutateAsync: proceedWithJoin,
    variables,
    isPending: loading,
  } = useMutation({
    mutationFn: proceedWithJoinMutation,
    mutationKey: mutationKeys.lectures.join,
    retry: retryJoinUnlessLocationTooFar,
    onSuccess: async (data) => {
      if (data === undefined || data === false) {
        return false;
      }
      const { res, lecture } = data as any;
      if (res.success) {
        setJoinedLecture(lecture);
        setStatus("joined");
        showSuccessAlert(
          ALERT_MESSAGES.JOINED.title,
          ALERT_MESSAGES.JOINED.message,
          alert,
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
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : ALERT_MESSAGES.JOIN_FAILED.message;
      showErrorAlert(ALERT_MESSAGES.JOIN_FAILED.title, errorMessage, alert);
      return false;
    },
  });
  const loadingLectureId = variables?.lecture.id;

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
    mutationKey: mutationKeys.classes.join,
    retry: retryJoinUnlessLocationTooFar,
  });

  const handleLeaveLecture = useCallback(
    async (onLectureLeft: () => void) => {
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
    },
    [alert],
  );

  return {
    joinedLecture,
    status,
    loadingLectureId,
    handleJoin,
    handleLeaveLecture,
    setJoinedLecture,
    setStatus,
    proceedWithJoin,
    loading,
  };
};
