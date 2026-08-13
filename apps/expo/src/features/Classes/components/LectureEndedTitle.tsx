import React from "react";
import { Text } from "react-native";

import { EaseView } from "react-native-ease";

import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedTitleProps } from "@classes/types/props";

export const LectureEndedTitle: React.FC<LectureEndedTitleProps> = ({ lectureTitle }) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 300 }}
    >
      <Text style={styles.title}>{lectureTitle}</Text>
      <Text style={styles.subtitle}>Class has been ended successfully</Text>
    </EaseView>
  );
};
