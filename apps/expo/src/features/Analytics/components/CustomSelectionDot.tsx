import { useCallback } from "react";

import { Circle, Group, RoundedRect, Text, useFont } from "@shopify/react-native-skia";
import {
  useAnimatedReaction,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  CUSTOM_FONT,
  EMPTY_STRING,
  FONT_SIZE,
  RECTANGLE_RADIUS_X_AND_Y,
  RECT_HEIGHT,
  RECT_WIDTH,
} from "../constants/common";
import { CustomSelectionDotProps } from "../types/props";
import { getTextWidth } from "../utils/common";

function CustomSelectionDot({
  isActive,
  color,
  circleX,
  circleY,
  selectedValue,
}: CustomSelectionDotProps) {
  const circleRadius = useSharedValue(0);
  const skiaFont = useFont(CUSTOM_FONT, FONT_SIZE);
  const setIsActive = useCallback(
    (active: boolean) => {
      circleRadius.set(
        withSpring(active ? 5 : 0, {
          mass: 1,
          stiffness: 1000,
          damping: 50,
          velocity: 0,
        }),
      );
    },
    [circleRadius],
  );

  const textToShow = useDerivedValue(() => {
    return isActive.value ? selectedValue.value : EMPTY_STRING;
  }, []);
  const rectX = useDerivedValue(() => Math.max(4, circleX.value - RECT_WIDTH / 2), [circleX]);
  const rectY = useDerivedValue(() => Math.max(4, circleY.value - RECT_HEIGHT - 6), [circleY]);

  const textWidth = useDerivedValue(
    () => (skiaFont ? getTextWidth(skiaFont, selectedValue.value) : 0),
    [selectedValue, skiaFont],
  );

  const textX = useDerivedValue(
    () => rectX.value + (RECT_WIDTH - textWidth.value) / 2,
    [rectX, textWidth],
  );
  const textY = useDerivedValue(() => {
    const rectYAddedWithHalfHeight = rectY.value + RECT_HEIGHT / 2;
    if (!skiaFont) {
      return rectYAddedWithHalfHeight;
    }
    const metrics = skiaFont.getMetrics();
    return rectYAddedWithHalfHeight - (metrics.ascent + metrics.descent) / 2;
  }, [rectY, skiaFont]);

  useAnimatedReaction(
    () => isActive.value,
    (active) => {
      scheduleOnRN(setIsActive, active);
    },
    [isActive, setIsActive],
  );

  const rectangleWidth = useDerivedValue(
    () => (isActive.value === true ? RECT_WIDTH : 0),
    [isActive],
  );

  if (skiaFont === null) {
    return null;
  }

  return (
    <Group>
      <RoundedRect
        x={rectX}
        y={rectY}
        r={RECTANGLE_RADIUS_X_AND_Y}
        width={rectangleWidth}
        height={RECT_HEIGHT}
        zIndex={1}
        color="#131829"
      >
        <Text text={textToShow} font={skiaFont} color="white" x={textX} y={textY} />
      </RoundedRect>
      <Circle cx={circleX} cy={circleY} zIndex={-1} r={circleRadius} color={color} />
    </Group>
  );
}

export default CustomSelectionDot;
