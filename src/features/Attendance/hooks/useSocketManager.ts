import { socketService } from "@/src/shared/services/socketService";
import { Lecture } from "@attendance/types/common";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import {
    ALERT_DELAY,
    ALERT_MESSAGES,
    LOG_MESSAGES,
} from "../constants/studentDashboard.constants";
import {
    LectureStatus,
    UseSocketManagerReturn,
} from "../types/studentDashboard.types";
import { showSuccessAlert } from "../utils/alertUtils";

/**
 * Custom hook to manage socket connections and lecture events
 */
export const useSocketManager = (
  joinedLecture: Lecture | null,
  onAppForeground: () => void
): UseSocketManagerReturn => {
  const [lectureStatus, setLectureStatus] = useState<LectureStatus>("active");

  // Connect to socket on mount
  useEffect(() => {
    socketService.connect();

    // Handle app state changes (background/foreground)
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // App came back to foreground - reconnect socket and refresh lectures
        if (!socketService.isConnected()) {
          socketService.connect();
        }
        console.log(LOG_MESSAGES.APP_FOREGROUND);
        onAppForeground();
      }
    });

    return () => {
      socketService.disconnect();
      subscription.remove();
    };
  }, [onAppForeground]);

  // Listen for lecture ended events globally
  useEffect(() => {
    const handleLectureEnded = (data: {
      lectureId: string;
      status: string;
      endedAt: string;
    }) => {
      console.log(LOG_MESSAGES.LECTURE_ENDED_EVENT, data);

      // Update lecture status if it matches current joined lecture
      if (joinedLecture && data.lectureId === joinedLecture.id) {
        console.log(LOG_MESSAGES.UPDATING_STATUS);
        setLectureStatus("ended");

        // Show alert to notify student
        setTimeout(() => {
          showSuccessAlert(
            ALERT_MESSAGES.LECTURE_ENDED.title,
            ALERT_MESSAGES.LECTURE_ENDED.message
          );
        }, ALERT_DELAY);
      }
    };

    socketService.onLectureEnded(handleLectureEnded);

    return () => {
      socketService.offLectureEnded();
    };
  }, [joinedLecture]);

  // Join/leave lecture room when joinedLecture changes
  useEffect(() => {
    if (joinedLecture) {
      socketService.joinLecture(joinedLecture.id);
      console.log(`${LOG_MESSAGES.JOINED_ROOM} ${joinedLecture.id}`);
    }

    return () => {
      if (joinedLecture) {
        socketService.leaveLecture(joinedLecture.id);
        console.log(`${LOG_MESSAGES.LEFT_ROOM} ${joinedLecture.id}`);
      }
    };
  }, [joinedLecture]);

  return {
    lectureStatus,
    setLectureStatus,
  };
};
