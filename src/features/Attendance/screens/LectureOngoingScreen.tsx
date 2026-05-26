import React, { useCallback } from "react";
import { useAttendanceJoin } from "../hooks/useAttendanceJoin";
import { useRollNoManagement } from "../hooks/useRollNoManagement";
import LectureOngoing from "../components/LectureAttending/LectureOngoing";
import { socketService } from "@/shared/services/socketService";
import { useSocketManager } from "../hooks/useSocketManager";
import { useLectureManagement } from "../hooks/useLectureManagement";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { useAuthStore } from "@/shared/stores/authStore";
import { router } from "expo-router";

const LectureOngoingScreen = () => {
  // Roll number management
  const { requestRollNo } = useRollNoManagement();
  const user = useAuthStore((state) => state.user);
  const { joinedLecture, handleLeaveLecture } =
    useAttendanceJoin(requestRollNo);
  const { alert } = useHapticAlerts();
  // Lecture management
  const { refreshLectures } = useLectureManagement(joinedLecture);

  // Socket manager
  const { setLectureStatus } = useSocketManager(
    joinedLecture,
    refreshLectures,
    alert,
  );
  // Leave lecture handler
  const onLeaveLecture = useCallback(() => {
    if (joinedLecture) {
      socketService.leaveLecture(joinedLecture.id, user?.role || "student");
    }
    setLectureStatus("active");
    refreshLectures();
    router.navigate("/attendance");
  }, [joinedLecture, refreshLectures, setLectureStatus, user?.role]);

  return (
    <LectureOngoing
      joinedLecture={joinedLecture!}
      handleLeaveLecture={() => handleLeaveLecture(onLeaveLecture)}
    />
  );
};

export default LectureOngoingScreen;
