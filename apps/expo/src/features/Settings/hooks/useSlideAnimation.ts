import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { SETTINGS_FOCUS_ANIMATION_DURATION_MS } from "../constants/common";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useSlideAnimation = () => {
  const focusProgress = useSharedValue(1);
  useFocusEffect(
    useCallback(() => {
      focusProgress.set(0);
      focusProgress.set(
        withTiming(1, {
          duration: SETTINGS_FOCUS_ANIMATION_DURATION_MS,
          easing: Easing.out(Easing.cubic),
        }),
      );
    }, [focusProgress]),
  );

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [0.65, 1]),
    transform: [
      {
        translateX: interpolate(focusProgress.value, [0, 1], [22, 0]),
      },
      {
        scale: interpolate(focusProgress.value, [0, 1], [0.98, 1]),
      },
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusProgress.value, [0, 1], [0.65, 1]),
    transform: [
      {
        translateY: interpolate(focusProgress.value, [0, 1], [18, 0]),
      },
    ],
  }));
  return {
    contentAnimatedStyle,
    headerAnimatedStyle,
  };
};
