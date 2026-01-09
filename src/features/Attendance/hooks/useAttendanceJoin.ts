import { mutationKeys } from "@/src/shared/constants/mutationKeys";
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

/**
 * Custom hook to manage joining and leaving lectures
 */
export const useAttendanceJoin = (
  onRollNoRequired: (lecture: Lecture) => void
): UseAttendanceJoinReturn => {
  const { user, updateUser } = useAuthStore();
  const [joinedLecture, setJoinedLecture] = useState<Lecture | null>(null);
  const [status, setStatus] = useState<JoinStatus>("idle");
  const proceedWithJoinMutation = useCallback(
    async ({
      lecture,
      studentRollNo,
    }: {
      lecture: Lecture;
      studentRollNo: string;
    }) => {
      try {
        updateUser({ rollNo: studentRollNo });

        const hasPermission = await requestLocationPermission();
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
          studentRollNo
        );

        if (res.success) {
          setJoinedLecture(lecture);
          setStatus("joined");
          showSuccessAlert(
            ALERT_MESSAGES.JOINED.title,
            ALERT_MESSAGES.JOINED.message
          );

          // Start Background Task
          await startBackgroundTracking(lecture.id);
        }
        return true;
      } catch (error: any) {
        console.log(error);
        showErrorAlert(
          ALERT_MESSAGES.JOIN_FAILED.title,
          error.message || ALERT_MESSAGES.JOIN_FAILED.message
        );
        return false;
      }
    },
    [updateUser]
  );

  const { mutateAsync: proceedWithJoin, isPending: loading } = useMutation({
    mutationFn: proceedWithJoinMutation,
    mutationKey: mutationKeys.lectureJoin,
  });

  const handleJoin = useCallback(
    async (lecture: Lecture) => {
      // Check if user has a roll number set
      if (!user?.rollNo) {
        onRollNoRequired(lecture);
        return;
      }

      await proceedWithJoin({ lecture, studentRollNo: user.rollNo });
    },
    [proceedWithJoin, user, onRollNoRequired]
  );

  const handleLeaveLecture = useCallback(async (onLectureLeft: () => void) => {
    showDestructiveAlert(
      ALERT_MESSAGES.LEAVE_LECTURE.title,
      ALERT_MESSAGES.LEAVE_LECTURE.message,
      "Leave",
      async () => {
        await stopBackgroundTracking();
        setJoinedLecture(null);
        setStatus("idle");
        onLectureLeft();
      }
    );
  }, []);

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
