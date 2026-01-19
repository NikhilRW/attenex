import { lectureService } from "@/features/Classes/services/lectureService";
import { queryKeys } from "@/shared/constants/queryKeys";
import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import {
  LECTURE_AUTO_REFRESH_INTERVAL,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { UseLectureManagementReturn } from "@attendance/types/studentDashboard.types";
import { useAuthStore } from "@shared/stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Lecture } from "../types";

/**
 * Custom hook to manage lecture fetching and auto-refresh
 */
export const useLectureManagement = (
  joinedLecture: Lecture | null
): UseLectureManagementReturn => {
  const { user } = useAuthStore();

  const fetchLectures = useCallback(async () => {
    try {
      const userClassName = (user as any)?.className;
      console.log(LOG_MESSAGES.FETCHING_LECTURES, {
        userId: user?.id,
        className: userClassName,
        hasClassName: !!userClassName,
      });

      if (!userClassName) {
        console.log(LOG_MESSAGES.NO_CLASSNAME);
        return [];
      }

      const res = await lectureService.getStudentLectures(userClassName);
      console.log(LOG_MESSAGES.LECTURES_RESPONSE, res);

      if (res.success) {
        console.log(LOG_MESSAGES.LECTURES_SET, res.data?.length || 0);
        return res.data || [];
      } else {
        console.log(LOG_MESSAGES.API_FAILED, res.message);
        return [];
      }
    } catch (error) {
      console.log(LOG_MESSAGES.FETCH_ERROR, error);
      return [];
    }
  }, [user]);

  const shouldQueryBeEnabled = joinedLecture !== null ? false : true;

  const { data: lectures, refetch: refreshLectures } = useQuery({
    queryFn: fetchLectures,
    queryKey: queryKeys.fetctLectureForStudent,
    refetchInterval: LECTURE_AUTO_REFRESH_INTERVAL,
    staleTime: StaleTime.SECONDS_30,
    gcTime: GarbageTime.SECONDS_30,
    enabled: shouldQueryBeEnabled,
  });

  return {
    lectures,
    refreshLectures,
  };
};
