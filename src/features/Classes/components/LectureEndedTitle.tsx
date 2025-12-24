import { useTheme } from "@/src/shared/hooks/useTheme";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { styles } from "../styles/LectureEndedScreen.styles";

interface LectureEndedTitleProps {
    lectureTitle: string | string[];
}

export const LectureEndedTitle = ({ lectureTitle }: LectureEndedTitleProps) => {
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
