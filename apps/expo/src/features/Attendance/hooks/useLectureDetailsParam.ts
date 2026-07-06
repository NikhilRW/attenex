import { lectureService } from "@/features/Classes/services/lectureService";
import { useHapticAlerts } from "@/shared/hooks/useHapticAlerts";
import { parseLectureId } from "@/shared/utils/parsers";
import {
  ALERT_MESSAGES,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseLectureDetailsParamReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert } from "@attendance/utils/alertUtils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";


/**
 * Custom hook to handle auto-join from notification (lectureId param)
 */
export const useLectureDetailsParam = (
  lectures: Lecture[],
  onJoinLecture: (lecture: any) => Promise<void>,
): UseLectureDetailsParamReturn => {
  const { lectureId } = useLocalSearchParams();
  const router = useRouter();
  const { alert } = useHapticAlerts();
  const [isFetchingLectureDetails, setIsFetchingLectureDetails] =
    useState(false);
  const handledLectureId = useRef<string | null>(null);

  const fetchAndJoinLecture = useCallback(async () => {
    if (typeof lectureId === "string") {
      setIsFetchingLectureDetails(true);
      try {
        // First check if we already have the lecture in our list
        const lectureToJoin = lectures.find((lec) => lec.id === lectureId);
        console.log("Lecture To Join : "+lectureToJoin);
        
        if (lectureToJoin) {
          await onJoinLecture(lectureToJoin);
        } else {
          try {
            const res =
              await lectureService.getStudentLectureDetails(lectureId);
            if (res.success && res.data && !Array.isArray(res.data)) {
              
              console.log(
                LOG_MESSAGES.DETAILS_FETCHED,
                "useLectureDetailsParams",
                res.data,
              );
              const lectureData = {
                id: res.data.id,
                subject: res.data.subject,
                className: res.data.className,
                startedAt: res.data.startedAt,
              };
              await onJoinLecture(lectureData);
            } else {
              console.log(LOG_MESSAGES.DETAILS_FAILED);
              showErrorAlert(
                ALERT_MESSAGES.LECTURE_DETAILS_FAILED.title,
                ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message,
                alert,
              );
              // Still try to join with minimal data
              await onJoinLecture({ id: lectureId });
            }
            router.setParams({ lectureId: undefined });
          } catch (error: any) {
            console.error(LOG_MESSAGES.DETAILS_ERROR, error);
            showErrorAlert(
              ALERT_MESSAGES.LECTURE_DETAILS_FAILED.title,
              error.message || ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message,
              alert,
            );
          }
        }
      } finally {
        setIsFetchingLectureDetails(false);
        router.setParams({ lectureId: undefined });
      }
    }
  }, [alert, lectureId, lectures, onJoinLecture, router]);

  useEffect(() => {
    if (parseLectureId(lectureId) && handledLectureId.current !== lectureId) {
      handledLectureId.current = lectureId as string;
      fetchAndJoinLecture();
    }
  }, [fetchAndJoinLecture, lectureId]);
  return {
    isFetchingLectureDetails,
  };
};
