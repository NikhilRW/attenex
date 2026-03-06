import { lectureEndedStyles as styles } from "@classes/styles";
import { LectureEndedTitleProps } from "@classes/types";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const LectureEndedTitle: React.FC<LectureEndedTitleProps> = ({ lectureTitle }) => {
    return (
        <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text style={styles.title}>
                {lectureTitle}
            </Text>
            <Text style={styles.subtitle}>
                Class has been ended successfully
            </Text>
        </Animated.View>
    );
};
