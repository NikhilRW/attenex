import React, { useCallback, useEffect } from "react";

import { router } from "expo-router";

import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { socketService } from "@/shared/services/socketService";
import { useAuthStore } from "@/shared/stores/authStore";

import LectureOngoing from "../components/LectureAttending/LectureOngoing";
import { ALERT_MESSAGES } from "../constants/studentDashboard.constants";
import { useLectureManagement } from "../hooks/useLectureManagement";
import { useLectureOngoingScreen } from "../hooks/useLectureOngoingScreen";
import { stopBackgroundTracking } from "../services/backgroundTask";
import { showDestructiveAlert } from "../utils/alertUtils";

const LectureOngoingScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { alert } = useHapticAlerts();
  const { joinedLecture } = useLectureOngoingScreen();
  const { refreshLectures } = useLectureManagement(joinedLecture || null);

  // Listen for lecture ended event and go back to dashboard
  useEffect(() => {
    const handleLectureEnded = (data: { lectureId: string }) => {
      if (joinedLecture && data.lectureId === joinedLecture.id) {
        // Pop back to existing StudentDashboard which will show LectureEnded
        router.back();
      }
    };

    socketService.onLectureEnded(handleLectureEnded);

    return () => {
      socketService.offLectureEnded(handleLectureEnded);
    };
  }, [joinedLecture]);

  const handleLeaveLecture = useCallback(async () => {
    showDestructiveAlert(
      ALERT_MESSAGES.LEAVE_LECTURE.title,
      ALERT_MESSAGES.LEAVE_LECTURE.message,
      alert,
      "Leave",
      async () => {
        await stopBackgroundTracking();
        if (joinedLecture) {
          socketService.leaveLecture(joinedLecture.id, user?.role || "student");
        }
        refreshLectures();
        router.navigate("/attendance");
      },
    );
  }, [alert, joinedLecture, refreshLectures, user?.role]);

  return <LectureOngoing joinedLecture={joinedLecture!} handleLeaveLecture={handleLeaveLecture} />;
};

export default LectureOngoingScreen;
