import { lectureEndedStyles as styles } from "@classes/styles";
import { LectureEndedHeaderProps } from "@classes/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const BackIcon = withUnistyles(Ionicons, (theme) => ({
    color: theme.text.primary,
}));

export const LectureEndedHeader: React.FC<LectureEndedHeaderProps> = ({ onDone }) => {
    return (
        <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.header}
        >
            <TouchableOpacity onPress={onDone} style={styles.backButton}>
                <BackIcon name="arrow-back" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
                Lecture Ended
            </Text>
            <View style={styles.headerSpacer} />
        </Animated.View>
    );
};
