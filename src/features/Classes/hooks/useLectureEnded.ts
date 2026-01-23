import { queryKeys } from "@/shared/constants/queryKeys";
import { lectureService } from "@classes/services/lectureService";
import { socketService } from "@shared/services/socketService";
import { logger } from "@shared/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAlerts } from "react-native-paper-alerts";

// TODO: Think about adding the password feature
export const useLectureEnded = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lectureId, lectureTitle } = params;
  const { alert } = useAlerts();
  const [passcode, setPasscode] = useState<string | null>(null);
  // const [, setLastUpdated] = useState<Date | null>(null);

  // Animation for passcode glow effect
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPasscodeDataQueryFn = async () => {
    try {
      const res = await lectureService.getPasscode(lectureId as string);
      if (res.success) {
        setPasscode(res.data.passcode);
      }
      return res.success;
    } catch (error: any) {
      logger.error("Failed to fetch passcode:", error);
      alert("Error", error.message || "Failed to fetch passcode");
      return false;
    }
  };

  const { refetch: fetchPasscodeData, isFetching: loading } = useQuery({
    queryFn: fetchPasscodeDataQueryFn,
    queryKey: queryKeys.fetchPasscodedForLectureEnded,
  });

  useEffect(() => {
    // Connect to socket and join lecture room
    socketService.connect();
    socketService.joinLecture(lectureId as string);

    // Listen for passcode refresh events
    socketService.onPasscodeRefresh((data) => {
      logger.info("Passcode refresh event received:", data);
      if (data.lectureId === lectureId) {
        setPasscode(data.passcode);
        // setLastUpdated(new Date(data.updatedAt));
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveLecture(lectureId as string);
      socketService.offPasscodeRefresh();
    };
  }, [lectureId]);

  const handleDone = () => {
    router.back();
  };

  return {
    lectureId,
    lectureTitle,
    passcode,
    loading,
    glowOpacity,
    fetchPasscodeData,
    handleDone,
  };
};
