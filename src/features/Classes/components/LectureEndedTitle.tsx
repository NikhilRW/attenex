import { lectureEndedStyles as styles } from "@classes/styles";
import { LectureEndedTitleProps } from "@classes/types";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const LectureEndedTitle: React.FC<LectureEndedTitleProps> = ({ lectureTitle }) => {
    const { colors } = useTheme();

    return (
        <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
                {lectureTitle}
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Class has been ended successfully
            </Text>
        </Animated.View>
    );
};
