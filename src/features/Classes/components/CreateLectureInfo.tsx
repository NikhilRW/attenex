import { useTheme } from "@/src/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { styles } from "../styles/Classes.styles";

export const CreateLectureInfo = () => {
    const { colors } = useTheme();

    return (
        <Animated.View
            entering={FadeInUp.duration(600).delay(400).springify()}
            style={[styles.infoCard, { backgroundColor: colors.surface.cardBg }]}
        >
            <Ionicons
                name="information-circle-outline"
                size={24}
                color={colors.primary.main}
            />
            <Text style={[styles.infoText, { color: colors.text.secondary }]}>
                Students will be able to join this lecture using a unique code that will
                be generated automatically.
            </Text>
        </Animated.View>
    );
};
