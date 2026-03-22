import { lectureService } from "@/features/Classes/services/lectureService";
import {
  ALERT_MESSAGES,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseLectureDetailsParamReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert } from "@attendance/utils/alertUtils";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAlerts } from "react-native-paper-alerts";

/**
 * Custom hook to handle auto-join from notification (lectureId param)
 */
export const useLectureDetailsParam = (
  lectures: Lecture[],
  onJoinLecture: (lecture: any) => Promise<void>,
): UseLectureDetailsParamReturn => {
  const { lectureId } = useLocalSearchParams();
  const { alert } = useAlerts();
  const [isFetchingLectureDetails, setIsFetchingLectureDetails] =
    useState(false);

  const fetchAndJoinLecture = useCallback(async () => {
    if (lectureId) {
      setIsFetchingLectureDetails(true);
      console.log("HERE");

      // First check if we already have the lecture in our list
      const lectureToJoin = lectures.find((lec) => lec.id === lectureId);
      if (lectureToJoin) {
        setIsFetchingLectureDetails(false);
        await onJoinLecture(lectureToJoin);
      } else {
        try {
          const res = (await lectureService.getStudentLectureDetails(
            lectureId as string,
          )) as any;

          if (res.success && res.data) {
            setIsFetchingLectureDetails(false);
            console.log(
              LOG_MESSAGES.DETAILS_FETCHED,
              "useLectureDetailsParams",
              res.data,
            );
            const lectureData = {
              id: res.data.id,
              title: res.data.title,
              className: res.data.classname,
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
        } catch (error: any) {
          console.error(LOG_MESSAGES.DETAILS_ERROR, error);
          showErrorAlert(
            ALERT_MESSAGES.LECTURE_DETAILS_FAILED.title,
            error.message || ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message,
            alert,
          );
          setIsFetchingLectureDetails(false);
        }
      }
    }
  }, [alert, lectureId, lectures, onJoinLecture]);

  useEffect(() => {
    if (lectureId) {
      fetchAndJoinLecture();
    }
  }, [fetchAndJoinLecture, lectureId]);
  return {
    isFetchingLectureDetails,
  };
};
