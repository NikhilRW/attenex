import { FC, useEffect, useMemo } from "react";
import { Text } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { breathingAnimationConfiguration } from "../constants/common";
import { styles } from "../styles/AiAnalysisCard.styles";
import { AiAnalysisCardProps } from "../types/props";

const AiAnalysisCard: FC<AiAnalysisCardProps> = ({ text, isLoading, error }) => {
  const isLoadingSV = useSharedValue(false);

  useEffect(() => {
    isLoadingSV.value = isLoading;
  }, [isLoading, isLoadingSV]);

  const breathingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isLoadingSV.value
      ? withRepeat(
          withSequence(
            withTiming(0.4, breathingAnimationConfiguration),
            withTiming(1, breathingAnimationConfiguration),
          ),
          Infinity,
          true,
        )
      : 1,
  }));

  const toDisplay = useMemo(() => {
    return text !== "" || isLoading || !!error;
  }, [text, isLoading, error]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(toDisplay ? 1 : 0, { duration: 300 }),
  }));

  const displayText = useMemo(() => {
    if (text !== "") return text;
    if (isLoading) return "";
    if (error) return "Failed to load AI analysis. Please try again.";
    return "";
  }, [text, isLoading, error]);

  return (
    <Animated.View style={animatedContainerStyle}>
      <Text style={styles.labelText}>AI Analysis</Text>
      <Animated.View style={[styles.card, breathingAnimatedStyle]}>
        <Text style={styles.cardText}>{displayText}</Text>
      </Animated.View>
    </Animated.View>
  );
};

export default AiAnalysisCard;
