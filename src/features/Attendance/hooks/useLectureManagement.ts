import { getStudentLectures } from "@/src/features/Classes/services/lectureService";
import {
  LECTURE_AUTO_REFRESH_INTERVAL,
  LOG_MESSAGES,
} from "@attendance/constants/studentDashboard.constants";
import { Lecture } from "@attendance/types/common";
import { UseLectureManagementReturn } from "@attendance/types/studentDashboard.types";
import { useAuthStore } from "@shared/stores/authStore";
import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage lecture fetching and auto-refresh
 */
export const useLectureManagement = (): UseLectureManagementReturn => {
  const { user } = useAuthStore();
  const [lectures, setLectures] = useState<Lecture[]>([]);

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
        setLectures([]);
        return;
      }

      const res = await getStudentLectures(userClassName);
      console.log(LOG_MESSAGES.LECTURES_RESPONSE, res);

      if (res.success) {
        setLectures(res.data || []);
        console.log(LOG_MESSAGES.LECTURES_SET, res.data?.length || 0);
      } else {
        console.log(LOG_MESSAGES.API_FAILED, res.message);
        setLectures([]);
      }
    } catch (error) {
      console.log(LOG_MESSAGES.FETCH_ERROR, error);
      setLectures([]);
    }
  }, [user]);

  const refreshLectures = useCallback(() => {
    console.log(LOG_MESSAGES.AUTO_REFRESH);
    fetchLectures();
  }, [fetchLectures]);

  // Auto-reload lectures when user changes and every 30 seconds
  useEffect(() => {
    fetchLectures();

    const intervalId = setInterval(
      refreshLectures,
      LECTURE_AUTO_REFRESH_INTERVAL
    );

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fetchLectures]);

  return {
    lectures,
    fetchLectures,
    refreshLectures,
  };
};
