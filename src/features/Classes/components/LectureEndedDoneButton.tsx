import { lectureEndedStyles as styles } from "@classes/styles";
import { LectureEndedDoneButtonProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useTheme } from "@shared/hooks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export const LectureEndedDoneButton: React.FC<LectureEndedDoneButtonProps> = ({
    onDone,
}) => {
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInUp.delay(600).springify()}
            style={styles.doneButtonContainer}
        >
            <TouchableOpacity onPress={onDone} activeOpacity={0.8}>
                <LinearGradient
                    colors={[colors.primary.main, "#3B82F6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.doneButton}
                >
                    <Text style={styles.doneButtonText}>Done</Text>
                    <Ionicons name="checkmark" size={22} color="white" />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};
