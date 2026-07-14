import { useCallback, useEffect, useMemo, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAlerts } from "react-native-paper-alerts";
import { useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { queryKeys } from "@/shared/constants/queryKeys";
import { useAuthStore } from "@/shared/stores/authStore";
import { lectureService } from "@classes/services/lectureService";
import { socketService } from "@shared/services/socketService";
import { logger } from "@shared/utils/logger";

export const useLectureEnded = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lectureId, lectureTitle } = params as Record<string, string>;
  const { alert } = useAlerts();
  const [livePasscode, setLivePasscode] = useState<string | null>(null);
  const userRole = useAuthStore((state) => state.user?.role);
  // const [, setLastUpdated] = useState<Date | null>(null);

  // Animation for passcode glow effect
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [glowOpacity]);

  const fetchPasscodeDataQueryFn = async () => {
    try {
      const res = await lectureService.getPasscode(lectureId as string);
      if (res.success) return res;
      return null;
    } catch (error: any) {
      logger.error("Failed to fetch passcode:", error);
      alert("Error", error.message || "Failed to fetch passcode");
      return null;
    }
  };

  const {
    refetch: fetchPasscodeData,
    isFetching: loading,
    data: cachedPasscodeData,
  } = useQuery({
    queryFn: fetchPasscodeDataQueryFn,
    queryKey: queryKeys.lectures.passcode(lectureId || ""),
  });

  const passcode = useMemo(
    () => livePasscode ?? cachedPasscodeData?.data?.passcode ?? null,
    [cachedPasscodeData?.data?.passcode, livePasscode],
  );

  useEffect(() => {
    // Connect to socket and join lecture room
    socketService.connect();
    socketService.joinLecture(lectureId as string, userRole || "teacher");

    // Listen for passcode refresh events
    socketService.onPasscodeRefresh((data) => {
      logger.info("Passcode refresh event received:", data);
      if (data.lectureId === lectureId) {
        setLivePasscode(data.passcode);
        // setLastUpdated(new Date(data.updatedAt));
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveLecture(lectureId as string);
      socketService.offPasscodeRefresh();
    };
  }, [lectureId, userRole]);

  const handleDone = useCallback(() => {
    router.back();
  }, [router]);

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
