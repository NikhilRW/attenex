import { lectureEndedStyles as styles } from "@classes/styles";
import { LectureEndedHeaderProps } from "@classes/types";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shared/hooks";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const LectureEndedHeader: React.FC<LectureEndedHeaderProps> = ({ onDone }) => {
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.header}
        >
            <TouchableOpacity onPress={onDone} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Lecture Ended
            </Text>
            <View style={{ width: 40 }} />
        </Animated.View>
    );
};
