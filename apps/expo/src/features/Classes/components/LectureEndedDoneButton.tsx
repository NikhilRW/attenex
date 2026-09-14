import React from "react";
import { Text } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { EaseView } from "react-native-ease";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedDoneButtonProps } from "@classes/types/props";

const DoneGradient = withUnistyles(LinearGradient, (theme) => ({
  colors: [theme.primary.main, "#3B82F6"] as const,
}));

export const LectureEndedDoneButton: React.FC<LectureEndedDoneButtonProps> = ({ onDone }) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 600 }}
      style={styles.doneButtonContainer}
    >
      <TouchableOpacity onPress={onDone} haptic="impact" activeOpacity={0.8}>
        <DoneGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
          <Ionicons name="checkmark" size={22} color="white" />
        </DoneGradient>
      </TouchableOpacity>
    </EaseView>
  );
};
