import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedDoneButtonProps } from "@classes/types/props";
import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const DoneGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, "#3B82F6"] as const,
}));

export const LectureEndedDoneButton: React.FC<LectureEndedDoneButtonProps> = ({
  onDone,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.delay(600).springify()}
      style={styles.doneButtonContainer}
    >
      <TouchableOpacity onPress={onDone} haptic="impact" activeOpacity={0.8}>
        <DoneGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Done</Text>
          <Ionicons name="checkmark" size={22} color="white" />
        </DoneGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};
