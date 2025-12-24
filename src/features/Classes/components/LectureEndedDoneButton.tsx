import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../styles/LectureEndedScreen.styles";

interface LectureEndedDoneButtonProps {
    onDone: () => void;
}

export const LectureEndedDoneButton = ({
    onDone,
}: LectureEndedDoneButtonProps) => {
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
