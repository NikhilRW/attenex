import { useEffect } from "react";

import {
  useSharedValue,
  useAnimatedStyle,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import { useUnistyles } from "react-native-unistyles";

export const useFilterChip = (isSelected: boolean) => {
  const { theme } = useUnistyles();
  const selectedValue = useSharedValue(isSelected ? 1 : 0);

  const animatedBorderColorStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selectedValue.value,
      [0, 1],
      [theme.surface.glassBorder, theme.primary.glow],
    ),
  }));

  useEffect(() => {
    selectedValue.set(withSpring(isSelected ? 1 : 0, { duration: 100 }));
  }, [isSelected, selectedValue]);
  return {
    animatedBorderColorStyle,
  };
};
