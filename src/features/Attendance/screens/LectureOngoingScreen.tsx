import React, { useCallback } from "react";
import LectureOngoing from "../components/LectureAttending/LectureOngoing";
import { socketService } from "@/shared/services/socketService";
import { useSocketManager } from "../hooks/useSocketManager";
import { useLectureManagement } from "../hooks/useLectureManagement";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { useAuthStore } from "@/shared/stores/authStore";
import { router } from "expo-router";
import { useLectureOngoingScreen } from "../hooks/useLectureOngoingScreen";
import { showDestructiveAlert } from "../utils/alertUtils";
import { stopBackgroundTracking } from "../services/backgroundTask";
import { ALERT_MESSAGES } from "../constants/studentDashboard.constants";

const LectureOngoingScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { alert } = useHapticAlerts();
  const { joinedLecture } = useLectureOngoingScreen();
  const { refreshLectures } = useLectureManagement(joinedLecture || null);
  const { setLectureStatus } = useSocketManager(
    joinedLecture ?? null,
    refreshLectures,
    alert,
  );

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
        setLectureStatus("active");
        refreshLectures();
        router.navigate("/attendance");
      },
    );
  }, [alert, joinedLecture, refreshLectures, setLectureStatus, user?.role]);

  return (
    <LectureOngoing
      joinedLecture={joinedLecture!}
      handleLeaveLecture={handleLeaveLecture}
    />
  );
};

export default LectureOngoingScreen;
