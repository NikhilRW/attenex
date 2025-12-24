import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { styles } from "../styles/LectureEndedScreen.styles";

interface LectureEndedHeaderProps {
    onDone: () => void;
}

export const LectureEndedHeader = ({ onDone }: LectureEndedHeaderProps) => {
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
