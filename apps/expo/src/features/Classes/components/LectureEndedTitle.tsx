import React from "react";
import { Text } from "react-native";

import Animated, { FadeInDown } from "react-native-reanimated";

import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedTitleProps } from "@classes/types/props";

export const LectureEndedTitle: React.FC<LectureEndedTitleProps> = ({ lectureTitle }) => {
  return (
    <Animated.View entering={FadeInDown.delay(300).springify()}>
      <Text style={styles.title}>{lectureTitle}</Text>
      <Text style={styles.subtitle}>Class has been ended successfully</Text>
    </Animated.View>
  );
};
