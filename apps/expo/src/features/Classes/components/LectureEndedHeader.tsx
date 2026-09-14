import React from "react";
import { Text, View } from "react-native";

import Ionicons from "@react-native-vector-icons/ionicons";
import { EaseView } from "react-native-ease";
import { withUnistyles } from "react-native-unistyles";

import { TouchableOpacity } from "@/shared/components/TouchableOpacity";
import { styles } from "@classes/styles/LectureEndedScreen.styles";
import { LectureEndedHeaderProps } from "@classes/types/props";

const BackIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.text.primary,
}));

export const LectureEndedHeader: React.FC<LectureEndedHeaderProps> = ({ onDone }) => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 100 }}
      style={styles.header}
    >
      <TouchableOpacity onPress={onDone} haptic="selection" style={styles.backButton}>
        <BackIcon name="arrow-back" size={24} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Lecture Ended</Text>
      <View style={styles.headerSpacer} />
    </EaseView>
  );
};
