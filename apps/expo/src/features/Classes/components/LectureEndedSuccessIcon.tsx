import React from "react";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { EaseView } from "react-native-ease";

import { styles } from "@classes/styles/LectureEndedScreen.styles";

export const LectureEndedSuccessIcon: React.FC = () => {
  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", damping: 120, stiffness: 900, mass: 4, delay: 200 }}
      style={styles.iconContainer}
    >
      <LinearGradient colors={["#10B981", "#059669"]} style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color="white" />
      </LinearGradient>
    </EaseView>
  );
};
