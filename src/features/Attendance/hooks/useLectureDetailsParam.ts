import { getStudentLectureDetails } from "@/src/features/Classes/services/lectureService";
import { Lecture } from "@attendance/types/common";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ALERT_MESSAGES,
  LOG_MESSAGES,
} from "../constants/studentDashboard.constants";
import { UseLectureDetailsParamReturn } from "../types/studentDashboard.types";
import { showErrorAlert } from "../utils/alertUtils";

/**
 * Custom hook to handle auto-join from notification (lectureId param)
 */
export const useLectureDetailsParam = (
  lectures: Lecture[],
  onJoinLecture: (lecture: any) => Promise<void>
): UseLectureDetailsParamReturn => {
  const { lectureId } = useLocalSearchParams();
  const [fetchingLectureDetails, setFetchingLectureDetails] = useState(false);

  useEffect(() => {
    const fetchAndJoinLecture = async () => {
      if (lectureId) {
        // First check if we already have the lecture in our list
        const lectureToJoin = lectures.find((lec) => lec.id === lectureId);

        if (lectureToJoin) {
          await onJoinLecture(lectureToJoin);
        } else {
          // Fetch lecture details from API if not in list
          setFetchingLectureDetails(true);
          try {
            console.log(LOG_MESSAGES.FETCHING_DETAILS, lectureId);
            const res = await getStudentLectureDetails(lectureId as string);

            if (res.success && res.data) {
              console.log(LOG_MESSAGES.DETAILS_FETCHED, res.data);
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
                ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message
              );
              // Still try to join with minimal data
              await onJoinLecture({ id: lectureId });
            }
          } catch (error: any) {
            console.error(LOG_MESSAGES.DETAILS_ERROR, error);
            showErrorAlert(
              ALERT_MESSAGES.LECTURE_DETAILS_FAILED.title,
              error.message || ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message
            );
            // Fallback: try to join with just the ID
            await onJoinLecture({ id: lectureId });
          } finally {
            setFetchingLectureDetails(false);
          }
        }
      }
    };

    fetchAndJoinLecture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureId]);

  return {
    fetchingLectureDetails,
  };
};
