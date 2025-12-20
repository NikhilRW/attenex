import { useAuthStore } from "@/src/shared/stores/authStore";
import { Lecture } from "@attendance/types/common";
import { useCallback, useState } from "react";
import { ALERT_MESSAGES } from "../constants/studentDashboard.constants";
import { joinLecture } from "../services/attendanceService";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "../services/backgroundTask";
import {
  JoinStatus,
  UseAttendanceJoinReturn,
} from "../types/studentDashboard.types";
import { showDestructiveAlert, showErrorAlert, showSuccessAlert } from "../utils/alertUtils";
import {
  getCurrentLocation,
  requestLocationPermission,
} from "../utils/locationUtils";

/**
 * Custom hook to manage joining and leaving lectures
 */
export const useAttendanceJoin = (
  onRollNoRequired: (lecture: Lecture) => void
): UseAttendanceJoinReturn => {
  const { user, updateUser } = useAuthStore();
  const [joinedLecture, setJoinedLecture] = useState<Lecture | null>(null);
  const [status, setStatus] = useState<JoinStatus>("idle");
  const [loading, setLoading] = useState(false);

  const proceedWithJoin = useCallback(
    async (lecture: Lecture, studentRollNo: string) => {
      setLoading(true);
      try {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
          setLoading(false);
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
          studentRollNo
        );

        if (res.success) {
          // Update user in auth store with roll number if returned
          if (res.user && res.user.rollNo) {
            updateUser({ rollNo: res.user.rollNo as string });
          }

          setJoinedLecture(lecture);
          setStatus("joined");
          showSuccessAlert(
            ALERT_MESSAGES.JOINED.title,
            ALERT_MESSAGES.JOINED.message
          );

          // Start Background Task
          await startBackgroundTracking(lecture.id);
        }
      } catch (error: any) {
        console.log(error);
        showErrorAlert(
          ALERT_MESSAGES.JOIN_FAILED.title,
          error.message || ALERT_MESSAGES.JOIN_FAILED.message
        );
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  const handleJoin = useCallback(
    async (lecture: Lecture) => {
      // Check if user has a roll number set
      if (!user?.rollNo) {
        onRollNoRequired(lecture);
        return;
      }

      await proceedWithJoin(lecture, user.rollNo);
    },
    [proceedWithJoin, user, onRollNoRequired]
  );

  const handleLeaveLecture = useCallback(
    async (onLectureLeft: () => void) => {
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
    },
    []
  );

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
