import { getStudentLectureDetails } from "@/features/Classes/services/lectureService";
import { queryKeys } from "@/shared/constants/queryKeys";
import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import {
  ALERT_MESSAGES,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseLectureDetailsParamReturn } from "@attendance/types/studentDashboard.types";
import { showErrorAlert } from "@attendance/utils/alertUtils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

/**
 * Custom hook to handle auto-join from notification (lectureId param)
 */
export const useLectureDetailsParam = (
  lectures: Lecture[],
  onJoinLecture: (lecture: any) => Promise<void>
): UseLectureDetailsParamReturn => {
  const { lectureId } = useLocalSearchParams();

  const {
    data: lectureDetails,
    refetch,
    isFetching: fetchingLectureDetails,
  } = useQuery({
    queryFn: async () => {
      if (lectureId) {
        return await getStudentLectureDetails(lectureId as string);
      }
      return null;
    },
    queryKey: lectureId
      ? queryKeys.getStudentLectureDetails.withId(lectureId as string)
      : queryKeys.getStudentLectureDetails.all,
    staleTime: StaleTime.SECONDS_30,
    gcTime: GarbageTime.SECONDS_30,
  });

  const fetchAndJoinLecture = async () => {
    if (lectureId) {
      // First check if we already have the lecture in our list
      const lectureToJoin = lectures.find((lec) => lec.id === lectureId);

      if (lectureToJoin) {
        await onJoinLecture(lectureToJoin);
      } else {
        // Fetch lecture details from API if not in list
        try {
          console.log(LOG_MESSAGES.FETCHING_DETAILS, lectureId);
          let res = lectureDetails;
          if (res === null) {
            refetch();
          }
          res = lectureDetails;
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
          return true;
        } catch (error: any) {
          console.error(LOG_MESSAGES.DETAILS_ERROR, error);
          showErrorAlert(
            ALERT_MESSAGES.LECTURE_DETAILS_FAILED.title,
            error.message || ALERT_MESSAGES.LECTURE_DETAILS_FAILED.message
          );
          // Fallback: try to join with just the ID
          await onJoinLecture({ id: lectureId });
          return false;
        }
      }
    }
    return false;
  };

  useQuery({
    queryFn: fetchAndJoinLecture,
    queryKey: queryKeys.joinLectureWithNotification,
    enabled: true,
    retry: false,
  });

  return {
    fetchingLectureDetails,
  };
};
