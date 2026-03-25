import styles from "@classes/styles/Classes.styles";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { withUnistyles } from "react-native-unistyles";

const PrimaryIcon = withUnistyles(Ionicons, (theme) => ({
  color: theme.primary.main,
}));

export const CreateLectureInfo: React.FC = () => {
  return (
    <Animated.View
      entering={FadeInUp.duration(600).delay(400).springify()}
      style={styles.infoCard}
    >
      <PrimaryIcon name="information-circle-outline" size={24} />
      <Text style={styles.infoText}>
        Students will be able to join this lecture using a unique code that will
        be generated automatically.
      </Text>
    </Animated.View>
  );
};
