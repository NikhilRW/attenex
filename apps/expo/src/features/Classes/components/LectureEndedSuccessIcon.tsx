import React from "react";

import Ionicons from "@react-native-vector-icons/ionicons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";

import { styles } from "@classes/styles/LectureEndedScreen.styles";

export const LectureEndedSuccessIcon: React.FC = () => {
  return (
    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.iconContainer}>
      <LinearGradient colors={["#10B981", "#059669"]} style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={80} color="white" />
      </LinearGradient>
    </Animated.View>
  );
};
