import { useCallback, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";

import { lectureService } from "@/features/Classes/services/lectureService";
import { queryKeys } from "@/shared/constants/queryKeys";
import { GarbageTime, StaleTime } from "@/shared/constants/tanstackConfig";
import { parseClassName, parseEndedTrue } from "@/shared/utils/parsers";
import {
  LECTURE_AUTO_REFRESH_INTERVAL,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { UseLectureManagementReturn } from "@attendance/types/studentDashboard.types";
import { useAuthStore } from "@shared/stores/authStore";

import { Lecture } from "../types/common";

/**
 * Custom hook to manage lecture fetching and auto-refresh
 */
export const useLectureManagement = (joinedLecture: Lecture | null): UseLectureManagementReturn => {
  const { user } = useAuthStore();
  const userClassName = user?.className;
  const { ended } = useLocalSearchParams();

  const fetchLectures = useCallback(async () => {
    try {
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
  }, [user, userClassName]);

  const shouldQueryBeEnabled =
    joinedLecture === null && user?.role !== "teacher" && parseClassName(userClassName);

  const { data: lectures, refetch: refreshLectures } = useQuery({
    queryFn: fetchLectures,
    queryKey: userClassName
      ? queryKeys.lectures.studentByClass(userClassName)
      : queryKeys.lectures.student,
    refetchInterval: () => {
      return joinedLecture !== null || user?.role === "teacher" ? 0 : LECTURE_AUTO_REFRESH_INTERVAL;
    },
    staleTime: StaleTime.SECONDS_30,
    gcTime: GarbageTime.SECONDS_30,
    enabled: shouldQueryBeEnabled,
  });

  useEffect(() => {
    if (parseEndedTrue(ended)) {
      refreshLectures();
      router.setParams({ ended: undefined });
    }
  }, [lectures, ended, refreshLectures]);

  return {
    lectures: lectures ?? [],
    refreshLectures,
  };
};
