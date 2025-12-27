import { getPasscode } from "@classes/services/lectureService";
import { socketService } from "@shared/services/socketService";
import { logger } from "@shared/utils/logger";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import {
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const useLectureEnded = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lectureId, lectureTitle } = params;

  const [passcode, setPasscode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLastUpdated] = useState<Date | null>(null);

  // Animation for passcode glow effect
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPasscodeData = async () => {
    try {
      setLoading(true);
      const res = await getPasscode(lectureId as string);
      if (res.success) {
        setPasscode(res.data.passcode);
        setLastUpdated(new Date(res.data.updatedAt));
      }
    } catch (error: any) {
      logger.error("Failed to fetch passcode:", error);
      Alert.alert("Error", error.message || "Failed to fetch passcode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasscodeData();

    // Connect to socket and join lecture room
    socketService.connect();
    socketService.joinLecture(lectureId as string);

    // Listen for passcode refresh events
    socketService.onPasscodeRefresh((data) => {
      logger.info("Passcode refresh event received:", data);
      if (data.lectureId === lectureId) {
        setPasscode(data.passcode);
        setLastUpdated(new Date(data.updatedAt));
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveLecture(lectureId as string);
      socketService.offPasscodeRefresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
