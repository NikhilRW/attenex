import { useCallback } from "react";

import { useFocusEffect } from "expo-router";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const DEFAULT_DURATION_MS = 320;

export const useStudentDashboardFocusAnimation = (duration = DEFAULT_DURATION_MS) => {
  const focusProgress = useSharedValue(1);

  const onFocus = useCallback(() => {
    focusProgress.set(0);
    focusProgress.set(
      withTiming(1, {
        duration,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [duration, focusProgress]);

  useFocusEffect(onFocus);

  return focusProgress;
};

export const useStudentDashboardHeaderAnimation = () => {
  const focusProgress = useStudentDashboardFocusAnimation();

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [0.75, 1]),
    transform: [
      {
        translateX: interpolate(focusProgress.value, [0, 1], [22, 0]),
      },
      {
        scale: interpolate(focusProgress.value, [0, 1], [0.98, 1]),
      },
    ],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.35, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.35, 1], [16, 16, 0]),
      },
    ],
  }));

  return {
    headerAnimatedStyle,
    subtitleAnimatedStyle,
  };
};

export const useStudentDashboardEmptyAnimation = () => {
  const focusProgress = useStudentDashboardFocusAnimation(360);

  return useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 0.45, 1], [0, 0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 0.45, 1], [18, 18, 0]),
      },
    ],
  }));
};

export const useStudentDashboardLectureAnimation = (index: number) => {
  const focusProgress = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      focusProgress.set(0);
      focusProgress.set(
        withDelay(
          Math.min(index * 45, 180),
          withTiming(1, {
            duration: DEFAULT_DURATION_MS,
            easing: Easing.out(Easing.cubic),
          }),
        ),
      );
    }, [focusProgress, index]),
  );

  return useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 1], [18, 0]),
      },
      {
        scale: interpolate(focusProgress.value, [0, 1], [0.985, 1]),
      },
    ],
  }));
};
